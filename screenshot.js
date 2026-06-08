const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  
  // Homepage with modal visible
  await page.goto('http://localhost:3333', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/fastbooker-modal.png', fullPage: true });
  console.log('Screenshot: home with modal');

  // Remove modal from DOM and screenshot clean home
  await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/fastbooker-home.png', fullPage: true });
  console.log('Screenshot: home page (clean)');

  // Navigate directly to a library
  await page.goto('http://localhost:3333/library/4b867ddd-46fd-4fe5-a57b-cdd4a3e1520d', { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => { const m = document.querySelector('.fixed.inset-0'); if (m) m.remove(); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/fastbooker-library.png', fullPage: true });
  console.log('Screenshot: library page');

  // Navigate to a floor  
  const floorId = await page.evaluate(() => {
    const link = document.querySelector('a[href*="/floor/"]');
    return link ? link.getAttribute('href') : null;
  });
  if (floorId) {
    await page.goto('http://localhost:3333' + floorId, { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(() => { const m = document.querySelector('.fixed.inset-0'); if (m) m.remove(); });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: '/tmp/fastbooker-floor.png', fullPage: true });
    console.log('Screenshot: floor/seats page');
  } else {
    console.log('No floor links found');
  }

  // Disclaimer page
  await page.goto('http://localhost:3333/disclaimer', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/fastbooker-disclaimer.png', fullPage: true });
  console.log('Screenshot: disclaimer page');

  // Mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3333', { waitUntil: 'networkidle', timeout: 15000 });
  await page.evaluate(() => { const m = document.querySelector('.fixed.inset-0'); if (m) m.remove(); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/fastbooker-mobile.png', fullPage: true });
  console.log('Screenshot: mobile');
  
  await browser.close();
  console.log('All done!');
})();
