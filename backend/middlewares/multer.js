import multer from "multer";

//to upload a file
const upload = multer({
    storage:multer.memoryStorage(),
});
export default upload;