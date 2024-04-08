import Joi from "joi";
import { generateRules } from "../../uitils/generate.validation.role.js";

export const orderValidationSchema  = {
    body: Joi.object({
        userId: generateRules.dbId.required(),
        orderItems: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                quantity: Joi.number().required(),
                price: Joi.number().required(),
                product: generateRules.dbId.required(),
            })
        ),
        shippingAddress: Joi.object({
            address: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            country: Joi.string().required(),
        }),
        phoneNumber: Joi.array().items(
            Joi.string().required()
        ),
        shippingPrice: Joi.number().required(),
        coupon: generateRules.dbId,
        totalPrice: Joi.number().required(),
        paymentMethod: Joi.string().required(),
        
        
    })
}

