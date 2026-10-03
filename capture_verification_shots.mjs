import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu=false',
    '--use-gl=angle',
    '--window-size=1920,1080',
    'http://localhost:5173/'
  ], { stdio: 'ignore' });

  console.log('Launched Chrome with remote debugging on port 9222...');

  // Wait for Chrome to open port
  let connected = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9222/json');
      if (res.ok) {
        connected = true;
        break;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!connected) {
    console.error('Failed to connect to Chrome debugging port.');
    chromeProcess.kill();
    process.exit(1);
  }

  console.log('Connected to Chrome debugging port! Fetching tabs...');
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('localhost:5173'));

  if (!pageTab) {
    console.error('No localhost:5173 page tab found!');
    chromeProcess.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  console.log('CDP WebSocket opened! Enabling Runtime and Page...');
  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Waiting 4s for assets and initial 3D render...');
  await new Promise(r => setTimeout(r, 4000));

  const checkpoints = [
    { label: '01_hero', scrollY: 0 },
    { label: '02_destinations', scrollY: 1800 },
    { label: '03_flight', scrollY: 3800 },
    { label: '04_campus', scrollY: 6400 },
    { label: '05_entrance', scrollY: 7000 },
    { label: '06_lobby', scrollY: 7500 },
    { label: '07_corridor', scrollY: 8200 },
    { label: '08_classroom', scrollY: 9100 },
    { label: '09_window_future', scrollY: 9550 },
    { label: '10_cta', scrollY: 9850 },
  ];

  for (const cp of checkpoints) {
    console.log(`Navigating to ${cp.label} (scrollY: ${cp.scrollY}px)...`);
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${cp.scrollY}, behavior: 'instant' });`
    });
    // Wait for GSAP & R3F frame update
    await new Promise(r => setTimeout(r, 1200));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const targetFile = path.join(__dirname, `${cp.label}.png`);
    fs.writeFileSync(targetFile, Buffer.from(ss.data, 'base64'));
    console.log(`Saved ${cp.label}.png!`);
  }

  console.log('All verification screenshots captured!');
  ws.close();
  chromeProcess.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
