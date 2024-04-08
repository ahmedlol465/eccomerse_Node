import Category from '../../../DB/models/catagory.model.js';
import subCategory from '../../../DB/models/sub-category.model.js';
import slugify from 'slugify';
import generateUniqueString from '../../uitils/generateUniqeString.js';
import cloudnaryConnection from "../../uitils/cloudnary.js";
import { systemRoles } from '../../uitils/system.role.js';
import brandModel from '../../../DB/models/brand.model.js';
import { APIFeatures } from '../../uitils/api-features.js';

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



// ==============  update subcategory ===============
export const updeteSubCategort = async (req, res, next) => {
    const { name, oldPublicId} = req.body
    const { _id } = req.authUser
    const { subCategoryId } = req.params

    const findTheSubCategory = await subCategory.findById(subCategoryId)
    if(!findTheSubCategory) return next (new Error({message: "not found this subCategory"}))


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


if(oldPublicId) {
    if (!req.file) return next({ cause: 409, message: "image is required" });
    

    const folderPath = findTheSubCategory.image.public_id.split(`${findTheSubCategory.folderId}/`)[0]
    const newPublicId = oldPublicId.split(`${findTheSubCategory.folderId}`)[1]
    
    const { secure_url, public_id } = await cloudnaryConnection().uploader.upload(req.file.path,{
        folder: `${folderPath}${findTheSubCategory.folderId}`,
        public_id: newPublicId
    })
    findTheSubCategory.image.secure_url = secure_url;
    req.folder = folderPath + `${findTheSubCategory.folderId}`
}

findTheSubCategory.updatedBy = _id

const updatedSubCategory = await findTheSubCategory.save()
    res.status(200).json({success: true, message: "sunCategory updated succeefullt", data: updatedSubCategory})


}


// delete product

// ============ delete subCatefory =====================
export const deleteSubCategory = async(req,res,next) => {
    const { _id } = req.authUser;
    const { subCategoryId } = req.params;

    const deleteSubCategory = await subCategory.findByIdAndDelete({_id:subCategoryId, addedBy: _id})
    if (!deleteSubCategory)
        return next(new Error({ message: "faild deleted subCategory" }));


    const deleteBrands = await brandModel.deleteMany({subCatagoryId: subCategoryId});
        if (deleteBrands.deletedCount <= 0) console.log(deleteBrands.deletedCount);
        console.log("there is no Brands related");

        const deleteProducts = await productModel.deleteMany({brandId})
        if(!deleteProducts) return next(new Error({ message: "faild deleted product" }));


          // delete on the host
        const folderPath = deleteSubCategory.image.public_id.split(`${deleteSubCategory.folderId}`)[0]
    await cloudnaryConnection().api.delete_resources_by_prefix(
    `${folderPath}${deleteSubCategory.folderId}`
    );
    await cloudnaryConnection().api.delete_folder(
    `${folderPath}${deleteSubCategory.folderId}`
    );

    res
    .status(200)
    .json({ message: "subcategory deleted succefully", success: true });
};


// ============  get all categories with brands ===========
export const getAllCategories = async(req,res,next) => {
    const getData = await subCategory.find().populate("Brands");
    if(!getData) return next(new Error({ message: "error geting data" }));

    res.status(200).json({ message: "the data with brads", getData });
}










// ============  get all subcatagory ===========
export const getByIdCatagory = async (req, res, next) => {
    const { CategoryId } = req.params
    const catagories = await subCategory.findOne({_id: CategoryId})
    
    if (!catagories)
      return next(new Error("Error getting categories", { cause: 404 }));
    res.status(200).json({ message: "catagory getting successfuly", catagories });
  };
  
  
  
  
  
  // ================  get all subCategory =================
  export const getAllSubCategoryBySearch = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query, subCategory.find()).search(query)
  
  
    const Products = await features.mongooseQuery  
  
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  // ================  get all subCategory =================
  export const getAllSubCategoryByPagination = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query, subCategory.find()).pagination({page, size})
  
    const Products = await features.mongooseQuery  
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  
  
  // ================  get all subCategory =================
  export const getAllSubCategoryByFilter = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query , subCategory.find()).filter(query) 
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  
  
  
  

  
// ============  get subcategories by Id ===========
export const getByIdSubCategory = async(req,res,next) => {
    const { subCategoryId } = req.params
    const getData = await subCategory.findById({_id: subCategoryId})
    if(!getData) return next(new Error({ message: "error geting data" }));

    res.status(200).json({ message: "the data", getData });
}
