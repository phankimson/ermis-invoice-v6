import type { HttpContext } from '@adonisjs/core/http'


export default class HoadondientuController {
    public async index({ view }: HttpContext) {
        return view.render('hoadondientu/index')
    }
    public async login_key({ view }: HttpContext) {
        return view.render('hoadondientu/login_key')
    }     
}