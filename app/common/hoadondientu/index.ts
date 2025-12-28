'use strict';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import env from '#start/env'
import path from 'path'
import fs from 'fs'
import { createReadStream } from 'fs'
import unzipper from 'unzipper'

class Help {
  async login(url: string = env.get('URL_HOADONDIENTU'), obj:any) {
            const browser = await puppeteer.launch({ headless: env.get('HEADLESS') , defaultViewport: null}); // khởi tạo browser
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
         await page.waitForSelector(selector, { timeout: 1000 }).then(() => {
            loginStatus = true;
          }).catch(e => {
            loginStatus = false;  
          });
          return loginStatus;
      }

    async reconnect (url: string = env.get('URL_HOADONDIENTU'), browserWSEndpoint:string,waitUntil:any = 'load'){
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
        await newPage.goto(url, {waitUntil: waitUntil});
        //console.log(await newPage.title());
        return newPage;
      }
    }

    async loadInfoUser(params:any){    
          let page:any;
          if(env.get('PAGE_REDIRECTION') == true){
            page = await this.reconnect(params.url,params.browserWSEndpoint,'domcontentloaded');  //    
            params.page_close = true;    
          }else{
            page = await this.reconnect(params.current_url,params.browserWSEndpoint,'domcontentloaded');  // 
            if(params.url != params.current_url){
              await this.clickMenuInvoice(".flex-space",page,'5','1');
            }    
          }  
             await new Promise(resolve => setTimeout(resolve, 4000));                       
             await page.waitForSelector(params.selector, { visible : true });   
            const rs = await page.$$eval(params.selector+' td', elements => {
              // Inside this function, you are in the browser's JavaScript environment
              return elements.map(el => el.textContent.trim());
            });
          if(params.page_close){
            await page.close();
          }  
        return rs;        
    }   

    async loadAllInvoice(params:any){      
          let page:any;
          if(env.get('PAGE_REDIRECTION') == true){
            page = await this.reconnect(params.url,params.browserWSEndpoint,'load');  //    
            params.page_close = true;        
          }else{
            page = await this.reconnect(params.current_url,params.browserWSEndpoint,'load');  //  
            if(params.url != params.current_url){
              await this.clickMenuInvoice(".flex-space",page,'7','1');
            }  
          }       
          let ele = "";
           if(params.invoice_group == 1){
            ele = ".ant-tabs-tabpane-active:first-child";
           }else{
            ele = ".ant-tabs-tabpane-active:nth-child(2)";
           }         
          await this.fillSearchInvoice(page,ele,params);      
          let rs:any;
          let TableData:any;
          let i:number = 1;
          let total:number = 0;
          await page.waitForSelector(ele+' .styles__PageIndex-sc-eevgvg-3', { visible : true });
          const pageTotal = await page.$eval(ele+' .styles__PageIndex-sc-eevgvg-3', el => el.innerText);
          total = parseInt(String(pageTotal).replace(i+" / ", ""));
          while(i <= total){
            await page.waitForSelector(ele+' .styles__PageIndex-sc-eevgvg-3', { visible : true });
            const Total_current = await page.$eval(ele+' .styles__PageIndex-sc-eevgvg-3', el => el.innerText);
            total = parseInt(String(Total_current).replace(i+" / ", ""));
            //console.log(total);
                await page.waitForSelector(ele+params.selector, { timeout: 5000 }).then( async () => {
                TableData = await page.$$eval(ele+params.selector, elements => {
                // Inside this function, you are in the browser's JavaScript environment
                return elements.map(row => {
                  // For each row, select all cells (td) and get their text content
                  const cells = Array.from(row.querySelectorAll('td'));
                  return cells.map(cell => cell.innerText.trim());
                });
              }); 
              rs.push(TableData); 
                }).catch(async (e)=> {
                  rs = [];
                });  

            if(i < total){
              // Click button next      
              await new Promise(resolve => setTimeout(resolve, 4000)).then(async() => 
                 await page.waitForSelector(ele+' .anticon-right:not(.ant-tabs-tab-next-icon-target)', { visible : true }),
                 await page.click(ele+' .anticon-right:not(.ant-tabs-tab-next-icon-target)') 
              );
              i++;
            }else if(i > total){
              // Click button prev 
              await new Promise(resolve => setTimeout(resolve, 4000)).then(async() => 
              await page.waitForSelector(ele+' .anticon-left:not(.ant-tabs-tab-next-icon-target)', { visible : true }),
              await page.click(ele+' .anticon-left:not(.ant-tabs-tab-next-icon-target)') 
              );
              i--;  
            }else{
              break;
            }     
  
          }                        
                   
        if(params.page_close){
            await page.close();
          }  
        return rs;        
    }


    async loadPageInvoice(params:any){      
          let page:any;
          let page_invoice = (!params.page_invoice || params.page_invoice == 0) ?1:params.page_invoice;   
          //console.log(page_invoice);     
          if(env.get('PAGE_REDIRECTION') == true){
            page = await this.reconnect(params.url,params.browserWSEndpoint,'load');  //    
            params.page_close = true;        
          }else{
            page = await this.reconnect(params.current_url,params.browserWSEndpoint,'load');  //  
            if(params.url != params.current_url){
              await this.clickMenuInvoice(".flex-space",page,'7','1');
            }  
          }      
 
          let ele = "";
           if(params.invoice_group == 1){
            ele = ".ant-tabs-tabpane-active:first-child";
           }else{
            ele = ".ant-tabs-tabpane-active:nth-child(2)";
           }    
          let rs:any = [];  
          await this.changeInvoiceGroup(page,ele,params);         
          await page.waitForSelector(ele+' .styles__PageIndex-sc-eevgvg-3', { visible : true });
          const textpageTotal = await page.$eval(ele+' .styles__PageIndex-sc-eevgvg-3', el => el.innerText);
          let pageTotal = String(textpageTotal).split("/");
          let pageCurrent = parseInt(pageTotal[0]);
          let total = parseInt(pageTotal[1]);
          //console.log(total);
          //console.log(pageCurrent);
          if(page_invoice == total && total == 1){
              await this.fillSearchInvoice(page,ele,params); 
          }   
            if(page_invoice<=total){
              while(pageCurrent <= page_invoice || pageCurrent > page_invoice){                             
              await page.waitForSelector(ele+' .styles__PageIndex-sc-eevgvg-3', { visible : true });
              const textrspageTotal = await page.$eval(ele+' .styles__PageIndex-sc-eevgvg-3', el => el.innerText);
              pageTotal = String(textrspageTotal).split("/");
              pageCurrent = parseInt(pageTotal[0]);
              total = parseInt(pageTotal[1]);
               if(pageCurrent < page_invoice){
              // Click button next      
                 await new Promise(resolve => setTimeout(resolve, 4000)).then(async() => 
                 await page.waitForSelector(ele+' .anticon-right:not(.ant-tabs-tab-next-icon-target)', { visible : true }),
                 await page.click(ele+' .anticon-right:not(.ant-tabs-tab-next-icon-target)') 
              );
              pageCurrent++;
              }else if(pageCurrent > page_invoice || pageCurrent > total ){
                // Click button prev 
                await new Promise(resolve => setTimeout(resolve, 4000)).then(async() => 
                await page.waitForSelector(ele+' .anticon-left:not(.ant-tabs-tab-next-icon-target)', { visible : true }),
                await page.click(ele+' .anticon-left:not(.ant-tabs-tab-next-icon-target)') 
                );
                pageCurrent--;  
              }else{

              }
              await new Promise(resolve => setTimeout(resolve, 2000));   
              await page.waitForSelector(ele+params.selector, { timeout: 1000 }).then( async () => {
                rs = await page.$$eval(ele+params.selector, elements => {
                    // Inside this function, you are in the browser's JavaScript environment
                    return elements.map(row => {
                      // For each row, select all cells (td) and get their text content
                      const cells = Array.from(row.querySelectorAll('td'));
                      return cells.map(cell => cell.innerText.trim());
                    });
                  }); 
                }).catch(async (e)=> {
                  rs = [];
                });  
                if(pageCurrent == page_invoice){
                  break;
                }
             }                                 

        if(params.page_close){
            await page.close();
          }
       }       
               
        return rs;        
    }

    async excelAllInvoice (params:any){ 
      let page:any;
        if(env.get('PAGE_REDIRECTION') == true){
          page = await this.reconnect(params.url,params.browserWSEndpoint,'networkidle0');  //   
          params.page_close = true;         
        }else{
          page = await this.reconnect(params.current_url,params.browserWSEndpoint,'networkidle0');  //  
          if(params.url != params.current_url){
            await this.clickMenuInvoice(".flex-space",page,'7','1');
          } 
        }            
        let ele = "";
           if(params.invoice_group == 1){
            ele = ".ant-tabs-tabpane-active:first-child";
           }else{
            ele = ".ant-tabs-tabpane-active:nth-child(2)";
           }         
         // Define the download directory relative to the current working directory
         let rs:any = [];         
         rs.downloadPath = path.join(process.cwd(), params.download);  

         // Tạo thư mục 
          fs.mkdir(rs.downloadPath, (err) => {
            //if (err) {
            //    console.error('Lỗi khi tạo thư mục:', err);
            // } else {
            //    console.log('Thư mục đã được tạo thành công!');
            // }
          });
          
          // --- CRITICAL STEP: Configure the download behavior ---
          const client = await page.target().createCDPSession()
          await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: rs.downloadPath
          });

         await this.fillSearchInvoice(page,ele,params);
         //const imageItems = await page.$eval(ele+selector, element => element.innerHTML);
         //console.log(imageItems);
          await page.waitForSelector(ele+params.selector, { timeout: 3000 }).then(async () => {
            const current_element = await page.$(ele+params.selector);          
            await current_element.click();    
            rs.status = true;  
          }).catch(e => {
            rs.status = false;  
          });
       
         if(params.page_close){
            await page.close();
          }  
        return rs;
    }

    async fileInvoice(params:any){
       let page:any;
        if(env.get('PAGE_REDIRECTION') == true){
          page = await this.reconnect(params.url,params.browserWSEndpoint,'networkidle0');  //   
          params.page_close = true;         
        }else{
          page = await this.reconnect(params.current_url,params.browserWSEndpoint,'networkidle0');  //  
          if(params.url != params.current_url){
            await this.clickMenuInvoice(".flex-space",page,'7','1');
          } 
        }            
        let ele = "";
           if(params.invoice_group == 1){
            ele = ".ant-tabs-tabpane-active:first-child";
           }else{
            ele = ".ant-tabs-tabpane-active:nth-child(2)";
           }         
         // Define the download directory relative to the current working directory
         // Tìm số page hiện tại
          await page.waitForSelector(ele+' .styles__PageIndex-sc-eevgvg-3', { visible : true });
          const textpageTotal = await page.$eval(ele+' .styles__PageIndex-sc-eevgvg-3', el => el.innerText);
          let pageTotal = String(textpageTotal).split("/");
          let pageCurrent = parseInt(pageTotal[0]);
          //
         let rs:any = [];
         let itemPage = parseInt(params.row)+((pageCurrent-1)*50);  
         console.log(itemPage);       
         rs.downloadPath = path.join(process.cwd(), params.download+'/temp/'+itemPage);  
         rs.pdfPath = path.join(process.cwd(), params.download+'/pdf/'+itemPage); 
         rs.xmlPath = path.join(process.cwd(), params.download+'/xml/'+itemPage);   
         // Tạo thư mục 
          await fs.mkdir(params.download+'/temp', (err) => {
          });
          await fs.mkdir(params.download+'/pdf', (err) => {
          });
          await fs.mkdir(params.download+'/xml', (err) => {
          });
          await fs.mkdir(rs.downloadPath, (err) => {
          });
          await fs.mkdir(rs.pdfPath, (err) => {
          });
          await fs.mkdir(rs.xmlPath, (err) => {
          });
          
          // --- CRITICAL STEP: Configure the download behavior ---
          const client = await page.target().createCDPSession()
          await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: rs.downloadPath
          });
          //console.log(rs.downloadPath);
          try{
             // Get all row handles
           const rows = await page.$$(ele+params.selector);
             // Scroll the element into view
           await rows[params.row-1].click();
           const button_click = (await page.$$(ele+params.btn_selector));        
           await button_click[1].click();          
           // console.log(rs.downloadPath);   
           
           await new Promise(resolve => setTimeout(resolve, 5000));
           createReadStream(rs.downloadPath+'/invoice.zip')
          .pipe(unzipper.Extract({ path: rs.downloadPath }))
          .promise()
          .catch();
          await new Promise(resolve => setTimeout(resolve, 2000));
          await fs.rename(rs.downloadPath+'/invoice.xml', rs.xmlPath+'/invoice.xml', function (err) {
              if (err) throw err
              //console.log('Successfully moved!')
            });
          // Chuyển đổi html sang pdf
           await new Promise(resolve => setTimeout(resolve, 2000));
           const browser1 = await puppeteer.launch();
              const page1 = await browser1.newPage();    
              await page1.goto('file://'+rs.downloadPath+'/invoice.html');    
              await page1.pdf({
                path: rs.pdfPath+'/invoice.pdf',
                format: 'A4',
                margin: {
                      top: "1in",
                      left: "1in",
                      right: "1in",
                      bottom: "1in"
                }    
              });    
            await browser1.close();  
          
          // Xóa file 
           await fs.rmSync(rs.downloadPath, { recursive: true, force: true });

           rs.status = true;   
          }catch(e){
           rs.status = false;  
          }     
         if(params.page_close){
            await page.close();
          }  
        return rs;
    }

    async changeInvoiceGroup(page:any,selector:string,search:any){
          const invoice_group = search.invoice_group || 1;
          const invoice_type = search.invoice_type || 1;
            // Nhóm hóa đơn ( Hóa đơn đầu ra, hóa đơn đầu vào )      
          await page.waitForSelector('.ant-tabs-nav:first-child');     
          await page.click('.ant-tabs-nav:first-child .ant-tabs-tab:nth-child('+invoice_group+')');
          // Loại hóa đơn (Hóa đơn điện tử , hóa đơn khởi tạo tính tiền)
          await page.waitForSelector(selector, { visible : true });     
          await page.click(selector+' .ant-tabs-tab:nth-child('+invoice_type+')');    
          //
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
          await page.waitForSelector(selector, { visible : true });     
          await page.click(selector+' .ant-tabs-tab:nth-child('+invoice_type+')');    
          //
          await page.waitForSelector(selector+' #tngay svg',  { visible : true }); 
          await page.click(selector+' #tngay svg');    
          await page.waitForSelector(selector+' #tngay input',  { visible : true }); 
          await page.click(selector+' #tngay input');
          await page.waitForSelector('.ant-calendar-input ',  { visible : true });  
          await page.type(".ant-calendar-input ", start_date, { delay: 100 });
          await page.click(selector+' .ld-header');
          // 
          await page.waitForSelector(selector+' #dngay svg',  { visible : true }); 
          await page.click(selector+' #dngay svg');
          await page.waitForSelector(selector+' #dngay input',  { visible : true }); 
          await page.click(selector+' #dngay input');
          await page.waitForSelector('.ant-calendar-input ',  { visible : true });  
          await page.type(".ant-calendar-input ", end_date, { delay: 100 });
          await page.click(selector+' .ld-header');          

           if(invoice_type == 2 && invoice_group == 2){
            await page.waitForSelector(selector+' #ttxly',  { visible : true }); 
            await page.click(selector+' #ttxly');
            await page.waitForSelector('.ant-select-dropdown-menu-item:nth-child(3)',  { visible : true }); 
            await page.click('.ant-select-dropdown-menu-item:nth-child(3)'); // Select
          }
          await page.waitForSelector(selector+' button[type="submit"]',{ visible : true });
          await page.click(selector+' button[type="submit"]');
           if(invoice_type == 2 && invoice_group == 2){
            await page.waitForSelector(selector+' #ttxly',  { visible : true }); 
            await page.click(selector+' #ttxly');
            await page.waitForSelector('.ant-select-dropdown-menu-item:nth-child(1)',  { visible : true }); 
            await page.click('.ant-select-dropdown-menu-item:nth-child(1)'); // Reset
          }
          //   
           await new Promise(resolve => setTimeout(resolve, 2000))
           await page.waitForSelector(selector+' .ant-row-flex-start .ant-select-selection--single',  { visible : true });
           await page.click(selector+' .ant-row-flex-start .ant-select-enabled');
           await new Promise(resolve => setTimeout(resolve, 1000))
           await page.waitForSelector('.ant-select-dropdown-menu-item:nth-child(3)',  { visible : true });
           await page.click(".ant-select-dropdown-menu-item:nth-child(3)");
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
            await page.waitForSelector(selector + " #username",{ visible : true });
            await page.type(selector + " #username", username, { delay: 100 }); // Replace '#username' with the actual selector for the username/email input field
            await page.waitForSelector(selector + " #password",{ visible : true });
            await page.type(selector + " #password", password, { delay: 100 }); // Replace '#password' with the actual selector for the password input field
            await page.waitForSelector(selector + " #cvalue",{ visible : true });
            await page.type(selector + " #cvalue", text, { delay: 100 });
            // Click the "Sign In" button to complete the login process.
            await page.click(selector + " .ButtonAnt__Button-sc-p5q16s-0");
  }

  async checkInvoice(url:string = env.get('URL_HOADONDIENTU'), obj:any, page_close = true ) {
         const browser = await puppeteer.launch({ headless: env.get('HEADLESS') , defaultViewport: null }); // khởi tạo browser, full screen
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
            await page.waitForSelector(selector + " #nbmst",{ visible : true });
            await page.type(selector + " #nbmst", obj.tax_code, { delay: 100 }); // Replace tax code with the actual selector for the username/email input field
            await page.click(selector + ' .ant-select-selection__rendered');
            await page.click('.ant-select-dropdown-menu-item:nth-child('+obj.invoice_type+')'); // Select invoice type
            await page.waitForSelector(selector + " #khhdon",{ visible : true });
            await page.type(selector + " #khhdon", obj.invoice_code, { delay: 100 }); // Replace invoice code with the actual selector for the password input field
            await page.waitForSelector(selector + " #shdon",{ visible : true });
            await page.type(selector + " #shdon", obj.invoice_no, { delay: 100 }); // Replace invoice no with the actual selector for the password input field
            await page.waitForSelector(selector + " #tgtthue",{ visible : true });
            await page.type(selector + " #tgtthue", obj.tax_amount.toString(), { delay: 100 }); // Replace tax amount with the actual selector for the password input field
            await page.waitForSelector(selector + " #tgtttbso",{ visible : true });
            await page.type(selector + " #tgtttbso", obj.amount.toString(), { delay: 100 }); // Replace amount with the actual selector for the password input field
            await page.waitForSelector(selector + " #cvalue",{ visible : true });
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
    
