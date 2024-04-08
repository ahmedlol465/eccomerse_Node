// Importing customAlphabet function from nanoid
import { customAlphabet } from "nanoid";

// Function to generate a unique string using nanoid
const generateUniqueString = (length) => {
  // Creating a custom alphabet for nanoid
    const nanoid = customAlphabet("123445asfg", length || 10);
  // Generating a unique string
    return nanoid();
};

// Exporting the function for use in the application
export default generateUniqueString;
