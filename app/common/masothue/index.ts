'use strict';
import env from '#start/env'
import puppeteer from 'puppeteer';

class Search {

     async checkMST(url:string = env.get('URL_TRACUUNNT'), obj:any, page_close = true ) {
                  const browser = await puppeteer.launch({ headless: env.get('HEADLESS') , defaultViewport: null , executablePath: '/usr/bin/chromium-browser' }); // khởi tạo browser, full screen
                  const page = await browser.newPage();  // tạo một trang web mới
                  await page.goto(url, {waitUntil: 'domcontentloaded'}); // điều hướng trang web theo URL
                  let selector = "#search";
                  await page.waitForSelector(selector,{ visible : true });
                  await page.type(selector, obj.tax_code, { delay: 100 }); 
                  //await page.click(selector + " .btn-search-submit");
                  const result =  await this.loadCheckMST(".table-taxinfo tbody tr", page);
                  if(page_close){
                  await page.close();
                  }
                  return result;
                 }

        async loadCheckMST(selector:string,page:any) { 
            await page.waitForSelector(selector, { visible : true });
                const rs = await page.$$eval(selector+' td', elements => {
                // Inside this function, you are in the browser's JavaScript environment
                return elements.map(el => el.textContent.trim());
                });
            return rs;
    }
}

export default Search;