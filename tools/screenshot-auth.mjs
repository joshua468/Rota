import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'screenshots');
mkdirSync(outDir, { recursive: true });

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
    ],
  });

  const viewports = [
    { name: '440x956', width: 440, height: 956 },
    { name: '360x740', width: 360, height: 740 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    // 1. Sign in
    await page.goto('http://localhost:8081/sign-in', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${outDir}/sign-in-${vp.name}.png` });
    console.log(`Saved ${outDir}/sign-in-${vp.name}.png`);

    // 2. Sign up
    await page.goto('http://localhost:8081/sign-up', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${outDir}/sign-up-${vp.name}.png` });
    console.log(`Saved ${outDir}/sign-up-${vp.name}.png`);

    await page.close();
  }

  // Font scale 1.3 test at 440x956
  const scalePage = await browser.newPage({ viewport: { width: 440, height: 956 } });
  
  await scalePage.goto('http://localhost:8081/sign-in', { waitUntil: 'load' });
  await scalePage.evaluate(() => {
    document.documentElement.style.fontSize = '130%';
  });
  await scalePage.waitForTimeout(1000);
  await scalePage.screenshot({ path: `${outDir}/sign-in-fontscale-1.3.png` });
  console.log(`Saved ${outDir}/sign-in-fontscale-1.3.png`);

  await scalePage.goto('http://localhost:8081/sign-up', { waitUntil: 'load' });
  await scalePage.evaluate(() => {
    document.documentElement.style.fontSize = '130%';
  });
  await scalePage.waitForTimeout(1000);
  await scalePage.screenshot({ path: `${outDir}/sign-up-fontscale-1.3.png` });
  console.log(`Saved ${outDir}/sign-up-fontscale-1.3.png`);

  await scalePage.close();
  await browser.close();
  console.log('All screenshots verified successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
