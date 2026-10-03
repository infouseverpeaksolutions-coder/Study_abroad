const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function verifyProduction() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tempDir = path.join(os.tmpdir(), 'chrome_prod_' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--user-data-dir=' + tempDir,
    '--no-sandbox',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  http.get('http://127.0.0.1:9232/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      try {
        const targets = JSON.parse(data);
        const page = targets.find(t => t.type === 'page');
        if (!page) {
          console.error('No page found');
          proc.kill();
          return;
        }

        const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
        let idCounter = 1;

        function send(method, params = {}) {
          return new Promise((resolve) => {
            const id = idCounter++;
            const handler = (evt) => {
              const msg = JSON.parse(evt.data);
              if (msg.id === id) {
                ws.removeEventListener('message', handler);
                resolve(msg.result);
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
          });
        }

        ws.onopen = async () => {
          console.log('WS connected. Setting viewport to 1440x900...');
          await send('Console.enable');
          await send('Runtime.enable');

          await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
            mobile: false
          });

          await new Promise(r => setTimeout(r, 2500));

          // 1. Capture Hero (Scene 01: Real Earth)
          console.log('Capturing Scene 01: Hero / Earth...');
          const shot1 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(__dirname, 'prod_1_earth.png'), Buffer.from(shot1.data, 'base64'));

          // 2. Scroll to Destinations (Scene 02: 22% of 8000px = 1760px)
          console.log('Capturing Scene 02: Destinations...');
          await send('Runtime.evaluate', {
            expression: `window.scrollTo({ top: 1760 });`
          });
          await new Promise(r => setTimeout(r, 2500));
          const shot2 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(__dirname, 'prod_2_destinations.png'), Buffer.from(shot2.data, 'base64'));

          // 3. Scroll to Flight (Scene 03/04: 50% of 8000px = 4000px)
          console.log('Capturing Scene 03/04: Flight...');
          await send('Runtime.evaluate', {
            expression: `window.scrollTo({ top: 4000 });`
          });
          await new Promise(r => setTimeout(r, 2500));
          const shot3 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(__dirname, 'prod_3_flight.png'), Buffer.from(shot3.data, 'base64'));

          // 4. Scroll to Campus Arrival (Scene 05/06: 78% of 8000px = 6240px)
          console.log('Capturing Scene 05/06: Campus Arrival...');
          await send('Runtime.evaluate', {
            expression: `window.scrollTo({ top: 6240 });`
          });
          await new Promise(r => setTimeout(r, 2500));
          const shot4 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(__dirname, 'prod_4_campus.png'), Buffer.from(shot4.data, 'base64'));

          // 5. Scroll into 2D Universities section
          console.log('Capturing 2D Editorial: Universities...');
          await send('Runtime.evaluate', {
            expression: `document.querySelector('#universities').scrollIntoView();`
          });
          await new Promise(r => setTimeout(r, 1500));
          const shot5 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(__dirname, 'prod_5_universities.png'), Buffer.from(shot5.data, 'base64'));

          // 6. Scroll into Calculator & Services
          console.log('Capturing 2D Editorial: Calculator & Pathway...');
          await send('Runtime.evaluate', {
            expression: `document.querySelector('#calculator').scrollIntoView();`
          });
          await new Promise(r => setTimeout(r, 1500));
          const shot6 = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(__dirname, 'prod_6_calculator.png'), Buffer.from(shot6.data, 'base64'));

          console.log('VERIFICATION COMPLETE! All 6 comprehensive GSAP screenshots written.');
          proc.kill();
          process.exit(0);
        };

      } catch (err) {
        console.error('Error in verification:', err);
        proc.kill();
        process.exit(1);
      }
    });
  });
}

verifyProduction();
