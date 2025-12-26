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
        router
          .group(() => {
            router.get('/check-invoice/:tax_code/:invoice_type/:invoice_no/:invoice_code/:tax_amount/:amount',  [HoadondientuController, 'check_invoice']).as('invoice.check') // final name

            router.get('/login-invoice/:key', [HoadondientuController, 'login_invoice']).as('invoice.login')
            
            router.get('/invoice/:invoice_group?/:invoice_type?/:start_date/:end_date', [HoadondientuController, 'invoice']).as('invoice.invoice')

            router.get('/p-invoice/:invoice_group?/:invoice_type?/:start_date/:end_date/:page_invoice?', [HoadondientuController, 'p_invoice']).as('invoice.p_invoice')
          
            router.get('/e-invoice', [HoadondientuController, 'e_invoice']).as('invoice.e_invoice')

            router.get('/excel-invoice/:invoice_group?/:invoice_type?/:start_date/:end_date', [HoadondientuController, 'excel_invoice']).as('invoice.excel_invoice')
            
            router.get('/file-invoice/:invoice_group?/:row', [HoadondientuController, 'file_invoice']).as('invoice.file_invoice')   

            router.get('/info-user', [HoadondientuController, 'info_user']).as('invoice.info_user')    
            
            router.get('/generate-key/:secret_key/:username/:password/:expiry_start_date/:expiry_end_date', [HoadondientuController, 'generate_key']).as('invoice.generate_key')
          
          })
          .prefix('v1')
          .as('v1')
      })
  .prefix('api')
  .as('api')
    })
.prefix('hddt')
.as('hddt')
const TracuunttController = () => import('#controllers/tracuunnt_controller')
router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.get('/check-mst/:tax_code',  [TracuunttController, 'check_mst']).as('invoice.check_mst') // final name
          })
          .prefix('v1')
          .as('v1')
      })
  .prefix('api')
  .as('api')
    })
.prefix('tcnt')
.as('tcnt')

const HomeController = () => import('#controllers/home_controller')
router.get('/', [HomeController, 'index'])
router.get('/captcha', [HomeController, 'captcha'])