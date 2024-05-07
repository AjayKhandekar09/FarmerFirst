import multer from "multer"
// import asyncHandler from "../utils/asyncHandler.utils.js"

const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null,'./tmp')
    },
    filename : function(req,file,cb) {
        cb(null,file.originalname)
    }
})

const upload = multer({storage:storage})

export {upload}