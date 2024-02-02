import Category from '../../../DB/moduls/catagory.model.js';
import subCategory from '../../../DB/moduls/sub-category.model.js';
import slugify from 'slugify';
import generateUniqueString from '../../uitils/generateUniqeString.js';
import cloudnaryConnection from "../../uitils/cloudnary.js";

// ============  add subCategory ========
export const addCatogary = async (req, res, next) => {
    const { name } = req.body
    const { catagoryId } = req.params;
    const { _id } = req.authUser

    // check if catagory name already exist 
    const isNameDublicate = await subCategory.findOne({ name });
    if(isNameDublicate) {
        return next (new Error("subCategory name is already exist", { cause: 409 }))
    }

    // check if category is exist by categoryid
    const category = await Category.findById(catagoryId)
    if(!category) return next(new Error("category not found", { cause: 400 }))

    //3- generate slug
    const slug = slugify(name, '-')

    // 4- handel image
    if(!req.file) return next({cause: 400, message: "image is required"})

    const folderId = generateUniqueString(4)
    const { secure_url, public_id } = await cloudnaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/categories/${category.folderId}/subCategories/${folderId}`
    })

    // 5- create the catagory object
    const subcatagory = {
        name,
        slug,
        image: { secure_url, public_id },
        folderId,
        addedBy: _id,
        catagoryId
    }

    const createsubCatagory = await subCategory.create(subcatagory);
    res.status(201).json({success: true, message: "subcatagory created succeffuly", data: createsubCatagory})
}