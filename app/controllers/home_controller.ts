// import type { HttpContext } from '@adonisjs/core/http'
import  svgCaptcha  from 'svg-captcha';
import type { HttpContext } from '@adonisjs/core/http'


export default class HomeController {

    public async index({ view }: HttpContext) {
         return view.render('home')
    }    

    public async test({ view }: HttpContext) {
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

}