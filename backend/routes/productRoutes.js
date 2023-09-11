import express from 'express'
const router = express.Router()
import { createProducts, getAllProducts, updateProduct, deleteProduct, getProductDetail, getAllReviews, deleteReview } from '../controllers/productController.js'
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js'
import { createProductReview } from '../controllers/userController.js'
import { getAdminProduct } from '../controllers/productController.js'



router.route('/products').get(getAllProducts)
router.route('/admin/products').get(getAdminProduct)
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), createProducts)
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)


router.route('/product/:id').get(getProductDetail)

router.route('/reviews')
    .put(isAuthenticatedUser, createProductReview)
    .get( getAllReviews)
    .delete(isAuthenticatedUser,deleteReview)

export default router