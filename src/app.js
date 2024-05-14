import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = new express()
app.use(cors({
    origin: ["http://localhost:8000","http://127.0.0.1:5500"],
    credentials: true
}));
app.use(express.json({
    limit : "50mb"
}))

app.use(express.urlencoded({
    limit : "50mb",
    extended : true
}))
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });
app.use(cookieParser())




import { userRouter } from "./routes/user.route.js"
app.use("/api/user",userRouter)
export {app}