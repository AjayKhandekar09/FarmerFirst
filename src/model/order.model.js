import mongoose from "mongoose"
import loadType from "mongoose-float"

const Float = loadType(mongoose)


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index : true
    },
    carts: [{
        product: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        },
        quantity: {
            type : Number,
            required : true,
            min : 1
        }
    }],
    total: {
        type : Float,   
        default : 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
},
{
    timestamps : true
})

const Order = mongoose.model('Order',orderSchema)

export {Order}