import st from 'stripe'
const stripe = st(process.env.STRIPE_SECRET_KEY)



export const processPayment = async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata: {
            company: "FYNTRA",

        }
    })
    console.log(myPayment.client_secret)
    res.status(200).json({ success: true, client_secret: myPayment.client_secret })
}



export const sendStripeApiKey = (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY })
}