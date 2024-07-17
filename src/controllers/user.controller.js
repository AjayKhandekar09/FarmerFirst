import {asyncHandler} from "../utils/asyncHandler.utils.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { User } from "../model/user.model.js"
import {Product} from "../model/product.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js"
import { ApiResponse} from "../utils/ApiResponse.utils.js"
import { sendMail } from "../utils/sendEmail.utils.js"
import { json, response } from "express"
import mongoose from "mongoose"
import { Cart } from "../model/cart.model.js"

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
    try {
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
            $and: [{username},{email}]
        })
    
        if(existUser) {
            return res.status(401)
            .json({
                message : "User already exists"
            })
        }
    
        const profilePhoto = req.files?.profilePhoto[0]?.path
    
        if(!profilePhoto) {
            throw new ApiError(401 , "profile photo required")
        }
        const profilePhotoCloudinary = await uploadOnCloudinary(profilePhoto)
        if(!profilePhotoCloudinary) {
            throw new ApiErrors(409 , "avatar file is required")
        }
        console.log("uploaded to cloudinary");
    
    
        console.log("heloo")
        const user = await User.create({
            username: username.toLowerCase(),
            age : parseInt(req.body.age),
            gender : req.body.gender,
            password,
            phone : req.body.phone,
            profilePhoto : profilePhotoCloudinary.url ,
            email,
            city : req.body.city || 'Unknown',
            district : req.body.district|| 'Unknown' ,
            country : req.body.country || 'Unknown',
            street : req.body.street || 'Unknown',
            pincode : req.body.pincode || 'Unknown',
            state : req.body.state || 'Unknown'
    
        })
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        if(!createdUser) {
            console.log("not ");
            throw new ApiErrors(509 , "Something went wrong while regestring user")
        }
    
        //Now crafting the response with utility
        console.log("response sent");
        
        return res.status(201).json({
            message : "Registered"
    
        }
        )
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });

    }
})

const loginUser = asyncHandler (async (req,res) => {
    const {username , email ,password} = req.body

    if(!(username || email) ) {
        throw new ApiError(401 , "Username and email is required")
    }

    const existUser = await User.findOne({
        $or : [{username},{email}]
    })
    console.log(req.body);
    if(!existUser) {
        console.log("why????");
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
        httpOnly : true,
        // secure : true
    }
    return res
    .status(201)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(201 , {} , "User Logout successfully")
})

