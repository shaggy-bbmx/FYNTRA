import express from 'express'
const router = express.Router()
import { forgotPassword, getAllUsers, getUserDetails, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile, getSingleUser, updateAnyProfile, deleteUser } from '../controllers/userController.js'
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js'


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(isAuthenticatedUser, getUserDetails)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers)

router.route('/admin/users/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateAnyProfile)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

    




export default router

