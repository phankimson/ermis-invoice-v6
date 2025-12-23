'use strict';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import env from '#start/env'

class Help {
  async login(url: string = env.get('URL_HOADONDIENTU'), obj:any) {
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

            await this.fillLogin(".home-tabs-login", page, text, obj.username, obj.password);
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

    async reconnect (url: string = env.get('URL_HOADONDIENTU'), browserWSEndpoint:string){
      const browser = await puppeteer.connect({
        browserWSEndpoint: browserWSEndpoint,
        defaultViewport: null
      });

      // You can now interact with pages in the existing browser
      const pages = await browser.pages();
      const page = await pages.find(p => p.url() === url); // Find a specific page by URL

      if (page) {
        //await page.goto(url, {waitUntil: 'load'});
        return page;
        //console.log(await page.title());
      } else {
        const newPage = await browser.newPage();
        await newPage.goto(url, {waitUntil: 'load'});
        //console.log(await newPage.title());
        return newPage;
      }
    }

    async loadInfoUser(url: string = env.get('URL_HOADONDIENTU'), current_url:string , browserWSEndpoint:string ,selector:string, page_close = true){    
         const page = await this.reconnect(current_url,browserWSEndpoint);  //
            if(url != current_url){
              await this.clickMenuInvoice(".flex-space",page,'5','1');
            }            
             await page.waitForSelector(selector, { timeout: 1000 });   
            const rs = await page.$$eval(selector+' td', elements => {
              // Inside this function, you are in the browser's JavaScript environment
              return elements.map(el => el.textContent.trim());
            });
          if(page_close){
            await page.close();
          }  
        return rs;        
    }   

    async loadAllInvoice(url: string = env.get('URL_HOADONDIENTU'), current_url:string , browserWSEndpoint:string ,selector:string,search:any, page_close = true){      
          const page = await this.reconnect(current_url,browserWSEndpoint);  //
          if(url != current_url){
            await this.clickMenuInvoice(".flex-space",page,'7','1');
          }  
          let ele = "";
           if(search.invoice_group == 1){
            ele = ".ant-tabs-tabpane-active:first-child";
           }else{
            ele = ".ant-tabs-tabpane-active:nth-child(2)";
           }         
          await this.fillSearchInvoice(page,ele,search);
          await page.waitForSelector(selector, { timeout: 1000 });    
          const rs = await page.$$eval(ele+selector, elements => {
            // Inside this function, you are in the browser's JavaScript environment
            return elements.map((e) =>
              [...e.querySelectorAll("td")]
                .map((e) => e.textContent.trim())
            );
          });   
        if(page_close){
            await page.close();
          }  
        return rs;        
    }

    async excelAllInvoice (url: string = env.get('URL_HOADONDIENTU'), current_url:string , browserWSEndpoint:string ,selector:string,search:any, page_close = true){ 
        const page = await this.reconnect(current_url,browserWSEndpoint);  //        
         if(url != current_url){
            await this.clickMenuInvoice(".flex-space",page,'7','1');
          } 
        let ele = "";
           if(search.invoice_group == 1){
            ele = ".ant-tabs-tabpane-active:first-child";
           }else{
            ele = ".ant-tabs-tabpane-active:nth-child(2)";
           }         
         await this.fillSearchInvoice(page,ele,search);
         await page.waitForSelector(ele+selector,{ visible : true });    
         await page.click(ele+selector);

         if(page_close){
            await page.close();
          }  
        return true;
    }

    async fillSearchInvoice(page:any,selector:string,search:any) {
          const invoice_group = search.invoice_group || 1;
          const invoice_type = search.invoice_type || 1;
          const start_date = await this.convertDate(search.start_date);
          let end_date = '';
          if(new Date(search.end_date) < new Date()){
            end_date = await this.convertDate(search.end_date);
          }else{
            const today = new Date();
            end_date = await today.toLocaleDateString('en-GB'); 
          }          
          // Nhóm hóa đơn ( Hóa đơn đầu ra, hóa đơn đầu vào )      
          await page.waitForSelector('.ant-tabs-nav:first-child');     
          await page.click('.ant-tabs-nav:first-child .ant-tabs-tab:nth-child('+invoice_group+')');
          // Loại hóa đơn (Hóa đơn điện tử , hóa đơn khởi tạo tính tiền)
          await page.waitForSelector(selector, { timeout: 1000 });     
          await page.click(selector+' .ant-tabs-tab:nth-child('+invoice_type+')');    
          //
          await page.waitForSelector(selector+' #tngay svg', { timeout: 1000 }); 
          await page.click(selector+' #tngay svg');
          await page.waitForSelector(selector+' #tngay input', { timeout: 1000 }); 
          await page.click(selector+' #tngay input');
          await page.waitForSelector('.ant-calendar-input ', { timeout: 1000 });  
          await page.type(".ant-calendar-input ", start_date, { delay: 100 });
          await page.click(selector+' .ld-header');
          // 
          await page.waitForSelector(selector+' #dngay svg', { timeout: 1000 }); 
          await page.click(selector+' #dngay svg');
          await page.waitForSelector(selector+' #dngay input', { timeout: 1000 }); 
          await page.click(selector+' #dngay input');
          await page.waitForSelector('.ant-calendar-input ', { timeout: 1000 });  
            if(new Date(search.end_date) < new Date()){
            end_date = await this.convertDate(search.end_date);
          }else{
            const today = new Date();
            end_date = await today.toLocaleDateString('en-GB'); 
          }  
          await page.type(".ant-calendar-input ", end_date, { delay: 100 });
          await page.click(selector+' .ld-header');
          //
          if(invoice_type == 2 && invoice_group == 2){
            await page.waitForSelector(selector+' #ttxly', { timeout: 1000 }); 
            await page.click(selector+' #ttxly');
            await page.click('.ant-select-dropdown-menu-item:nth-child(3)'); // Select
          }
          await page.waitForSelector(selector+' button[type="submit"]');
          await page.click(selector+' button[type="submit"]');
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
    
             var model = env.get('MODEL_CAPCHA_HDDT');
          
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

  async checkInvoice(url:string = env.get('URL_HOADONDIENTU'), obj:any, page_close = true ) {
         const browser = await puppeteer.launch({ headless: false , defaultViewport: null }); // khởi tạo browser, full screen
            const page = await browser.newPage();  // tạo một trang web mới
            await page.goto(url, {waitUntil: 'domcontentloaded'}); // điều hướng trang web theo URL
            await page.click("button.ant-modal-close");

            const text:string = await this.captcha(page,".home-tabs-search .Captcha__Image-sc-1up1k1e-1");

            await this.fillCheckInvoice(".home-tabs-search", page, text, obj);
            const result = await this.loadCheckInvoice(".styles__SearchContentBox-sc-1ljhobs-0", page);
            if(page_close){
             await page.close();
            }
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

  async clickMenuInvoice(selector:string,page:any,child:string,page_no:string){
     await page.waitForSelector(selector, { visible : true });
     await page.click(selector + ' .ml-menu-item:nth-child('+child+')');
     await page.waitForSelector('.ant-dropdown-menu-item:nth-child('+page_no+')');
     await page.click('.ant-dropdown-menu-item:nth-child('+page_no+')')
  }

    async convertDate(dateString:string){
      const dateParts = dateString.split('-'); 
      // The order of elements is preserved
      const newDateString = dateParts.join('/');
      return newDateString;
    }
}
export default Help;
    
