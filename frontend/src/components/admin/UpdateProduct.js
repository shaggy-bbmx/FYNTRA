import React, { useEffect, useState } from 'react'
import './UpdateProduct.css'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { useParams } from 'react-router-dom'
import MetaData from '../layout/MetaData'
import SpellcheckIcon from "@material-ui/icons/Spellcheck"
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"
import DescriptionIcon from "@material-ui/icons/Description"
import AccountTreeIcon from "@material-ui/icons/AccountTree"
import { clearErrors, updateProduct } from '../../actions/productAction'
import { getProductDetails } from '../../actions/productAction'
import StorageIcon from "@material-ui/icons/Storage"
import { Button } from "@material-ui/core"
import Sidebar from './Sidebar.js'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'
import Loader from '../layout/Loader/Loader'







const UpdateProduct = ({ history }) => {

    //FETCHING ALL STATES AND DISPATCH
    const dispatch = useDispatch()
    const alert = useAlert()
    const { error, product } = useSelector(state => state.productDetails)
    const { error: updateError, success, loading } = useSelector(state => state.updateProduct)
    const { id } = useParams()


    //AFTER FETCHING FILLING ALL VARIABLE IN USE STATES
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [Stock, setStock] = useState(0)
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])


    //VARIOUS CATEGORIES FOR ALL PRODUCTS
    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ]



    //IMAGES PIC UPLOAD HANDLER
    const updateProductImagesChange = (e) => {
        setOldImages([])
        setImages([])
        setImagesPreview([])
        const files = Array.from(e.target.files)

        files.forEach((file) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(prev => [...prev, reader.result])
                    setImages(prev => [...prev, reader.result])
                }
            }
        })
    }


    //FORM SUBMIT HANDLER
    const updateProductSubmitHandler = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set('name', name)
        myForm.set('price', price)
        myForm.set('Stock', Stock)
        myForm.set('category', category)
        myForm.set('description', description)
        images.forEach((img) => {
            myForm.append("images", img);
        })

        dispatch(updateProduct(myForm, id))
    }




    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success('Data updated succesfully!!!!')
            history.push('/admin/products')
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }

        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
        }

        if (product && product._id !== id) {
            dispatch(getProductDetails(id))
        } else {
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price)
            setCategory(product.category)
            setStock(product.Stock)
            setOldImages(product.images)
        }

    }, [dispatch, id, product, alert, error, success, history, updateError])

    return (
        <>
            {
                loading ? (
                    <Loader />
                ) : (
                    <>
                        <MetaData title="Create Product" />
                        <div className="dashboard">
                            <Sidebar />
                            <div className="newProductContainer">
                                <form
                                    className="createProductForm"
                                    encType="multipart/form-data"
                                    onSubmit={updateProductSubmitHandler}
                                >
                                    <h1>Create Product</h1>

                                    <div>
                                        <SpellcheckIcon />
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <AttachMoneyIcon />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            required
                                            onChange={(e) => setPrice(e.target.value)}
                                            value={price}
                                        />
                                    </div>

                                    <div>
                                        <DescriptionIcon />
                                        <textarea
                                            placeholder="Product Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            cols="30"
                                            rows="1"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <AccountTreeIcon />
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option value="">Choose Category</option>
                                            {categories.map((cate) => (
                                                <option key={cate} value={cate}>
                                                    {cate}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <StorageIcon />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            required
                                            onChange={(e) => setStock(e.target.value)}
                                            value={Stock}
                                        />
                                    </div>

                                    <div id="createProductFormFile">
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={updateProductImagesChange}
                                            multiple
                                        />
                                    </div>

                                    <div id="createProductFormImage">
                                        {oldImages &&
                                            oldImages.map((image, index) => (
                                                <img key={index} src={image.url} alt="Old Product Preview" />
                                            ))}
                                    </div>

                                    <div id="createProductFormImage">
                                        {imagesPreview.map((image, index) => (
                                            <img key={index} src={image} alt="Product Preview" />
                                        ))}
                                    </div>

                                    <Button
                                        id="createProductBtn"
                                        type="submit"
                                        disabled={loading ? true : false}
                                    >
                                        Create
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </>

                )
            }
        </>
    )
}

export default UpdateProduct
