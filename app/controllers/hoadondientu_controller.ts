import type { HttpContext } from '@adonisjs/core/http'
import moment from 'moment'

export default class HoadondientuController {
    public async index({ view }: HttpContext) {
        let start_date = moment().subtract(30, 'days').format("DD/MM/YYYY");
        let end_date = moment().format("DD/MM/YYYY");
        return view.render('hoadondientu/index', { start_date: start_date,end_date : end_date  })
    }
    public async login_key({ view ,session}: HttpContext) {
        session.forget("mst");
        return view.render('hoadondientu/login_key')
    }     
}