import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async function() {
    try {
        await mongoose.connect(`mongodb+srv://khandekarajay427:FarmerFirst@cluster1.vmlpeeq.mongodb.net/${DB_NAME}`)
        console.log("Mongo connected")
    } catch (error) {
        console.log(error,"something went wrong")
        process.exit(1)
    }
}

export {connectDB}