import Order from "../models/orderModels.js"
import ErrorHandler from "../utils/errorhandler.js"
import ApiFeatures from "../utils/apifeatures.js"
import product from "../models/productModel.js"

//Create New ORDER
export const newOrder = async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })

}

//GET SINGLE ORDER DETAIL
export const getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('Order not found', 401))
    }

    res.status(200).json({
        success: true,
        order
    })
}

//GET LOOGED IN USER ORDER DETAIL
export const myOrder = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })

    if (!orders) {
        return next(new ErrorHandler('Order not found', 401))
    }

    res.status(200).json({
        success: true,
        orders
    })
}

//GET ALL ORDERS DETAIL  ---ADMIN
export const getALLOrder = async (req, res, next) => {
    const orders = await Order.find().populate('user', 'name email')

    if (!orders) {
        return next(new ErrorHandler('Order not found', 401))
    }

    let totalAmount = 0
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}

//UPDATE ORDER STATUS --ADMIN
export const updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    order.orderStatus = req.body.status

    if (!order) {
        return next(new ErrorHandler(`No such order exist!!!`, 404))
    }

    if (!order || order.orderStatus === 'Delivered') {
        return next(new ErrorHandler(`Order has been delivered`, 401))
    }

    if (order.orderStatus === 'Shipped') {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity)
        })
    }


    order.orderStatus = req.body.status
    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now()
    }

    await order.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true
    })
}

async function updateStock(id, quantity) {
    const targetProduct = await product.findById(id)
    targetProduct.Stock -= quantity
    await targetProduct.save({ validateBeforeSave: false })
}


//delete Order --Admin
export const deleteOrder = async (req, res, next) => {

    try {
        const order = await Order.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true
        })
    } catch (error) {
        return next(new ErrorHandler('Order not found', 401))
    }
}

