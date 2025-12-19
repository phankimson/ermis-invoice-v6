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

router.get('/', [HomeController, 'index'])
router.get('/captcha', [HomeController, 'captcha'])