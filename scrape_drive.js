import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://drive.google.com/drive/folders/1u3_ade0pU4ULhFYbkoSwb56lcDAhbvp6?usp=drive_link', { waitUntil: 'networkidle2' });
  
  // Wait for some Google Drive elements
  await new Promise(r => setTimeout(r, 5000)); // 5 sec to let JS load

  const files = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('div[role="row"]'));
    return items.map(item => item.innerText).filter(text => text.length > 0);
  });
  
  const content = await page.content();
  console.log("FILES FOUND:", files);
  
  const sheetLinks = Array.from(content.matchAll(/https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/g)).map(m => m[0]);
  console.log("SHEET LINKS:", [...new Set(sheetLinks)]);
  
  await browser.close();
})();
