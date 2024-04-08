import slugify from "slugify";
import Brand from "../../../DB/models/brand.model.js"
import subCategory from "../../../DB/models/sub-category.model.js"
import cloudnaryConnection from "../../uitils/cloudnary.js";
import generateUniqueString from "../../uitils/generateUniqeString.js";
import productModel from "../../../DB/models/product.model.js";
import subCategoryModel from "../../../DB/models/sub-category.model.js";
import { APIFeatures } from "../../uitils/api-features.js";


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



// ========= update brands ==================
export const updateBrands = async(req,res,next) => {
    const { name, oldPublicId }  = req.body
    const { _id } = req.authUser
    const { brandId } = req.params
    
    const findtheBrand = await Brand.findById(brandId)
    if(!findtheBrand) return next (new Error({message: "not found this brand"}))

    // check falsy vaue of name 
    if(name) {
        if(name === findTheSubCategory.name)
            return next({
            cause: 400,
            message: "please enter diffrent catagory name from the existing one",
    });
    // check dublicate 
    const isNameDublicate = await subCategory.findOne({name})
        if (isNameDublicate)
            return next(new Error("the name already exist", { cause: 409 }));
    
    findTheSubCategory.name = name
    findTheSubCategory.slug = slugify(name, {lower: true, replacement: '-'})
}
    console.log(findtheBrand.image);


if(oldPublicId) {
    if (!req.file) return next({ cause: 409, message: "image is required" });
    console.log(findtheBrand.image);
    const folderPath = findtheBrand.image.public_id.split(`${findtheBrand.folderId}/`)[0]
    const newPublicId = oldPublicId.split(`${findtheBrand.folderId}`)[1]
    
    const { secure_url, public_id } = await cloudnaryConnection().uploader.upload(req.file.path,{
        folder: `${folderPath}${findtheBrand.folderId}`,
        public_id: newPublicId
    })
    findtheBrand.image.secure_url = secure_url;
    req.folder = folderPath + `${findtheBrand.folderId}`
}

findtheBrand.updatedBy = _id

const updatedBrand = await findtheBrand.save()
    res.status(200).json({success: true, message: "sunCategory updated succeefullt", data: updatedBrand})


}




// ============ delete brand =====================
export const deletebrand = async(req,res,next) => {
    const { _id } = req.authUser;
    const { brandId } = req.params;

    const deleteBrand= await Brand.findByIdAndDelete({_id:brandId, addedBy: _id})
    if (!deleteBrand)
        return next(new Error({ message: "failddeleted brand" }));

        const deleteProducts = await productModel.deleteMany({brandId})
        if(!deleteProducts) return next(new Error({ message: "faild deleted product" }));



          // delete on the host
        const folderPath = deleteBrand.image.public_id.split(`${deleteBrand.folderId}`)[0]
    await cloudnaryConnection().api.delete_resources_by_prefix(
    `${folderPath}${deleteBrand.folderId}`
    );
    await cloudnaryConnection().api.delete_folder(
    `${folderPath}${deleteBrand.folderId}`
    );

    res
    .status(200)
    .json({ message: "brand deleted succefully", success: true });

    
};




// ============  get all Brand ===========
export const getAllBrands = async(req,res,next) => {
    const getData = await Brand.find()
    if(!getData) return next(new Error({ message: "error geting data" }));

    res.status(200).json({ message: "the data with brads", getData });
}



// ============  get all Brand  with sub category ===========
export const getAllBrandsWithSubCategory = async(req,res,next) => {
    const { subCatagoryId } = req.params
    const getData = await Brand.find({subCatagoryId})
    if(!getData) return next(new Error({ message: "error geting data" }));

    res.status(200).json({ message: "the data with brads", getData });
}




// ============  get all Brand  with category ===========
export const getAllBrandsWithCategory = async(req,res,next) => {
    const { catagoryId } = req.params
    const getData = await Brand.find({catagoryId})
    if(!getData) return next(new Error({ message: "error geting data" }));

    res.status(200).json({ message: "the data with brads", getData });
}











  
  // ================  get all Brand =================
  export const getAllBrandsBySearch = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query, Brand.find()).search(query)
  
  
    const Products = await features.mongooseQuery  
  
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  // ================  get all Brand =================
  export const getAllBrandsByPagination = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query, Brand.find()).pagination({page, size})
  
    const Products = await features.mongooseQuery  
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  
  
  // ================  get all Brand =================
  export const getAllBrandsByFilter = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query , Brand.find()).filter(query) 
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
 