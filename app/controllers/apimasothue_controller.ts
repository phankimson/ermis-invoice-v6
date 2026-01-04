import type { HttpContext } from '@adonisjs/core/http'
import * as MST from '../common/masothue/index.js'
import env from '#start/env'

export default class ApimasothueController {
        public async check_mst({ response , params  }: HttpContext ) {
        const search = new MST.default();
        const url = env.get('URL_MASOTHUE');
        try{
            const result = await search.checkMST(url, params, true);
            response.json(result);
        }catch(e){
           response.status(502).send("Không thể kết nối đến máy chủ: "+e.message); 
        }
  
    }

    public async check_mst_url({ response , params  }: HttpContext ) {
        const search = new MST.default();
        const url = env.get('URL_MASOTHUE');
         try{
        const result = await search.checkMstUrl(url, params, true);
        response.json(result);
         }catch(e){
           response.status(502).send("Không thể kết nối đến máy chủ: "+e.message); 
        }
    }
}