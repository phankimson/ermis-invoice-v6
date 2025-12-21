'use strict';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import env from '#start/env'

class Help {
  async login(url: string = env.get('URL_HOADONDIENTU'), username: string, password: string) {
    const browser = await puppeteer.launch({ headless: false , defaultViewport: null}); // khởi tạo browser
            const page = await browser.newPage();  // tạo một trang web mới
            await page.goto(url, {waitUntil: 'load'}); // điều hướng trang web theo URL
            await page.click("button.ant-modal-close");
            // Click the open login form mobile
            //await page.click("button.ant-btn-icon-only");    
          
            //page.$eval('.header-item:last-child span', element =>
            //    element.click()
            //);              
            //console.log('Browser WSEndpoint:', browserWSEndpoint);
            // Click the open login form desktop            
            page.$eval('.home-header-menu-item:last-child span', element =>
                element.click()
            );    
           
            const text:string = await this.captcha(page,".home-tabs-login .Captcha__Image-sc-1up1k1e-1");
            //console.log(solution);

            await this.fillLogin(".home-tabs-login", page, text, username, password);
            // You are now logged in. Proceed with your scraping logic here
            //console.log('Logged in. Current URL:', page.url());
            const login:any = [];
            // Lấy browserWSEndpoint để kết nối lại sau này nếu cần
            login.browserWSEndpoint = browser.wsEndpoint();
            login.status = await this.statusLogin(page,'div.home-header-buttons');
            await browser.disconnect();
            return login
            //await page.close(); // đóng trang
  }

      async statusLogin(page:any,selector:string){
        let loginStatus = false;
         await page.waitForSelector(selector).then(() => {
            loginStatus = true;
          }).catch(e => {
            loginStatus = false;  
          });
          return loginStatus;
      }

    async loadInfoUser(url: string = env.get('URL_HOADONDIENTU'), browserWSEndpoint:string ,selector:string){    
         const browser2 = await puppeteer.connect({ browserWSEndpoint });
         const page = await browser2.newPage();  // tạo một trang web mới
         await page.goto(url, {waitUntil: 'load'}); // điều hướng trang web theo URL  
             await page.waitForSelector(selector, { timeout: 1000 });   
            const rs = await page.$$eval(selector+' td', elements => {
              // Inside this function, you are in the browser's JavaScript environment
              return elements.map(el => el.textContent.trim());
            });
        await page.close();
        return rs;        
    }

    async loadAllInvoice(url: string = env.get('URL_HOADONDIENTU'), browserWSEndpoint:string ,selector:string,search:any){    
         const browser2 = await puppeteer.connect({ browserWSEndpoint });
         const page = await browser2.newPage();  // tạo một trang web mới
          await page.goto(url, {waitUntil: 'load'}); // điều hướng trang web theo URL  
          await page.waitForSelector("#tday input");
          await page.type("#tday input", search.start_date, { delay: 100 });
          await page.waitForSelector("#dngay input");
          await page.type("#tday input", search.end_date, { delay: 100 });
        
             await page.waitForSelector(selector, { timeout: 1000 });   
            const rs = await page.$$eval(selector +' td', elements => {
              // Inside this function, you are in the browser's JavaScript environment
              return elements.map(el => el.textContent.trim());
            });
        await page.close();
        return rs;        
    }
      
