import {asyncHandler} from "../utils/asyncHandler.utils.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { User } from "../model/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js"
import { ApiResponse} from "../utils/ApiResponse.utils.js"

// const getUserId = async function(accessToken) {
//     if(!accessToken) {
//         throw ApiError(401,"Missing Access token")
//     }
//     const user = User.findOne()
// }

const generateRefreshAccessTokens = async function(userId) {
    try {
        const user = await User.findOne(userId)
        console.log(user.method);
        const refreshToken = await user.generateRefreshToken
        ()
        const accessToken = await user.
        generateAccessToken()
        console.log(accessToken);
        user.refreshToken = refreshToken
        
        await user.save({validateBeforeSave : false})
        return {accessToken , refreshToken}

    } catch (error) {
        console.log(error);
    }
}

const getUserId = async function(userAccessToken) {

    const user = await User.findOne(userAccessToken)
    if(!user) {
        throw new ApiError(401,"User not exist")
    }

    const refreshToken = user.refreshToken
    if(!refreshToken) {
        throw new ApiError(401 , "Refresh Token not found")
    }

}
const registerUser = asyncHandler(async function(req,res) {
    // console.log(req);
    const {username,email , password } =  req.body
    console.log(req.body);
    if(!username) {
        throw new ApiError(400,"Username is required")
    }

    if(!email) {
        throw new ApiError(400,"email is required")
    }
    if(!password) {
        throw new ApiError(400,"password is required")
    }

    const existUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existUser) {
        return res.status(401)
        .json({
            message : "User already exists"
        })
    }

    // const profilePhoto = req.files?.profilePhoto[0]?.path

    // if(!profilePhoto) {
    //     throw new ApiError(401 , "profile photo required")
    // }

    // const profilePhotoCloudinary = await uploadOnCloudinary(profilePhoto)
    // if(!profilePhotoCloudinary) {
    //     throw new ApiErrors(409 , "avatar file is required")
    // }


    console.log("heloo")
    const user = await User.create({
        username: username.toLowerCase(),
        age : parseInt(req.body.age),
        gender : req.body.gender,
        password,
        phone : req.body.phone,
        // profilePhoto : profilePhotoCloudinary.url ,
        email,
        city : req.body.city || 'Unknown',
        district : req.body.distric|| 'Unknown' ,
        country : req.body.country || 'Unknown',
        street : req.body.street || 'Unknown',
        pincode : req.body.pincode || 'Unknown'
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiErrors(509 , "Something went wrong while regestring user")
    }

    //Now crafting the response with utility
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
    )
})

const loginUser = asyncHandler (async (req,res) => {
    const {username , email ,password} = req.body

    if(!(username || email) ) {
        throw new ApiError(401 , "Username and email is required")
    }

    const existUser = await User.findOne({
        $or : [{username},{email}]
    })

    if(!existUser) {
        return res.status(401)
        .json({
            message : "User doesn't exists"
        }  
        )
    } 
    if(password !== existUser.password) {

        return res.status(401)
        .json({
            message : "Incorrect Password"
        }  
        )
    }

    const {accessToken , refreshToken} = await generateRefreshAccessTokens(existUser._id)

    console.log(refreshToken);
    const loggedInUser = await User.findById(existUser._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        // secure : true
    }
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5500')  
    return res.status(201)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        {
        user : loggedInUser,
        message : "User LoggedIn successfully"
    }
        
    )


})


const logoutUser = asyncHandler(async (req , res) => {
    console.log(req.body.user);

    const userId = req.body.user._id
    await User.findByIdAndUpdate(
        userId,
        {
            $set : {
                refreshToken : undefined
            },

        },
        {
            new : true
        }
    )
    const options = {
        httpsOnly : true,
        secure : true
    }
    return res
    .status(201)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(201 , {} , "User Logout successfully")
})


const addProduct = asyncHandler(async (req,res) => {
    userData
})

export {
    registerUser,
    loginUser,
    logoutUser,
    addProduct
}