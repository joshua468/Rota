import { chromium } from 'playwright-core';

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

  const page = await browser.newPage({ viewport: { width: 440, height: 956 } });
  
  await page.goto('http://localhost:8081/sign-in', { waitUntil: 'load' });
  
  // Wait 1.5 seconds for all animations to complete
  await page.waitForTimeout(1500);

  const elements = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div')).filter(d => d.style.opacity);
    return divs.map(d => ({
      opacity: d.style.opacity,
      computedOpacity: window.getComputedStyle(d).opacity,
      transform: d.style.transform,
      computedTransform: window.getComputedStyle(d).transform,
    }));
  });

  console.log('DOM check after 1.5s:', JSON.stringify(elements, null, 2));

  await page.screenshot({ path: 'screenshots/test-sign-in.png' });
  console.log('Saved screenshots/test-sign-in.png');

  await page.close();
  await browser.close();
}

run().catch(console.error);
