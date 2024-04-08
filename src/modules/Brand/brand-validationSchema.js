import Joi from "joi";
import { generateRules } from "../../uitils/generate.validation.role.js";

export const brandValidationSchema  = {
    body: Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        image: Joi.object({
            secure_url: Joi.string().required(),
            public_id: Joi.string().required(),
            folderId: Joi.string().required(),
            addedBy: Joi.string().required(),
        }),
        folderId: Joi.string().required(),
        addedBy: Joi.string().required(),
        catagoryId: Joi.string().required(),
        subCatagoryId: Joi.string().required(),
        
    })
}

