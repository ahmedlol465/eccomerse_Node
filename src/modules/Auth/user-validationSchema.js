import Joi from "joi";
import { generateRules } from "../../uitils/generate.validation.role.js";

export const userValidationSchema  = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        mobileNumber: Joi.number().required(),
        address: Joi.string().required(),
        role: Joi.string().required(),
        age: Joi.number().required(),
        isEmailVerifide: Joi.boolean().required()
        
        
    })
}


