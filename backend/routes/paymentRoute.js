import express from 'express'
const router = express.Router()
import { processPayment, sendStripeApiKey } from '../controllers/paymentController.js'
import { isAuthenticatedUser } from '../middleware/auth.js'

router.route('/payment/process').post(isAuthenticatedUser, processPayment)
router.route('/stripeApiKey').get(isAuthenticatedUser, sendStripeApiKey)


export default router   