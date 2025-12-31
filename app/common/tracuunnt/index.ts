'use strict';
import env from '#start/env'
import puppeteer from 'puppeteer';
import { createWorker } from "tesseract.js";

class Search {

    async checkMST(url:string = env.get('URL_TRACUUNNT'), obj:any, page_close = true ) {
              const browser = await puppeteer.launch({ headless: env.get('HEADLESS') ,
                 defaultViewport: null ,
                 executablePath: '/usr/bin/chromium-browser',
                 args: ['--no-sandbox', '--disable-setuid-sandbox'] }); // khởi tạo browser, full screen
              const page = await browser.newPage();  // tạo một trang web mới
              await page.goto(url, {waitUntil: 'domcontentloaded'}); // điều hướng trang web theo URL
                let selector = ".search_form";
               // Lấy hình ảnh captcha
                const captchaSelector = selector+' img';
                const fileElement = await page.waitForSelector(captchaSelector);
                await fileElement.screenshot({ path: 'captcha.png' });                

                // Giải mã captcha
                const worker = await createWorker("eng");
                try {
                    // Read the image file into a buffer or provide a URL
                    const imagePath = "./captcha.png"; 
                    const ret = await worker.recognize(imagePath);
                    let text:string = ret.data.text;     
                    console.log(text); 
                     await this.fillCheckMST(selector, page, text, obj);        
                } catch (error) {
                    console.error("OCR error:", error);
                } finally {
                    await worker.terminate();
                }             
                 const result:any = [];
                  result.data =  await this.loadCheckMST("#resultContainer tr", page);
                 if(page_close){
                 await page.close();
                 }
                 result.browserWSEndpoint = browser.wsEndpoint();
                 return result;
             
    }  


  async fillCheckMST(selector:string, page:any, text:string , obj: any ) {
              // Type the credentials into the form fields
            await page.waitForSelector(selector + " input[name='mst']",{ visible : true });
            await page.type(selector + " input[name='mst']", obj.tax_code, { delay: 100 }); // Replace tax code with the actual selector for the username/email input field          
            await page.waitForSelector(selector + " #captcha",{ visible : true });
            await page.type(selector + " #captcha", text, { delay: 100 });
            // Click the "Sign In" button to complete the login process.
            await page.click(selector + " .subBtn");
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