  async captcha(page:any,selector:string) {
        await page.waitForSelector(selector);
            const svgUrl = await page.$eval(selector, img => img.src);
            //console.log(svgUrl); // In ra URL của ảnh đầu tiên
            let base64 = svgUrl.replace('data:image/svg+xml;base64,', '');
            base64 = base64.split(',');
            const decodedString  = atob(base64);
    
            // 2. Load the SVG string into Cheerio
            const $ = cheerio.load(decodedString, {
                xmlMode: true // Important for handling SVG correctly as XML
            });
    
             var model =
            "eyJNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExMUUxMTFFMTFFaIjoiMiIsIk1MTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMTFFMTFFMTFFMTFFMTFFMTFFMTExMUUxMUUxMUUxMUUxMUUxMUUxMTExMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaIjoiMyIsIk1MTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFaTUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFaIjoiNCIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMTExMUUxMTFFMTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTExRTExRTExRTExRTExRWiI6IjUiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExRWiI6IjYiLCJNTExRTExRTExMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTExRTExRTExRTExMUUxMUUxMUUxMUUxMUVpNTExMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExMTFFMTFFMTFFMTFFMTFFMTExRTExMUUxMUUxMUUxMTFFaIjoiNyIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExMUUxMUUxMUUxMUUxMTExMUUxMUUxMUUxMUUxMTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExMUUxMUUxMUUxMUUxMUUxMUVoiOiI4IiwiTUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExMUVpNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWiI6IjkiLCJNTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMTFFMTExRWiI6InYiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMTFFMTFFMTFFMTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRWiI6IloiLCJNTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJkIiwiTUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExMUVoiOiJ4IiwiTUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUVoiOiJNIiwiTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMTFFMTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTExMTFFMTExRTExRTExMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMWk1MTFFMTFFMTFFMTFFMTExRTExMUUxMTFFMTFFaIjoicCIsIk1MTFFMTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFaTUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTExRTExRTExMUUxMTExRTExRTExMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaIjoiZiIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWiI6IkUiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWiI6Im4iLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJxIiwiTUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExMUVpNTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMTFFMTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFoiOiJ3IiwiTUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJXIiwiTUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJKIiwiTUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJUIiwiTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTExRTExRTExRTExRWk1MTExRTExMTExRTExMUUxMUUxMUUxMUUxMUUxMUVoiOiJCIiwiTUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaIjoiSCIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTExMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFpNTExMWiI6InIiLCJNTExRTExRTExRTExRTExRTExRTExRTExMUUxMUVpNTExRTExMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRWiI6InkiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTExMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRWiI6InUiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTExRTExRTExRTExRTExRTExMUUxMTExRTExRWk1MTExRTExRTExRTExRTExRTExRTExRWiI6ImoiLCJNTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExMUUxMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWiI6IlMiLCJNTExMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMTExRTExRTExRTExMUUxMUVoiOiJzIiwiTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJDIiwiTUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUVpNTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFoiOiJHIiwiTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRWiI6ImIiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMTFFMTFFaIjoiaCIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMWk1MTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJOIiwiTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRWiI6InoiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTExRTExRWk1MTExaIjoibSIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUVoiOiJYIiwiTUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTExRTExRTExRTExRTExRWk1MTFFMTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExMUUxMUUxMUVoiOiJ0IiwiTUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTExRTExMUUxMUUxMUUxMUUxMUVpNTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTExMTFFMTFFMTFFaIjoiUSIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTExRTExMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTExMUUxMUUxMUUxMUUxMUUxMTFFMTExRTExRTExMUUxMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJnIiwiTUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaIjoiViIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExRTExRWk1MTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaIjoiYSIsIk1MTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFaTUxMTFFMTFFMTFFMTFFMTFFMTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExMUVoiOiJBIiwiTUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUVoiOiJGIiwiTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJVIiwiTUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMTFFMTFFMTFFaTUxMTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFaTUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFaIjoiUiIsIk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVpNTExRTExRTExRTExMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJEIiwiTUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUVpNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTExRTExRTExRWiI6ImMiLCJNTExRTExRTExRTExRTExRTExRTExRTExRTExRTExMUUxMUUxMUUxMUVpNTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUVoiOiJrIiwiTUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExMTExRWk1MTFFMTFFMTFFMTExRTExRTExMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaIjoiSyIsIk1MTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExMUUxMUUxMUUxMUUxMUUxMUUxMTFFaTUxMUUxMUUxMUUxMUUxMUVpNTExRTExMTFFMTFFMTFFaIjoiZSIsIk1MTExRTExRTExRTExRTExRTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTExRTExRTExRTExRTExaIjoiWSIsIk1MTFFMTFFMTExRTExRTExRTExRWk1MTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFMTFFMTFFMTFFMTFFaTUxMUUxMUUxMUUxMUUxMUUxMUUxMUUxMTFFaIjoiUCJ9";
          
            var parsed_model = JSON.parse(atob(model))
    
            // 3. Select the <path> element 
            var svg = $('svg');
    
            svg.find('path').each((_, p) => { if($(p).attr('stroke') != undefined) $(p).remove()})
            var vals:any[] = [];
            svg.find('path').each(
                (_, p) => { 
                    let idx = parseInt($(p).attr("d").split(".")[0].replace("M", ""))
                    vals.push(idx)
                }
            )
            var sorted = [...vals].sort(function(a,b) { return a - b; })
            var solution = ['', '', '', '', '']     
            
            svg.find('path').each(
            (idx, p) => { 
                var pattern = $(p).attr('d').replace(/[0-9 \.]/g, "")
                //console.log($(p).attr('d'))
                //console.log(pattern)
                solution[sorted.indexOf(vals[idx])] = parsed_model[pattern]
            })
            let text = solution.join().split(',').join(''); 
            //console.log(solution);
            return text;
  }

