import express from 'express'
const router = express.Router()
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js'
import { deleteOrder, getALLOrder, getSingleOrder, myOrder, newOrder, updateOrder } from '../controllers/orderController.js'



router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)
router.route('/orders/me').get(isAuthenticatedUser, myOrder)
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getALLOrder)
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)


export default router