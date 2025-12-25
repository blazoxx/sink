import {v2 as cloudinary} from 'cloudinary'
import fs from 'node:fs'

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


const uploadToCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        // Upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        // file has been uploaded successfully
        // console.log('File uploaded successfully', response.url)
        fs.unlinkSync(localFilePath);    // remove the locally saved temporary file
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath);    // remove the locally saved temporary file as upload operation got failed
        return null
    } 
}

export {uploadToCloudinary}