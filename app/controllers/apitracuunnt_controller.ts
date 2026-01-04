 import type { HttpContext } from '@adonisjs/core/http'
 import * as TCNT from '../common/tracuunnt/index.js'
 import env from '#start/env'

export default class ApitracuunntController {

        public async check_mst({ response , params  }: HttpContext ) {
        const search = new TCNT.default();
        const url = env.get('URL_TRACUUNNT')+'tcnnt/mstdn.jsp';
        try{    
        const result = await search.checkMST(url, params, true);
        response.json(result);
        }catch(e){
           response.status(502).send("Không thể kết nối đến máy chủ: "+e.message); 
        }
    }

}