const addProduct = asyncHandler(async (req, res) => {
    try {
        console.log(req.body);

        const userDataObject = JSON.parse(req.body.userData);

        const userId = userDataObject.user._id; // Access _id property
        // const userId = req.body.id;
        // const userId = req.body.userData?.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not provided in request body" });
        }

        const farmer = await User.findOne({ _id: userId });

        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        const productImageLocal = req.files?.productImage[0]?.path;
        if (!productImageLocal) {
            return res.status(400).json({ message: "Image not found in request" });
        }

        const productImage = await uploadOnCloudinary(productImageLocal);

        if (!productImage) {
            return res.status(500).json({ message: "Failed to upload image" });
        }
        var quantityType

        if(req.quantityType === "per Kg") {
            quantityType = 1;
        }
        else quantityType = 0;
        const productData = await Product.create({
            name: req.body.productName.toLowerCase(),
            quantity: req.body.productQuantity,
            pricePerProduct: req.body.productPrice,
            quantityType : quantityType,
            images: productImage.url,
            description: req.body.productDescription,
            farmer: userId, // Using userId instead of req.body.farmer._id
        });

        farmer.products.push(productData._id);
        await farmer.save();
        // No need to call save() on productData, as it's already created with create()


                // Simulate delayed response
                res.json({ message: "Product added successfully" });}
catch (error) {
        console.error("An error occurred while adding the product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


const searchProduct = asyncHandler( async (req , res) => {
    const {product} = req.body
    console.log(req.body);
    try {
        if(!(product)) {
            return res
            .status(401)
            .json({
                message : "product or farmer name required"
            })
        }

        const productInfo = await Product.find({ name: product }).populate('farmer', '_id username');

        console.log(productInfo);
        if(productInfo.length === 0) {
            return res
            .status(401)
            .json({
                message : "products or farmer not found"
            })
        }

        return res
        .status(201)
        .json({
            productInfo,
            message : "Searched successfully"
        })
    } catch (error) {
        console.log(error);   
    }
})

const addToCart = asyncHandler(async (req , res) => {
    const buyer = JSON.parse(req.body.userData)
    console.log("adding to cart");
    console.log(req.body);
    // console.log(req.body);
    // console.log(buyer.user._id);

    if(!buyer.user._id) {
        return res.
        status(401)
        .json({
            message : "Login first"
        })
    }

    const validUser = await User.findById(buyer.user._id) 
    // console.log(buyer.user._id);
    if(!validUser){
        return res
        .status(401)
        .json({
            message : "user doesn't exists"
        })
    }

    console.log(validUser);
    console.log( typeof req.body._id);

try {
    console.log(parseInt(req.body.quantity));
        const cartUpdate = await Cart.findOneAndUpdate(
            {user : new mongoose.Types.ObjectId(validUser._id)},
            {$push : {
                products: 
                {
                    product: new mongoose.Types.ObjectId((req.body._id)),
                    status: "pending",
                    quantityOrdered : parseInt(req.body.quantity)

                }
                },
            },
            {new : true , upsert : true}
        ).populate("products.product")
        return res.status(200).json({
            message : 'Product added to cart successfully',
            cartUpdate
        });
} catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({
            message : "Internal server error"
        })
}

})


const buyProduct = asyncHandler(async (req , res) => {
    const productInfo = req.body
    const userData = JSON.parse(productInfo.userData)
    console.log(productInfo.farmer);
    if(!productInfo) {
        console.log("Not a valid productInfo");
        return res.status(401)
        .json({
            message : "product not selected"
        })
    }

    const product = await Product.findById(productInfo._id)
    // console.log(productInfo.farmer.username);
    const farmer = await User.findOne({username : productInfo.farmer})

    // console.log(productInfo.farmer.username);
    if(!farmer) {
        console.log("Not a valid farmer");
        return res.status(401)
        .json({
            message : "Not a valid farmer"
        })
    }
// console.log(product.quantity);
    if (product.quantity < parseInt(productInfo.quantity)) {
        return res.status(400).json({
            message: "Insufficient quantity"
        });
    }

    // Decrease the quantity of the product

    // Save the updated product
    console.log(farmer.email);
    await sendMail(farmer.email,"Product summery" , `Hii ${farmer.username}, you have order from ${userData.user.username} of ${product.name} for quantity ${productInfo.quantity} , please do confirm it`)

    product.quantity -= parseInt(productInfo.quantity);

    await product.save();


    return res
    .status(201)
    .json({
        message : "email sent to farmer"
    })
    
})

const viewCart = asyncHandler(async(req , res) => {

        console.log(req.body);
        const userCart = await Cart.findOne({user : new mongoose.Types.ObjectId(req.body.user._id)}).populate('user').populate('products.product').exec();

        console.log(userCart);
        if(!userCart) {
            return res.status(401)
            .json({
                message : "User not found"
            })
        }

        const products = userCart.products;
        let productHtml = '';

        products.forEach(product => {
            // Assuming product.product contains the populated Product document
            const productDetails = product.product;
            console.log(productDetails);
             productHtml +=  `
                <div class="row product-row" id="cartDiv">
                    <div class="col-1">
                        <input type="checkbox" class="form-check-input checkBox" name="product" >
                    </div>
                    <div class="col-2">
                        <img src="images/wheat.jpg" class="img-fluid imageProduct" alt="${productDetails.name}">
                    </div>
                    <div class="col-4">
                        <h5 class="name">${productDetails.name}</h5>
                        <p class="breed">Farmer: ${req.body.user.username}</p>
                        <p class="price"><span class="rSymbol">&#8377;</span>${productDetails.pricePerProduct}</p>
                    </div>
                    <div class="col-3">
                        <input type="number" class="form-control quantityInput" placeholder='${product.quantityOrdered} kg'>
                    </div>
                    <div class="col-2">
                        <button class="btn btn-danger deleteButton">Delete</button>
                    </div>
                </div>
                <hr></hr>`;
            
        });


        return res.
        status(201)
        .json({
            message : "Cart fetched successfully",
            body : productHtml
        })




})
const viewProduct = asyncHandler(async (req, res) => {
    console.log("Received request to view product");

    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const prod = await Product.findById(_id);

        if (!prod) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(prod);
        console.log(prod.description);

        return res.status(200).json({
            message: "Description sent",
            description: prod.description
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const saveProfile = asyncHandler(async (req, res) => {
    try {
        console.log(req.body);

        const userEmail = req.body.email; // Extract email from request body

        if (!userEmail) {
            return res.status(400).json({ message: "User email not provided in request body" });
        }

        const updates = {
            username: req.body.name.toLowerCase(),
            age: parseInt(req.body.age),
            gender: req.body.gender,
            password: req.body.password,
            phone: req.body.phone,
            // profilePhoto: profilePhotoCloudinary.url, // Uncomment and provide the actual profile photo URL if needed
            city: req.body.city,
            district: req.body.district,
            country: req.body.country,
            street: req.body.street,
            pincode: req.body.pincode,
            state: req.body.state
        };

        const options = {
            new: true, // Return the updated document
            runValidators: true // Ensure the update adheres to the schema
        };

        const updatedUser = await User.findOneAndUpdate({ email: userEmail }, updates, options);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Updated User:', updatedUser);
        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        console.error("An error occurred while updating the profile:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


export {
    registerUser,
    loginUser,
    logoutUser,
    addProduct,
    searchProduct,
    buyProduct,
    addToCart,
    viewCart,
    viewProduct,
    saveProfile
}