  async fillLogin(selector:string, page:any, text:string , username:string, password:string) {
              // Type the credentials into the form fields
            await page.waitForSelector(selector + " #username");
            await page.type(selector + " #username", username, { delay: 100 }); // Replace '#username' with the actual selector for the username/email input field
            await page.waitForSelector(selector + " #password");
            await page.type(selector + " #password", password, { delay: 100 }); // Replace '#password' with the actual selector for the password input field
            await page.waitForSelector(selector + " #cvalue");
            await page.type(selector + " #cvalue", text, { delay: 100 });
            // Click the "Sign In" button to complete the login process.
            await page.click(selector + " .ButtonAnt__Button-sc-p5q16s-0");
  }

  async checkInvoice(url:string = env.get('URL_HOADONDIENTU'), obj:any ) {
         const browser = await puppeteer.launch({ headless: false , defaultViewport: null }); // khởi tạo browser, full screen
            const page = await browser.newPage();  // tạo một trang web mới
            await page.goto(url, {waitUntil: 'domcontentloaded'}); // điều hướng trang web theo URL
            await page.click("button.ant-modal-close");

            const text:string = await this.captcha(page,".home-tabs-search .Captcha__Image-sc-1up1k1e-1");

            await this.fillCheckInvoice(".home-tabs-search", page, text, obj);
            const result = await this.loadCheckInvoice(".styles__SearchContentBox-sc-1ljhobs-0", page);
            //await browser.close();
            return result;
  }

  async fillCheckInvoice(selector:string, page:any, text:string , obj: any ) {
              // Type the credentials into the form fields
            await page.waitForSelector(selector + " #nbmst");
            await page.type(selector + " #nbmst", obj.tax_code, { delay: 100 }); // Replace tax code with the actual selector for the username/email input field
            await page.click(selector + ' .ant-select-selection__rendered');
            await page.click('.ant-select-dropdown-menu-item:nth-child('+obj.invoice_type+')'); // Select invoice type
            await page.waitForSelector(selector + " #khhdon");
            await page.type(selector + " #khhdon", obj.invoice_code, { delay: 100 }); // Replace invoice code with the actual selector for the password input field
            await page.waitForSelector(selector + " #shdon");
            await page.type(selector + " #shdon", obj.invoice_no, { delay: 100 }); // Replace invoice no with the actual selector for the password input field
            await page.waitForSelector(selector + " #tgtthue");
            await page.type(selector + " #tgtthue", obj.tax_amount.toString(), { delay: 100 }); // Replace tax amount with the actual selector for the password input field
            await page.waitForSelector(selector + " #tgtttbso");
            await page.type(selector + " #tgtttbso", obj.amount.toString(), { delay: 100 }); // Replace amount with the actual selector for the password input field
            await page.waitForSelector(selector + " #cvalue");
            await page.type(selector + " #cvalue", text, { delay: 100 });
            // Click the "Sign In" button to complete the login process.
            await page.click(selector + " .ButtonAnt__Button-sc-p5q16s-0");
  }

  async loadCheckInvoice(selector:string,page:any) { 
     await page.waitForSelector(selector+ ' p:not([hidden])', { timeout: 2000 });
        const allPText = await page.evaluate((selector:string) => {
                // Select all <p> elements
                const pElements = document.querySelectorAll(selector +' p:not([hidden])');                
                // Convert the NodeList to an array and map to get the text content
                const pContents = Array.from(pElements).map(el => el.textContent);                
                // Return the serializable array back to the Node.js environment
                return pContents;
          }, selector); // 1. pass variable as an argument   
        return allPText;
  }
}
export default Help;
    
