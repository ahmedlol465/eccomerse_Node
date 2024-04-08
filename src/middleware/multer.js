// Importing necessary modules
import multer from "multer";
import { allowedExetintion } from "../uitils/allowedExtentions.js";

// Middleware function for handling file uploads with Multer
export const multermiddleHost = ({ extensions = allowedExetintion.pdf }) => {
  // Configuring storage settings for Multer
    const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      // Setting the filename to the original filename
        cb(null, file.originalname);
    },
    });

  // Configuring file filter to check allowed extensions
    const fileFilter = (req, file, cb) => {
    // Checking if the file mimetype is in the allowed extensions
    if (extensions.includes(file.mimetype.split("/")[1])) {
        return cb(null, true);
    }
    // Handling disallowed file format
    cb(new Error("Format not allowed"), false);
    };

  // Configuring Multer with the defined file filter and storage settings
    const file = multer({ fileFilter, storage });

  // Returning the configured Multer instance for file handling
    return file;
};
