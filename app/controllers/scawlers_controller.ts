// import type { HttpContext } from '@adonisjs/core/http'
import { launch } from 'puppeteer';

export default class ScawlersController {
    public async load() {
        const browser = await launch({ headless: false }); // khởi tạo browser
        const page = await browser.newPage();  // tạo một trang web mới
        await page.goto("https://hoadondientu.gdt.gov.vn/", {waitUntil: 'load'}); // điều hướng trang web theo URL
        await page.click("button.ant-modal-close");
        await page.click("button.ant-btn-icon-only");

        await page.click('.header-item:last-child span'); // Click vào phần "Đăng nhập"

        // Type the credentials into the form fields
        await page.waitForSelector("#username");
        await page.type('#username', 'admins', { delay: 100 }); // Replace '#username' with the actual selector for the username/email input field
        await page.waitForSelector("#password");
        await page.type('#password', '123456', { delay: 100 }); // Replace '#password' with the actual selector for the password input field

        // Click the "Sign In" button to complete the login process.
        //await page.click(".ButtonAnt__Button-sc-p5q16s-0");

        // You are now logged in. Proceed with your scraping logic here
        console.log('Logged in. Current URL:', page.url());

        //await browser.close(); // đóng trang web
    }
}