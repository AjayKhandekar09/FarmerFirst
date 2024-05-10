import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = new express()
app.use(cors({
    origin: ["http://localhost:8000","http://127.0.0.1:5500"],
    credentials: true
}));
app.use(express.json({
    limit : "16kb"
}))

app.use(express.urlencoded({
    limit : "16kb",
    extended : true
}))
app.use(cookieParser())




import { userRouter } from "./routes/user.route.js"
app.use("/api/user",userRouter)
export {app}