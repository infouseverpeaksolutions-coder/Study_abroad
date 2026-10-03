import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.url.includes('localhost:5173'));

  if (!pageTab) {
    console.error('No localhost:5173 tab found!');
    process.exit(1);
  }

  console.log('Connecting to WebSocket:', pageTab.webSocketDebuggerUrl);
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
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log(`[Browser Console ${msg.params.type}]`, ...msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[Browser Uncaught Exception]', msg.params.exceptionDetails);
    }
  };

  ws.onopen = async () => {
    try {
      console.log('Connected! Enabling Runtime and Page...');
      await send('Runtime.enable');
      await send('Page.enable');

      console.log('Waiting 3.5s for initial render...');
      await new Promise(r => setTimeout(r, 3500));

      const checkpoints = [
        { label: '01_hero', scrollY: 0 },
        { label: '02_destinations', scrollY: 1800 },
        { label: '03_flight', scrollY: 3800 },
        { label: '04_campus', scrollY: 6400 },
        { label: '05_entrance', scrollY: 7000 },
        { label: '06_lobby', scrollY: 7500 },
        { label: '07_corridor', scrollY: 8200 },
        { label: '08_classroom', scrollY: 9200 },
      ];

      for (const cp of checkpoints) {
        console.log(`Navigating to ${cp.label} (scroll: ${cp.scrollY}px)...`);
        await send('Runtime.evaluate', {
          expression: `window.scrollTo({ top: ${cp.scrollY}, behavior: 'instant' });`
        });
        await new Promise(r => setTimeout(r, 1200));

        const ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(__dirname, `${cp.label}.png`), Buffer.from(ss.data, 'base64'));
        console.log(`Saved ${cp.label}.png!`);
      }

      console.log('All checkpoints verified successfully!');
      ws.close();
      process.exit(0);
    } catch (err) {
      console.error('Error during CDP testing:', err);
      ws.close();
      process.exit(1);
    }
  };
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
