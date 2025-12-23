import type { HttpContext } from '@adonisjs/core/http'
import * as HDDT from '../common/hoadondientu/index.js'
import { Encryption } from '@adonisjs/core/encryption'
import env from '#start/env'

export default class HoadondientuController {
      public async login_invoice({ response , params ,session}: HttpContext) {
        const help = new HDDT.default();
        const url = env.get('URL_HOADONDIENTU');
        const encryption = new Encryption({
            secret: env.get('SECRET_KEY'), // Replace with your actual secret key
        })
        var key:any = encryption.decrypt(params.key);     
        if(!Array.isArray(key) || key.length !== 4){
            response.status(401).send('Key không hợp lệ vui lòng liên hệ admin (' + env.get('CONTACT_ADMIN') + ') để được hỗ trợ');
            return;
        }
        var obj:any =[];
        obj.username = key[0];
        obj.password = key[1];
        const expiry_start_date = key[2];
        const expiry_end_date = key[3];
        if(new Date(expiry_start_date) > new Date() || new Date(expiry_end_date) < new Date()){
            response.status(401).send('Key đã hết hạn sử dụng hoặc chưa đăng ký vui lòng liên hệ admin (' + env.get('CONTACT_ADMIN') + ') để được hỗ trợ');
        }else{     
            // Check nếu đã lưu MST trong session
            const count_mst = session.has(obj.username)?session.get(obj.username):0;
            if(count_mst >= env.get('COUNT_LOGIN_FAIL')){
                response.status(400).send("Tài khoản của bạn đã đăng nhập sai quá nhiều lần, vui lòng liên hệ admin (" + env.get('CONTACT_ADMIN') + ") để được hỗ trợ");
                return;
            }     
            const result =await help.login(url, obj);
            if(result.status == true){
                 session.forget(obj.username);
                 session.put("browserWSEndpoint", result.browserWSEndpoint);
                 response.status(200).send("Đăng nhập thành công");
                 return;
            }else{
                 session.put(obj.username, count_mst + 1);
                 response.status(404).send("Đăng nhập không thành công vui lòng kiểm tra lại tài khoản hoặc liên hệ admin (" + env.get('CONTACT_ADMIN') + ") để được hỗ trợ");
                 return;
            }           
        }      
    }

    public async info_user ({ response , session }: HttpContext ) {
        const help = new HDDT.default();
        const url = env.get('URL_HOADONDIENTU')+'quan-ly-he-thong/quan-ly-nguoi-dung'; // Sử dụng cho điều hướng trang web hay bị lỗi
        //const url = env.get('URL_HOADONDIENTU');
        const browserWSEndpoint = session.get("browserWSEndpoint");
        //console.log(browserWSEndpoint);
            if(!browserWSEndpoint){
                response.status(401).send('Chưa đăng nhập vui lòng đăng nhập trước khi lấy thông tin người dùng');
                return;
            }
         try {
        const rs = await help.loadInfoUser(url, browserWSEndpoint, ".ant-table-row",true);
        response.status(200).send(rs);
        return;
        } catch (err) {
            response.status(502).send("Lỗi khi lấy xử lý dữ liệu");  
            //session.forget("browserWSEndpoint");
        }
    }

    public async invoice ({ response , session , params }: HttpContext ) {
        const help = new HDDT.default();
        const url = env.get('URL_HOADONDIENTU')+'tra-cuu/tra-cuu-hoa-don';
        const browserWSEndpoint = session.get("browserWSEndpoint");
        //console.log(browserWSEndpoint);
        if(!browserWSEndpoint){
            response.status(401).send('Chưa đăng nhập vui lòng đăng nhập trước khi lấy thông tin');
            return;
        }
        try {
            const rs = await help.loadAllInvoice(url, browserWSEndpoint, ".ant-table-row",params,true);
            response.status(200).send(rs);
        return;
        } catch (err) {
            response.status(502).send("Lỗi khi lấy xử lý dữ liệu");  
            //session.forget("browserWSEndpoint");
        }
    }

    public async excel_invoice({ response , session, params  }: HttpContext ) {
        const help = new HDDT.default();
        const url = env.get('URL_HOADONDIENTU')+'tra-cuu/tra-cuu-hoa-don';
        const browserWSEndpoint = session.get("browserWSEndpoint");
        //console.log(browserWSEndpoint);
        if(!browserWSEndpoint){
            response.status(401).send('Chưa đăng nhập vui lòng đăng nhập trước khi lấy thông tin');
            return;
        }
        try {
            const rs = await help.excelAllInvoice(url, browserWSEndpoint, ".ant-tabs-tabpane-active .ant-row-flex-start .ant-col:nth-child(7)",params,true);
            if(rs){
             response.status(200).send("Xuất excel thành công"); 
            }else{
             response.status(200).send("Xuất excel thất bại");     
            }
        return;
        } catch (err) {
            response.status(502).send("Lỗi khi lấy xử lý dữ liệu");   
            //session.forget("browserWSEndpoint");
        }
    }


    public async check_invoice({ response , params }: HttpContext ) {
        const help = new HDDT.default();
        const url = env.get('URL_HOADONDIENTU');
        const result = await help.checkInvoice(url, params, true);
        response.status(200).send(result);
    }

    public async generate_key({ response , params }: HttpContext) {       
      if(params.secret_key != env.get('SECRET_KEY').replace(/[^a-zA-Z0-9\s]/g, '!')+'def'){
         response.status(401).send('Mã key không hợp lệ vui lòng liên hệ admin (' + env.get('CONTACT_ADMIN') + ') để được hỗ trợ');
         return;
      }  
       const encryption = new Encryption({
            secret: env.get('SECRET_KEY'), // Replace with your actual secret key
        })      
        // Array
        var key = encryption.encrypt([params.username, params.password, params.expiry_start_date, params.expiry_end_date]);
        response.status(200).send(key);
        return;
    }
}