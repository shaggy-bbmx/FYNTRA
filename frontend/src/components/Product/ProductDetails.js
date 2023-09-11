import React, { useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import './ProductDetails.css'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import { Rating } from "@material-ui/lab"
import ReviewCard from './ReviewCard'
import Loader from '../layout/Loader/Loader'
import MetaData from '../layout/MetaData'
import { useAlert } from 'react-alert'
import { addItemsToCart } from '../../actions/cartAction'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, } from "@material-ui/core"
import { NEW_REVIEW_RESET } from '../../constants/productConstants'











const ProductDetails = () => {


    //...FETCHING ALERT, DISPATCH , STATES  & PARAMS FROM STORE 
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading, product, error } = useSelector((state) => state.productDetails)
    const { error: submitError, success } = useSelector(state => state.newReview)
    const { id } = useParams()


    //...HANDLERS  FOR + / - click 
    const [quantity, setQuantity] = useState(1)
    const decQuantity = (e) => {
        setQuantity(prev => (prev === 1 ? prev : prev - 1))
    }
    const incQuantity = (e) => {
        setQuantity(prev => {
            if (product.Stock === prev) return prev
            else return prev + 1
        })
    }


    //...USE STATE FOR SUBMIT REVIEW DIALOGUE BOX AND FUNCTION TO TOGGLE IT 
    // AND ALSO RATING AND COMMENT ENETRED BY USER DURING SUBMITING REVIEW
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const submitReviewToggle = () => {
        setOpen(prev => !prev)
    }



    //...HANDLER FOR SUBMITING REVIEW
    const reviewSubmitHandler = () => {
        let review = {
            rating,
            comment,
            productId: product._id
        }

        dispatch(newReview(review))
        setOpen(false)
    }


    //...FOR STYLING REACT STAR COMPONENTS ****
    let options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5
    }


    //...HANDLER FOR ADDING PRODUCT IN CART
    const addToCartHandler = (e) => {
        dispatch(addItemsToCart(id, quantity))
        alert.success('Items added successfully!!!')
    }




    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (success) {
            alert.success('Thank You for Feedback!!!')
            dispatch({ type: NEW_REVIEW_RESET })
            setRating(0)
            setComment('')
        }

        if (submitError) {
            alert.error(submitError)
            dispatch(clearErrors())
        }

        dispatch(getProductDetails(id))
    }, [dispatch, id, alert, error, submitError, success])




    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title={`${product.name} --FYNTRA`} />
                    <div className='ProductDetails'>
                        <div>
                            <Carousel>
                                {product.images && product.images.map((item, index) =>
                                    <img className='CarouselImage'
                                        key={index}
                                        src={item.url}
                                        alt={`${index}Slide`}
                                    />
                                )}
                            </Carousel>
                        </div>

                        <div>
                            <div className='detailsBlock-1'>
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span className="detailsBlock-2-span">
                                    {" "}
                                    ({product.numOfReviews} Reviews)
                                </span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`$${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decQuantity} >-</button>
                                        <input readOnly type='number' value={quantity} />
                                        <button onClick={incQuantity}>+</button>
                                    </div>
                                    <button
                                        onClick={addToCartHandler}
                                        disabled={product.Stock < 1 ? true : false}
                                        style={{
                                            backgroundColor: product.Stock < 1 ? '#FFFFFF' : 'tomato',
                                            color: product.Stock < 1 ? 'black' : 'white'
                                        }} >
                                        Add to Cart
                                    </button>
                                </div>
                                <p>
                                    Status:
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? " Out Of Stock" : " In Stock"}
                                    </b>
                                </p>
                            </div>
                            <div className="detailsBlock-4">
                                Description : <p>{product.description}</p>
                            </div>
                            <button onClick={submitReviewToggle} className="submitReview">
                                Submit Review
                            </button>
                        </div>
                    </div>

                    <h3 className='reviewsHeading'>Reviews</h3>
                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {product.reviews && product.reviews.length ?
                        <div className='reviews'>
                            {product.reviews.map((review) => <ReviewCard key={review._i} review={review} />)}
                        </div>
                        : <p className='noReviews'>No Reviews Yet!!!</p>}
                </>
            }
        </>
    )
}

export default ProductDetails
