import React from 'react'
import './Cart.css'
import CartItemCard from './CartItemCard.js'
import { useSelector, useDispatch } from 'react-redux'
import { addItemsToCart } from '../../actions/cartAction'
import { Typography } from '@material-ui/core'
import { MdRemoveShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'


const Cart = ({ history }) => {



    const dispatch = useDispatch()
    const { cartItems } = useSelector((state) => state.cart)

    const decQuantity = (id, quantity, stock) => {
        if (quantity === 1) return
        dispatch(addItemsToCart(id, quantity - 1))

    }

    const incQuantity = (id, quantity, stock) => {
        if (quantity === stock) return

        dispatch(addItemsToCart(id, quantity + 1))
    }

    const checkoutHandler = () => {
        history.push('/login?redirect-shipping')
    }


    return (
        <>
            {
                cartItems.length === 0 ?
                    (
                        <div className="emptyCart">
                            <MdRemoveShoppingCart />

                            <Typography>No Product in Your Cart</Typography>
                            <Link to="/products">View Products</Link>
                        </div>
                    )
                    : (
                        <>
                            <div className='cartPage'>
                                <div className='cartHeader'>
                                    <p>Product</p>
                                    <p>Quantity</p>
                                    <p>Subtotal</p>
                                </div>


                                {cartItems && cartItems.map((item) =>
                                    <div className="cartContainer" key={item.product} >
                                        <CartItemCard item={item} />
                                        <div className="cartInput">
                                            <button onClick={() => decQuantity(item.product, item.quantity, item.stock)}>
                                                -
                                            </button>
                                            <input type="number" value={item.quantity} readOnly />
                                            <button onClick={() => incQuantity(item.product, item.quantity, item.stock)}>
                                                +
                                            </button>
                                        </div>
                                        <p className="cartSubtotal">{`$${item.price * item.quantity}`}</p>
                                    </div>
                                )}


                                <div className="cartGrossProfit">
                                    <div></div>
                                    <div className="cartGrossProfitBox">
                                        <p>Gross Total</p>
                                        <p>{`$${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}`}</p>
                                    </div>
                                    <div></div>
                                    <div className="checkOutBtn">
                                        <button onClick={checkoutHandler}>Check Out</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )

            }

        </>
    )
}

export default Cart
