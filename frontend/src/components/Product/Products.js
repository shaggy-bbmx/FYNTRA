import React, { useEffect, useState } from 'react'
import './Products.css'
import ProductCard from '../Home/ProductCard'
// import MetaData from '../layout/MetaData'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert'
import { clearErrors, getProduct } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import MetaData from '../layout/MetaData'

const categories = [
    "laptop",
    "book",
    "mobile",
    "Tops",
    "bible",
    "Camera",
    "SmartPhones",
]



const Products = () => {

    //FETCHING DISPATE AND STATES AND PARAMS
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading,
        error,
        products,
        resultPerPage,
        filteredProductsCount
    } = useSelector((state) => state.products)

    const { keyword } = useParams()

    //VARIABLES FOR PRICE FILTER
    const [price, setPrice] = useState([0, 4000])

    //VARIABLES FOR CATEGORY FILTER
    const [category, setCategory] = useState(null)

    //VARIABLES FOR RATING FILTER
    const [ratings, setRatings] = useState(0)

    //SETING PAGE FROM PAGINATION CLICK
    const [currentPage, setCurrentPage] = useState(1)

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }


    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        dispatch(getProduct(keyword, currentPage, price, category, ratings))

    }, [dispatch, alert, error, keyword, currentPage, price, category, ratings])

    let count = filteredProductsCount

    return (
        <>
            <MetaData title='PRODUCTS ---FYNTRA' />
            {loading ? <Loader /> :
                <>
                    <h2 className='productsHeading'>Products</h2>
                    <div className='products'>
                        {products && products.map((product) =>
                            <ProductCard product={product} key={product._id} />
                        )}
                    </div>

                    {keyword && <div className='filterBox'>
                        <Typography id="range-slider" gutterBottom>
                            Price range
                        </Typography>
                        <Slider
                            value={price}
                            onChange={(e, v) => setPrice(v)}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={4000}
                        />

                        <Typography >Categories</Typography>
                        <ul className='categoryBox'>
                            {categories.map((category) => (
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <fieldset>
                            <Typography component='legend'>Min. Ratings</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, v) => { setRatings(v) }}
                                valueLabelDisplay="auto"
                                aria-labelledby="continous-slider"
                                min={0}
                                max={5}
                            />
                        </fieldset>
                    </div>
                    }

                    {(resultPerPage < count) && <div className='paginationBox'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={count}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                            onChange={setCurrentPageNo}
                        />
                    </div>
                    }
                </>
            }
        </>
    )
}

export default Products
