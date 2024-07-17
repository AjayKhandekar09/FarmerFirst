import mongoose from "mongoose";
import { User } from "./user.model.js";

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index : true
    },
    products : [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                index: true
            },
            quantityOrdered: {
                type : Number,
                default : 0
            },
            status: {
                type: String,
                enum: ['pending', 'purchased', 'shipped', 'delivered'],
                default: 'pending'
            }
        }
    ]
},{timestamps : true})

const Cart = mongoose.model('Cart',CartSchema)

export {Cart}
