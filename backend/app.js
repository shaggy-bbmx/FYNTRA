// const app = require('./server')
import express from 'express'
const app = express()
import productRouter from './routes/productRoutes.js'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import errorMiddleware from './middleware/error.js'
import userRouter from './routes/userRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import paymentRouter from './routes/paymentRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import path from 'path'
const __dirname = path.resolve()
dotenv.config({ path: "./config/.env" })



app.listen(process.env.PORT, console.log('SERVER IS OK'))
connectDB()

app.use(fileUpload())
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use('/', productRouter)
app.use('/', userRouter)
app.use('/', orderRouter)
app.use('/', paymentRouter)


//..STEP TO CONNECT BACKEND TO FRONTEND BUILD
app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})
//------------------------------------------------------------//

app.use(errorMiddleware)



