import { v2 as cloudinary } from "cloudinary"

import { config } from "dotenv"

config()

cloudinary.config({
  cloud_name: process.env.CLOUDNAR_CLOUDNAME,
  api_key: process.env.CLOUDNAR_API_KEY,
  api_secret: process.env.CLOUDNAR_API_SECRET,
})

export default cloudinary
