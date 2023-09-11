import product from "../models/productModel.js"
import ErrorHandler from "../utils/errorhandler.js"
import ApiFeatures from "../utils/apifeatures.js"
import cloudinary from "../server.js"





//----CREATE PRODUCT------ADMIN
export const createProducts = async (req, res, next) => {



    try {

        let images = []

        //WEATHER IT'S SINGLE PIC OR MULTIPLE PIC
        if (typeof (req.body.images) === 'string') {
            images.push(req.body.images)
        } else {
            images = req.body.images
        }


        //...IF NO PIC THEN SKIP THIS STEP
        if (images !== undefined) {

            let imagesLinks = []
            //  NOTE WE HAVE HERE USED FOR LOOP INSTEAD OF FOOR LOOP 
            //...BCOZ WE WANT TO USE AWAIT WITHOUT SEPARATE ASYNC FUNCTION
            //...BCOZ WE WANT TO ENTIRE CODE FROM HERE ON SINGLE ASYNC FUNCTION
            //..INSTEAD OF JUST forEach() FUNCTION
            for (let i = 0; i < images.length; ++i) {
                const myCloud = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "avatars",
                })

                imagesLinks.push({
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                })
                req.body.images = imagesLinks
            }

        }
        req.body.user = req.user.id

        const newProduct = new product(req.body)
        await newProduct.save()
        res.status(201).json({ newProduct, success: true })

    } catch (error) {
        return next(new ErrorHandler(error.message))
    }

}


//----update PRODUCT------ADMIN
export const updateProduct = async (req, res, next) => {

    try {
        const targetProduct = await product.findById(req.params.id)

        let images = []

        if (typeof (req.body.images) === 'string') {
            images.push(req.body.images)
        } else {
            images = req.body.images
        }

        if (images !== undefined) {
            //DESTROY OLD IMAGES FROM CLOUD
            for (let i = 0; i < targetProduct.images.length; ++i) {
                await cloudinary.v2.uploader.destroy(targetProduct.images[i].public_id)
            }

            let imagesLinks = []
            //  NOTE WE HAVE HERE USED FOR LOOP INSTEAD OF FOOR LOOP 
            //...BCOZ WE WANT TO USE AWAIT WITHOUT SEPARATE ASYNC FUNCTION
            //...BCOZ WE WANT TO ENTIRE CODE FROM HERE ON SINGLE ASYNC FUNCTION
            //..INSTEAD OF JUST forEach() FUNCTION
            for (let i = 0; i < images.length; ++i) {
                const myCloud = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "avatars",
                })

                imagesLinks.push({
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                })
                req.body.images = imagesLinks
            }

        }

        const updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(201).json({ updatedProduct, success: true })

    } catch (error) {
        return next(new ErrorHandler(error.message))
    }

}


//----GET PRODUCT------ADMIN
export const getAllProducts = async (req, res, next) => {

    const resultPerPage = 3
    const productsCount = await product.countDocuments()

    try {
        const apiFeature = new ApiFeatures(product.find(), req.query)
            .search()
            .filter()


        let filteredProducts = await apiFeature.query.clone()
        const filteredProductsCount = filteredProducts.length

        apiFeature.pagination(resultPerPage)
        const allproducts = await apiFeature.query.clone()


        res.status(201).json({
            success: true,
            products: allproducts,
            productsCount,
            resultPerPage,
            filteredProductsCount
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

}



//----delete PRODUCT------ADMIN
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await product.findById(req.params.id)
        await product.deleteOne(deletedProduct)
        res.status(201).json({ success: true, deletedProduct })
    } catch (error) {
        return next(new ErrorHandler("Can't Delete the Product!!!!"))
    }
}

//---- GET PRODUCT DETAIL----------
export const getProductDetail = async (req, res, next) => {
    try {
        const productDetail = await product.findById(req.params.id)
        res.status(201).json({
            success: true,
            productDetail
        })
    } catch (error) {
        return next(new ErrorHandler('Product not found', 500))
    }
}

//GET ALL REVIEWS OF A PRODUCT
export const getAllReviews = async (req, res, next) => {
    try {
        const { reviews } = await product.findById(req.query.id)
        res.status(200).json(reviews)
    } catch (error) {
        next(new ErrorHandler('Product not found', 401))
    }
}

//DELETE A REVIEW OF A PRODUCT
export const deleteReview = async (req, res, next) => {
    const targetProduct = await product.findById(req.query.productId)


    if (!targetProduct) {
        return next(new ErrorHandler('Product not found', 401))

    }

    const reviews = targetProduct.reviews.filter((review) => {
        return review._id.toString() !== req.query.id.toString()
    })

    targetProduct.reviews = reviews
    targetProduct.numOfReviews = reviews.length

    //UPDATE RATING COUNT----------------------
    let avg = 0
    targetProduct.reviews.forEach((review) => {
        avg += review.rating
    })
    targetProduct.reviews.length ? avg /= targetProduct.reviews.length : avg = 0

    avg = Math.round(avg)
    targetProduct.ratings = avg
    //------------------------------------------

    await targetProduct.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true

    })

}

//GET ALL RPODUCTS WITHOUT ANY FILTER OR PAGINATION
export const getAdminProduct = async (req, res, next) => {
    try {
        const products = await product.find()
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return next(new ErrorHandler('Product not found', 500))
    }
}