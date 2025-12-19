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

router.get('/', () => 'It works!')
router.get('/scawler', [ScawlersController, 'load'])