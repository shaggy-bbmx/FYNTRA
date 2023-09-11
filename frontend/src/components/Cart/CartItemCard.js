import React from 'react'
import './CartItemCard.css'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeFromCart } from '../../actions/cartAction'


const CartItemCard = ({ item }) => {

    const dispatch = useDispatch()

    const deleteCartItems = (id) => {
           dispatch(removeFromCart(id)) 
    }

    return (
        <div className="CartItemCard">
            <img src={item.image} alt="ssa" />
            <div>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>{`Price: $${item.price}`}</span>
                <p onClick={() => deleteCartItems(item.product)}>Remove</p>
            </div>
        </div>
    )
}

export default CartItemCard
