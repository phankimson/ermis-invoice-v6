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
        router.get('/check-invoice/:tax_code/:invoice_no/:invoice_code/:tax_amount/:amount',  [HomeController, 'check_invoice']).as('invoice.check') // final name
      })
      .prefix('v1')
      .as('v1')
  })
  .prefix('api')
  .as('api')

router.get('/', [HomeController, 'index'])
router.get('/login-invoice', [HomeController, 'login_invoice'])
router.get('/captcha', [HomeController, 'captcha'])