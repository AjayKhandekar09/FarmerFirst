import {connectDB} from "./src/db/index.js"
import { app } from "./src/app.js"

//need to add port inside the .env

connectDB()
.then(() => {
    app.on("error" , (error)=> {
        console.log(error);
        throw error;                               
    })
    app.listen(8000,()=>{
            console.log("Server is running on port")
    })
        

})
.catch((error)=>{
    console.log(error)
})