import Joi from "joi";
import { generateRules } from "../../uitils/generate.validation.role.js";

export const productValidationSchema  = {
    body: Joi.object({
        title: Joi.string().required(),
        desc: Joi.string(),
        slug: Joi.string().required(),
        basePrice: Joi.number().required(),
        discount: Joi.number().default(0),
        appliedPrice: Joi.number().required(),
        stock: Joi.number().required().min(0).default(0),
        rate: Joi.number().min(0).max(5).default(0),
        addedBy: generateRules.dbId.required(),
        updateBy: generateRules.dbId,
        brandId: generateRules.dbId.required(),
        subCategoryId: generateRules.dbId.required(),
        categoryId: generateRules.dbId.required(),
        images: Joi.array().items(
            Joi.object({
                secure_url: Joi.string().required(),
                public_id: Joi.string().required(),
                folderId: Joi.string().required(),
                addedBy: Joi.string().required(),
            })
        )
        
    })
}

