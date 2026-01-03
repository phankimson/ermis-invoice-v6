'use strict';
import env from '#start/env'
import puppeteer from 'puppeteer';

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
                  let selector = "#search";
                  await page.waitForSelector(selector,{ visible : true });
                  await page.type(selector, obj.tax_code, { delay: 100 }); 
                  //await page.click(selector + " .btn-search-submit");
                  const result =  await this.loadCheckMST(".table-taxinfo tbody tr", page);
                  if(page_close){
                  await browser.close();
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