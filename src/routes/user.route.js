import {upload} from "../middleware/multer.middleware.js"
import { Router } from "express"
import { loginUser, logoutUser, registerUser , addProduct, searchProduct } from "../controllers/user.controller.js";
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
userRouter.route("/buyProduct").post(searchProduct)


export {userRouter}