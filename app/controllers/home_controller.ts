// import type { HttpContext } from '@adonisjs/core/http'
import  svgCaptcha  from 'svg-captcha';
import type { HttpContext } from '@adonisjs/core/http'
import * as HDDT from '../common/hoadondientu/index.js';
import { Encryption } from '@adonisjs/core/encryption'
import env from '#start/env'


export default class HomeController {
    public async index({ view }: HttpContext) {
         return view.render('welcome')
    }
    
    public async captcha({ request, response, session }: HttpContext) {
        const captcha = svgCaptcha.create({
                size: 6, // Độ dài chuỗi 4 ký tự
                noise: 2, // 2 đường nhiễu
                //color: false, // Kích hoạt màu sắc
                //background: '#D3D3D3', // Màu nền xám nhạt
                width: "150",   // Chiều rộng hình ảnh
                height: "50",  // Chiều cao hình ảnh
                fontSize: 30,   // Kích thước font chữ
                //ignoreChars: '0o1i' // Bỏ qua các ký tự '0', 'o', '1', 'i'
            });        
        session.put('captcha', captcha.text);
        response.safeHeader('Content-Type', 'image/svg+xml');
        response.status(200).send(captcha.data);
    }

    public async login_invoice({ response , params }: HttpContext) {
        const help = new HDDT.default();
        const url = 'https://hoadondientu.gdt.gov.vn/';
        const encryption = new Encryption({
            secret: env.get('SECRET_KEY'), // Replace with your actual secret key
        })
        var key:any = encryption.decrypt(params.key);     
        if(!Array.isArray(key) || key.length !== 4){
            response.status(400).send('Key không hợp lệ vui lòng liên hệ admin (' + env.get('CONTACT_ADMIN') + ') để được hỗ trợ');
            return;
        }
        const usename = key[0];
        const password = key[1];
        const expiry_start_date = key[2];
        const expiry_end_date = key[3];
        if(new Date(expiry_start_date) > new Date() || new Date(expiry_end_date) < new Date()){
            response.status(200).send('Key đã hết hạn sử dụng hoặc chưa đăng ký vui lòng liên hệ admin (' + env.get('CONTACT_ADMIN') + ') để được hỗ trợ');
        }else{          
            const result =await help.login(url, usename, password);
            if(result == undefined){
                 response.status(200).send("Đăng nhập thành công");
            }else{
                 response.status(200).send(result);
            }           
        }
      
    }

    public async check_invoice({ response , params }: HttpContext ) {
        const help = new HDDT.default();
        const url = 'https://hoadondientu.gdt.gov.vn/';
        const result = await help.checkInvoice(url, params);
        response.status(200).send(result);
    }

    public async generate_key({ response , params }: HttpContext) {
      const encryption = new Encryption({
            secret: env.get('SECRET_KEY'), // Replace with your actual secret key
        })
        // Array
        var key = encryption.encrypt([params.username, params.password, params.expiry_start_date, params.expiry_end_date]);
        response.status(200).send(key);
    }
}