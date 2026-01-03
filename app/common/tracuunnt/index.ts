'use strict';
import env from '#start/env'
import puppeteer from 'puppeteer';
import { createWorker } from "tesseract.js";

const minimal_args = [
  '--disable-speech-api', // 	Disables the Web Speech API (both speech recognition and synthesis)
  '--disable-background-networking', // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
  '--disable-background-timer-throttling', // Disable task throttling of timer tasks from background pages. ↪
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

class Search {

    async checkMST(url:string = env.get('URL_TRACUUNNT'), obj:any, page_close = true ) {
              const browser = await puppeteer.launch({ headless: env.get('HEADLESS') ,
                 defaultViewport: null ,
                 executablePath: env.get('executablePath'),
                 args: minimal_args }); // khởi tạo browser, full screen
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
                 await browser.close();
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