import slugify from "slugify";
import Brand from "../../../DB/moduls/brand.model.js"
import subCategory from "../../../DB/moduls/sub-category.model.js"
import cloudnaryConnection from "../../uitils/cloudnary.js";
import generateUniqueString from "../../uitils/generateUniqeString.js";


// ======================== add brand =======================
export const addBrand = async (req,res,next) => {
    const { name } = req.body
    const { categoryId, subCatagoryId } = req.query;
    const { _id } = req.authUser

    // category check, subcategory check

    // 2- subcategory check 
// populate distract folderID from categoryId
    const subcategory = await subCategory.findById(subCatagoryId).populate("catagoryId", "folderId")
        if(!subcategory) return next(new Error("sub category not found", { cause: 404 })) 

    // 3- dublicate brend check
    const isBrandExist = await Brand.findOne({ name, subCatagoryId });
    if(isBrandExist) return next(new Error("brand already exist for this subcategory", { cause: 404 })) 

    // 4- category check    
    if(categoryId != subcategory.catagoryId._id) return next(new Error("category not found", { cause: 404 }))

    // 5- generate the slug
    const slug = slugify(name, "-")


    // 6-  check uplaod logo brand
    if(!req.file) return next(new Error("please upload logo for your brand", { cause: 400 }))
    const folderId = generateUniqueString(4)

    const { public_id, secure_url } = await cloudnaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/categories/${subcategory.catagoryId.folderId}/subCategories/${subcategory.folderId}/Brands/${folderId}`
    }) 

    // create Brand 
    const BrandObject = {
        name, slug,
        image: { secure_url, public_id },
        folderId,
        subCatagoryId,
        catagoryId: categoryId,
        addedBy:_id
    }

    const newBrand = await Brand.create(BrandObject);
    res.status(200).json({message: "created Brand successfully", success: true, data: newBrand})
}


