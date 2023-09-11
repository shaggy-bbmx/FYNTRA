import mongoose from "mongoose"


const connectDB = () => {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('connected to DB')
    }).catch((error) => {
        console.log(error)
    })
}


export default connectDB

