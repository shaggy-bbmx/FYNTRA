import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { deleteProductReducer, getAdminProductReducer, newReviewReducer, productReducer, updatedProductReducer, createProductReducer, productDetailsReducer, deleteReviewsReducer, getAllReviewsReducer } from './reducers/productReducers'
import { updatePasswordReducer, profileReducer, userReducer, forgotPasswordReducer, getAllUsersReducer, deleteUserReducer, getUserDetailsReducer, updateUserReducer } from './reducers/userReducer'
import { cartReducer } from './reducers/cartReducer'
import { getAllOrdersReducer, myOrderReducer, newOrderReducer, orderDetailsReducer, deleteOrderReducer, updateOrderReducer } from './reducers/orderReducer'






const reducer = combineReducers({
    products: productReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    updatePassword: updatePasswordReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrderReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    getAllOrders: getAllOrdersReducer,
    getAllUsers: getAllUsersReducer,
    getAdminProduct: getAdminProductReducer,
    deleteProduct: deleteProductReducer,
    updateProduct: updatedProductReducer,
    createProduct: createProductReducer,
    deleteOrder: deleteOrderReducer,
    updateOrder: updateOrderReducer,
    deleteUser: deleteUserReducer,
    userDetails: getUserDetailsReducer,
    updateUser: updateUserReducer,
    deleteReviews: deleteReviewsReducer,
    getAllReviews: getAllReviewsReducer
})

let intialState = {
    cart: {
        cartItems: localStorage['cartItems'] ? JSON.parse(localStorage['cartItems']) : [],
        shippingInfo: localStorage['shippingInfo'] ? JSON.parse(localStorage['shippingInfo']) : []
    }
}


const store = configureStore({ reducer, preloadedState: intialState, devTools: true })

export default store