import puppeteer from "puppeteer";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-http2'] 
    
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  await page.setDefaultNavigationTimeout(10000);

  await page.goto("https://www.myntra.com/", {
    waitUntil: "domcontentloaded",
  });
  
  await page.waitForSelector('.desktop-searchBar');
  await page.type('.desktop-searchBar', "blue cardigan");
  await page.click('.desktop-submit');

  const imageUrls = [];

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  while (imageUrls.length < 5) {
    await delay(5000);

    const productImages = await page.$$('.product-base img');
    for (let img of productImages) {
      const src = await page.evaluate(el => el.src, img);
      imageUrls.push(src);
      if (imageUrls.length >= 5) break; // Break the loop after collecting 5 image URLs
    }
  }

  console.log(imageUrls);
  await browser.close();
};

// Start the scraping
getQuotes();
