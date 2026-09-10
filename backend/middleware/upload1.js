import multer from "multer";

const Storage=multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"uploads");
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+" "+file.originalname);
        },
    }
)

const upload1=multer({
    Storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Sirf image files allowed hain"), false);
  },
})

export default upload1;