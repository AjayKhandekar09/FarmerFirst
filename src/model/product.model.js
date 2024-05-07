import mongoose from "mongoose"
import loadType from "mongoose-float"

const Float = loadType(mongoose) 

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        index : true
    },
    quantity: {
        type : Number,
        required : true
    },
    pricePerProduct: {
        type : Float,
        required : true,
    },
    description: {
        type : String,
        maxLength : 500
    },
    isAvailable: {
        type : Boolean,
        required : true
    },
    images: {
        type : String,
    },
    farmer: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    refreshToken: {
        type : String,
    }
}, {
    timestamps : true
})

const Product = mongoose.model("Product" , productSchema)

export {Product}