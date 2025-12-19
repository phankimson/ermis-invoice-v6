// import type { HttpContext } from '@adonisjs/core/http'
import { launch } from 'puppeteer';

export default class ScawlersController {
    public async load() {
        const browser = await launch({ headless: false }); // khởi tạo browser
        const page = await browser.newPage();  // tạo một trang web mới
        await page.goto("http://ermis.io.vn/vi/acc/login"); // điều hướng trang web theo URL

        // Type the credentials into the form fields
        await page.waitForSelector("#login_username");
        await page.type('#login_username', 'admins', { delay: 100 }); // Replace '#username' with the actual selector for the username/email input field
        await page.waitForSelector("#login_password");
        await page.type('#login_password', '123456', { delay: 100 }); // Replace '#password' with the actual selector for the password input field

        // Click the "Sign In" button to complete the login process.
            await page.click("#button_login");

        // You are now logged in. Proceed with your scraping logic here
        console.log('Logged in. Current URL:', page.url());

        //await browser.close(); // đóng trang web
    }
}