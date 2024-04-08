import Joi from "joi";
import { generateRules } from "../../uitils/generate.validation.role.js";

export const brandValidationSchema  = {
    body: Joi.object({
        userId: generateRules.dbId.required(),
        products: Joi.array().items(
            Joi.object({
                productId: generateRules.dbId.required(),
                quantity: Joi.number().required().min(1),
                basePrice: Joi.number().required(),
                finalPrice: Joi.number().required(),
                title: Joi.string().required()
            })
        ),
        subTotal: Joi.number().required()
        
    })
}

