import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // Generate a unique suffix
    cb(null, file.originalname)   // Use the original file name  
  }
})

export const upload = multer({ storage, })