 import type { HttpContext } from '@adonisjs/core/http'
 import * as TCNT from '../common/tracuunnt/index.js'
 import env from '#start/env'

export default class ApitracuunntController {

        public async check_mst({ response , params  }: HttpContext ) {
        const search = new TCNT.default();
        const url = env.get('URL_TRACUUNNT')+'tcnnt/mstdn.jsp';
        const result = await search.checkMST(url, params, true);
        response.json(result);
    }

}