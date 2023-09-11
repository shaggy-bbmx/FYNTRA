import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants"
import axios from "axios"


//ACTION FOR ADDING TO CART
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/product/${id}`)
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.productDetail._id,
            name: data.productDetail.name,
            price: data.productDetail.price,
            image: data.productDetail.images[0].url,
            stock: data.productDetail.Stock,
            quantity
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}


//ACTION FOR REMOVING FROM CART
export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

//action for adding shipping INFO
export const saveShippingInfo = (data) => async (dispatch, getState) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })
    localStorage['shippingInfo'] = JSON.stringify(data)
}