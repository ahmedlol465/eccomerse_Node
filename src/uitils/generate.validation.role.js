// Importing Joi for validation and Types from Mongoose
import Joi from "joi";
import { Types } from "mongoose";

// Custom validation function for MongoDB ObjectId
const objectIdValidation = (value, helper) => {
  // Checking if the value is a valid ObjectId
    const isValid = Types.ObjectId.isValid(value);
  // Returning validation result with error message if invalid
    return {
    isValid: isValid ? value : helper.message("Invalid ObjectId"),
    };
};

// Defining validation rules for generating and validating MongoDB ObjectId
export const generateRules = {
  // Validation rule for database ObjectId
    dbId: Joi.string().custom(objectIdValidation),

  // Validation rules for headers
    headersRules: Joi.object({
    accesstoken: Joi.string().required(),
    "content-type": Joi.string(),
    "content-length": Joi.string(),
    "user-agent": Joi.string().required(),
    host: Joi.string().required(),
    "accept-encoding": Joi.string(),
    "postman-token": Joi.string(),
    "cache-control": Joi.string(),
    connection: Joi.string(),
    accept: Joi.string(),
    }),
};
