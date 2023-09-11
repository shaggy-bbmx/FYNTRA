import React from 'react'
import { Link } from 'react-router-dom'
import { Rating } from "@material-ui/lab"
import './Home.css'




const ProductCard = ({ product }) => {
    const options = {
        size: "medium",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    }

    return (
        <Link className="productCard" to={`product/${product._id}`}>
            <img src={product.images[0].url} alt='product' />
            <p>{product.name}</p>
            <div>
                <Rating {...options} />
                <span className='productCardSpan'>{`(${product.numOfReviews})`}</span>
            </div>
            <span>{`$${product.price}`}</span>
        </Link>
    )
}

export default ProductCard


