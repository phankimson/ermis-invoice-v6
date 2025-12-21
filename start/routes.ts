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

const HomeController = () => import('#controllers/home_controller')
router
  .group(() => {
    router
      .group(() => {
        router.get('/check-invoice/:tax_code/:invoice_type/:invoice_no/:invoice_code/:tax_amount/:amount',  [HomeController, 'check_invoice']).as('invoice.check') // final name
      // http://localhost:3333/api/v1/check-invoice/3101127110/1/4095/C25TNM/48000/648000
        router.get('/login-invoice/:key', [HomeController, 'login_invoice']).as('invoice.login')
      // http://localhost:3333/api/v1/login-invoice/<key>
        router.get('/generate-key/:username/:password/:expiry_start_date/:expiry_end_date', [HomeController, 'generate_key']).as('invoice.generate_key')
      // http://localhost:3333/api/v1/generate-key/4201758312/123456789aaA@@@/01-12-2025/31-12-2025
      })
      .prefix('v1')
      .as('v1')
  })
  .prefix('api')
  .as('api')

router.get('/', [HomeController, 'index'])
router.get('/captcha', [HomeController, 'captcha'])