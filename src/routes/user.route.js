import {upload} from "../middleware/multer.middleware.js"
import { Router } from "express"
import { loginUser, logoutUser, registerUser , addProduct, searchProduct, buyProduct ,saveProfile, addToCart , viewCart , viewProduct} from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.route("/register").post(upload.fields(
    [{
        name : "profilePhoto",
        maxCount : 1
    }]
) , registerUser)

userRouter.route("/add").post(upload.fields([{
    name : "productImage",
    maxCount: 1
}]), addProduct)

userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(logoutUser)
userRouter.route("/searchProduct").post(searchProduct)
userRouter.route("/addToCart").post(addToCart)
userRouter.route("/viewCart").post(viewCart)
userRouter.route("/viewProduct").post(viewProduct)
userRouter.route("/saveProfile").post(saveProfile)


export {userRouter}