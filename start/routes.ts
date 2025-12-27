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

const ApiHoadondientuController = () => import('#controllers/apihoadondientu_controller')
router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.any('/check-invoice/:tax_code/:invoice_type/:invoice_no/:invoice_code/:tax_amount/:amount',  [ApiHoadondientuController, 'check_invoice']).as('check') // final name
            
            router.any('/login-invoice/:key', [ApiHoadondientuController, 'login_invoice']).as('login')
           
            router.any('/invoice/:invoice_group?/:invoice_type?/:start_date/:end_date', [ApiHoadondientuController, 'invoice']).as('invoice')

            router.any('/p-invoice/:invoice_group?/:invoice_type?/:start_date/:end_date/:page_invoice?', [ApiHoadondientuController, 'p_invoice']).as('p_invoice')
          
            router.any('/e-invoice', [ApiHoadondientuController, 'e_invoice']).as('e_invoice')

            router.any('/excel-invoice/:invoice_group?/:invoice_type?/:start_date/:end_date', [ApiHoadondientuController, 'excel_invoice']).as('excel_invoice')
            
            router.any('/file-invoice/:invoice_group?/:row', [ApiHoadondientuController, 'file_invoice']).as('file_invoice')   

            router.any('/info-user', [ApiHoadondientuController, 'info_user']).as('info_user')    
            
            router.any('/generate-key/:secret_key/:username/:password/:expiry_start_date/:expiry_end_date', [ApiHoadondientuController, 'generate_key']).as('generate_key')
          
          })
          .prefix('v1')
          .as('v1')
      })
  .prefix('api')
  .as('api')
    })
.prefix('hddt')
.as('hddt')

const ApitracuunntController = () => import('#controllers/apitracuunnt_controller')
router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.get('/check-mst/:tax_code',  [ApitracuunntController, 'check_mst']).as('check_mst') // final name
          })
          .prefix('v1')
          .as('v1')
      })
  .prefix('api')
  .as('api')
    })
.prefix('tcnt')
.as('tcnt')

const ApimasothueController = () => import('#controllers/apimasothue_controller')
router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.get('/check-mst/:tax_code',  [ApimasothueController, 'check_mst']).as('check_mst') // final name
          })
          .prefix('v1')
          .as('v1')
      })
  .prefix('api')
  .as('api')
    })
.prefix('mst')
.as('mst')
const HoadondientuController = () => import('#controllers/hoadondientu_controller')
router
  .group(() => {
    router.get('/', [HoadondientuController, 'index']).as('/')
    router.get('/index', [HoadondientuController, 'index']).as('index').middleware(['checkSessionCustom'])
    router.get('/login-key', [HoadondientuController, 'login_key']).as('login_key')
    })
.prefix('hoadondientu')
.as('hoadondientu')

const HomeController = () => import('#controllers/home_controller')
router.get('/', [HomeController, 'index'])
router.get('/test', [HomeController, 'test'])
router.get('/captcha', [HomeController, 'captcha'])