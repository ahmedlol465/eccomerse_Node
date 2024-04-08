// Importing Cloudinary v2 and configuring the connection
import { v2 as cloudinary } from "cloudinary";

const cloudnaryConnection = () => {
  // Configuring Cloudinary with provided environment variables
    cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    });
  // Returning the configured Cloudinary instance
    return cloudinary;
};

// Exporting the configured Cloudinary connection for use in the application
export default cloudnaryConnection;
