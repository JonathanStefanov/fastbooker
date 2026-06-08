const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  
  // Homepage with university selector
  await page.goto('http://localhost:3333', { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => { const m = document.querySelector('.fixed.inset-0'); if (m) m.remove(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/fb-uni-home.png', fullPage: true });
  console.log('Screenshot: home with uni selector');

  // Click UniPD card
  try {
    const unipdCard = page.locator('text=UniPD').first();
    await unipdCard.click({ timeout: 5000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: '/tmp/fb-uni-unipd.png', fullPage: true });
    console.log('Screenshot: UniPD selected');
  } catch(e) {
    console.log('UniPD click error:', e.message.split('\n')[0]);
  }

  // Mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3333', { waitUntil: 'networkidle', timeout: 15000 });
  await page.evaluate(() => { const m = document.querySelector('.fixed.inset-0'); if (m) m.remove(); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/fb-uni-mobile.png', fullPage: true });
  console.log('Screenshot: mobile');
  
  await browser.close();
  console.log('All done!');
})();
