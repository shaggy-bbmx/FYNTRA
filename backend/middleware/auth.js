import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'


export const isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new Error('Please login!'))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new Error(`Role :${req.user.role} is not allowed to access this resource`))
        }
        next()
    }

}
