import { v2 as cloudinary } from "cloudinary";

const configured=Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if(configured) cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

export async function uploadImage(buffer,folder){
  if(!configured) throw new Error("Cloudinary is not configured");
  return new Promise((resolve,reject)=>{
    const stream=cloudinary.uploader.upload_stream({folder},(err,result)=>{
      if(err) reject(err); else resolve({url:result.secure_url,publicId:result.public_id});
    });
    stream.end(buffer);
  });
}
