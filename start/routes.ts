/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'


const ScawlersController = () => import('#controllers/scawlers_controller')

router.get('/scawler', [ScawlersController, 'load'])

const HoadondientuController = () => import('#controllers/hoadondientu_controller')
router
  .group(() => {
    router
      .group(() => {
        router.get('/check-invoice/:tax_code/:invoice_type/:invoice_no/:invoice_code/:tax_amount/:amount',  [HoadondientuController, 'check_invoice']).as('invoice.check') // final name
      // http://localhost:3333/api/v1/check-invoice/3101127110/1/4095/C25TNM/48000/648000
        router.get('/login-invoice/:key', [HoadondientuController, 'login_invoice']).as('invoice.login')
      // http://localhost:3333/api/v1/login-invoice/qOSYUWaU6NGvSsnzmxxJICVV02a_J_HBExxH8t325YcB2qqjW0Te189hQkc7b-sxVPijcc3LPvrkO4t5ioQ3dy5WVbyHLzpjLlvJK6n8pIg.WHZSeHVyUFBOSnNaYjVjOQ.MYMu7VQRFJEyg66f4USl6s-5rmp9URQqXbjAT3nl984
        router.get('/generate-key/:secret_key/:username/:password/:expiry_start_date/:expiry_end_date', [HoadondientuController, 'generate_key']).as('invoice.generate_key')
      // http://localhost:3333/api/v1/generate-key/987654321!!!!abcdef/4201758312/123456789aaA@@@/01-12-2025/31-12-2025
        router.get('/invoice/:invoice_group?/:invoice_type?/:start_date/:end_date', [HoadondientuController, 'invoice']).as('invoice.invoice')
      // http://localhost:3333/api/v1/invoice/2/1/01-12-2025/31-12-2025
        router.get('/info-user', [HoadondientuController, 'info_user']).as('invoice.info_user')
      })
      .prefix('v1')
      .as('v1')
  })
  .prefix('api')
  .as('api')
const HomeController = () => import('#controllers/home_controller')
router.get('/', [HomeController, 'index'])
router.get('/captcha', [HomeController, 'captcha'])