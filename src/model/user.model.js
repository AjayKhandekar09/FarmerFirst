import mongoose from "mongoose"
import jwt from "jsonwebtoken"

//yet to add ratings , reviews
const ACCESS_TOKEN_SECRET = "sdaerjeifohakef$EWrwtwry*&%$GFHHSHHYHSghsg"
const ACCESS_TOKEN_EXPIRY = "1d"
const REFRESH_TOKEN_SECRET = "dhjjdfholerookjioj*&%^$FGSA^HRE$AFHGH&*sdaerjeifohakef"
const REFRESH_TOKEN_EXPIRY = "10d"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true, 
        index : true       
    },
    age: {
        type : Number,
        // required : true
    },
    gender: {
        type : String,
        // enum : ['Male','Female','other'],
        // required : true
    },
    password: {
        type : String,
        required : [true , "password is required"],
        maxLength : 10
    },
    phone: {
        type : String,
        maxLength : 10,
    },
    profilePhoto : {
        type : String
    },
    email: {
        type : String,
        required : [true , "email is required"],
        index : true
    },
    street: {
        type : String,
    },
    city: {
        type : String,
    },
    district: {
        type : String,
    },
    state :{
        type : String
    },
    country: {
        type : String,
    },
    pincode: {
        type : String,
    },
    products: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product'
    }],
    orders: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order'
    }],
    refreshToken : {
        type : String,
        
    }

},
{
    timestamps : true
})

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName 
    },
    ACCESS_TOKEN_SECRET,
    {
        expiresIn : ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id : this._id,

    },
    REFRESH_TOKEN_SECRET,
    {
        expiresIn : REFRESH_TOKEN_EXPIRY
    }
)
}

const User = mongoose.model("User" , userSchema)

export {User}