 import type { HttpContext } from '@adonisjs/core/http'
 import * as TCNT from '../common/tracuunnt/index.js'
 import env from '#start/env'

export default class TracuunntController {

        public async check_mst({ response , params , session }: HttpContext ) {
        const search = new TCNT.default();
        const url = env.get('URL_TRACUUNNT')+'tcnnt/mstdn.jsp';
        const result = await search.checkMST(url, params, false);
        session.put("browserWSEndpoint", result.browserWSEndpoint);
        response.json(result);
    }

}