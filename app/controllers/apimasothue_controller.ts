import type { HttpContext } from '@adonisjs/core/http'
import * as MST from '../common/masothue/index.js'
import env from '#start/env'

export default class ApimasothueController {
        public async check_mst({ response , params  }: HttpContext ) {
        const search = new MST.default();
        const url = env.get('URL_MASOTHUE');
        const result = await search.checkMST(url, params, true);
        response.json(result);
    }
}