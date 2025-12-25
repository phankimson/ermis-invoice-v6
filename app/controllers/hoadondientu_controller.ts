import type { HttpContext } from '@adonisjs/core/http'
import * as HDDT from '../common/hoadondientu/index.js'
import { Encryption } from '@adonisjs/core/encryption'
import env from '#start/env'
import Excel from 'exceljs'
import app from '@adonisjs/core/services/app'
//import { unlink } from 'fs/promises'

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
        if(new Date(expiry_start_date) >= new Date() || new Date(expiry_end_date) <= new Date()){
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
                 session.put("current_url", url);
                 session.put("mst", obj.username);
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
        let params:any = [];
        params.url = env.get('URL_HOADONDIENTU')+'quan-ly-he-thong/quan-ly-nguoi-dung'; // Sử dụng cho điều hướng trang web
        params.current_url = session.get('current_url'); // Đường link hiện tại
        params.browserWSEndpoint = session.get("browserWSEndpoint"); // Session connect lại
        params.selector = ".ant-table-row";
        params.page_close = false;

        //console.log(browserWSEndpoint);
            if(!params.browserWSEndpoint){
                response.status(401).send('Chưa đăng nhập vui lòng đăng nhập trước khi lấy thông tin người dùng');
                return;
            }
         try {
        const rs = await help.loadInfoUser(params);
        session.put("current_url", params.url);
        response.json(rs);
        return;
        } catch (err) {
            response.status(502).send("Lỗi khi lấy xử lý dữ liệu");  
            return;
            //session.forget("browserWSEndpoint");
        }
    }

    public async invoice ({ response , session , params }: HttpContext ) {
        const help = new HDDT.default();
        params.url = env.get('URL_HOADONDIENTU')+'tra-cuu/tra-cuu-hoa-don';
        params.current_url = session.get('current_url');
        params.browserWSEndpoint = session.get("browserWSEndpoint");
        params.selector = " .ant-tabs-tabpane-active .ant-table-row";
        params.page_close = false;
        //console.log(browserWSEndpoint);
        if(!params.browserWSEndpoint){
            response.status(401).send('Chưa đăng nhập vui lòng đăng nhập trước khi lấy thông tin');
            return;
        }
        try {
            const rs = await help.loadAllInvoice(params);
            session.put("current_url", params.url);
            response.json(rs);
        return;
        } catch (err) {
           response.status(502).send("Lỗi khi lấy xử lý dữ liệu"); 
           return; 
            //session.forget("browserWSEndpoint");
        }
    }

    public async excel_invoice({ response , session, params  }: HttpContext ) {
        const help = new HDDT.default();
        params.url = env.get('URL_HOADONDIENTU')+'tra-cuu/tra-cuu-hoa-don';
        params.current_url = session.get('current_url');
        params.browserWSEndpoint = session.get("browserWSEndpoint");
        params.selector = " .ant-row-flex-start #icon_ketxuat";
        params.page_close = false;
        params.download = 'downloads/'+session.get("mst");
        //params.filename = 'DANH SÁCH HÓA ĐƠN.xlsx';
        //console.log(browserWSEndpoint);
            if(!params.browserWSEndpoint){
                response.status(401).send('Chưa đăng nhập vui lòng đăng nhập trước khi lấy thông tin');
                return;
            }
        try {
            const rs = await help.excelAllInvoice(params);             
            if(rs.status){    
            //const filePath = app.makePath(params.download+'/'+params.filename);            
            //await unlink(filePath);
            response.status(200).send("Xuất excel thành công");       
            session.put("current_url", params.url);
            }else{
             response.status(404).send("Xuất excel thất bại");     
            }
        return;
        } catch (err) {
            response.status(502).send("Lỗi khi lấy xử lý dữ liệu");   
            return; 
            //session.forget("browserWSEndpoint");
        }
    }

    public async e_invoice({ response , session  }: HttpContext ) {
    if(session.get("mst")){
        let download = 'downloads/'+session.get("mst");
        let filename = 'DANH SÁCH HÓA ĐƠN.xlsx';
            // Tạo một instance ExcelJS
        const workbook = new Excel.Workbook();
        // Trong AdonisJS, đường dẫn thường tương đối so với thư mục gốc
        const absolutePath:any = app.makePath(download+'/'+filename);

        // Đọc file
        await workbook.xlsx.readFile(absolutePath); // tmpPath là đường dẫn tạm thời của file

        const worksheet:any = workbook.getWorksheet(1); // Lấy sheet đầu tiên
        const data:any = [];

        // Duyệt qua các hàng (bỏ qua hàng tiêu đề nếu có)
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 6) { // Bỏ qua hàng tiêu đề (hàng 1)
            const rowData:any = {};
            row.eachCell((cell, colNumber) => {
            // Lấy tên cột (nếu có) hoặc dùng số cột
            const header = worksheet.getCell(6, colNumber).value;
            rowData[header] = cell.value;
            });
            data.push(rowData);
        }
        });
        // `data` bây giờ là một mảng các object (JSON-like)
        // Bạn có thể trả về JSON trực tiếp
        return response.json(data);
    }else{
        return response.status(401).send('Chưa đăng nhập vui lòng đăng nhập trước khi lấy thông tin người dùng');
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