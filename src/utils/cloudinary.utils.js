import {v2 as cloudinary} from "cloudinary";
import fs from "fs"



          
cloudinary.config({ 
  cloud_name :  "dvkaiwnzs", 
  api_key : "391146242865275" , 
  api_secret : "9E6jsfKlorlIBzGJzhpYvWzWJzg"
 
});



const uploadOnCloudinary = async (localFilePath) => {
 
    try {
        
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath , {

            resource_type : "auto"
        })
        //file has been uploaded
        // console.log("file has been uploaded" , response.url);
        fs.unlinkSync(localFilePath)

        return response;
    } catch (error) {
        console.log("cloudinary error",error)
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });