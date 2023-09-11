import ErrorHandler from "../utils/errorhandler.js"
import User from "../models/userModels.js"
import product from "../models/productModel.js"
import sendToken from "../utils/jwtToken.js"
import sendEmail from "../utils/sendEmail.js"
import crypto from 'crypto'
import { create } from "domain"
import cloudinary from "../server.js"




//REGISTER USER 
export const registerUser = async (req, res, next) => {


    try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        })

        const { name, email, password } = req.body
        const user = new User({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        })

        await user.save()
        sendToken(user, 201, res)
    } catch (error) {
        next(new ErrorHandler(error.message, 401))
    }


}


//LOGIN USER
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) return next(new ErrorHandler("Please enter correct email ID"))

    const isPasswordMatched = user ? await user.comparePassword(password) : null
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Please enter correct email ID"))
    } else {
        sendToken(user, 201, res)
    }
}


//LOGOUT USER
export const logoutUser = async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(201).json({
        success: true,
        message: 'logged out'
    })
}



//FORGOT PASSWORD AND GET LINK IN EMAIL
export const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new Error('User not found'))
    }

    //getResetPasswordToken
    const resetToken = user.getResetPassword()
    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`

    const message = `Your password reset token is temp :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`


    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password reset`,
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to reset password${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new Error('Could not send email to reset password'))
    }

}


//RESET PASSSWORD VIA EMAIL LINK
export const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler('Reset link has expired', 404))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords Don't Match!!! ", 404))
    }

    user.password = req.body.newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, 200, res)
}

//GET USER DETAIL
export const getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.user._id)
    if (!user) return next(new ErrorHandler(`Can't find the User!!!`))
    res.status(200).json({
        success: true,
        user
    })

}

//UPDATE USER PASSWORD

export const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old Password is incorrect', 401))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler(`Password doesn't match`, 401))
    }

    user.password = req.body.newPassword
    await user.save()
    sendToken(user, 201, res)

}


//UPDATE PROFILE
export const updateProfile = async (req, res, next) => {

    const targetUser = await User.findById(req.user._id)
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    })

    targetUser.avatar.public_id = myCloud.public_id
    targetUser.avatar.url = myCloud.secure_url
    await targetUser.save()

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }


    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

}

//GET ALL USERS --ADMIN
export const getAllUsers = async (req, res, next) => {
    const users = await User.find()

    if (!users) {
        next(new ErrorHandler('No user exist', 401))
    }
    res.status(201).json({
        success: true,
        users
    })
}


//GET SINGLE USER --ADMIN
export const getSingleUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler('No user exist', 400))
    }
    res.status(200).json({
        success: true,
        user
    })
}

//UPDATE ANY USER PROFILE ---ADMIN
export const updateAnyProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

}


//DELETE ANY USER  ---ADMIN
export const deleteUser = async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        next(new ErrorHandler(`Can't found User`, 401))
    }

    res.status(200).json({
        success: true,
        message: `User deleted`
    })

}

//Create or Update Product Review 
export const createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const targetProduct = await product.findById(productId)
    const isReviewed = targetProduct.reviews.find((review) => review.user.toString() === req.user._id.toString())

    if (isReviewed) {
        targetProduct.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.rating = rating
                review.comment = comment
            }
        })
    } else {
        targetProduct.reviews.push(review)
        targetProduct.numOfReviews = targetProduct.reviews.length
    }

    let avg = 0
    targetProduct.reviews.forEach((review) => {
        avg += review.rating
    })
    avg /= targetProduct.reviews.length
    avg = Math.round(avg)
    targetProduct.ratings = avg

    targetProduct.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })

}