import Brand from "../../../DB/models/brand.model.js"
import Product from "../../../DB/models/product.model.js"
import slugify from "slugify"
import { systemRoles } from "../../uitils/system.role.js"
import cloudnaryConnection from "../../uitils/cloudnary.js"
import generateUniqueString from "../../uitils/generateUniqeString.js"
import { APIFeatures } from "../../uitils/api-features.js"

export const addProduct = async (req, res, next) => {
    const { title, desc, stock, basePrice, discount, spaces } = req.body
    const { brandId, categoryId, subCategoryId } = req.query
    const addedBy = req.authUser._id

    // brand check 
    const brand = await Brand.findById(brandId)
    if(!brand)return next (new Error("brand not found", {cause: 404}))
    if(brand.catagoryId.toString() !== categoryId) return next({message: "category not found"})
    if(brand.subCatagoryId.toString() !== subCategoryId) return next({message: "subcategory not found"})

    // check admin and super admin 
    // check brand owner 
    if(req.authUser.role !== systemRoles.SUPER_ADMIN && brand.addedBy.toString() !== addedBy.toString()) return next ({message: 'you are not allow to add this priduct in this brand'})

    // grnerate slugify 
    const slug = slugify(title, { lower: true, replacement: '-'})

    const appliedPrice = basePrice - basePrice * ((discount || 0) / 100);

    if(!req.files?.length) return next({message: "image is required"})

    const folderId = generateUniqueString(4)

    let images = []
    
    const folder = brand.image.public_id.split(`${brand.folderId}/`)[0]

    for(const file of req.files) {
        const { secure_url, public_id } = await cloudnaryConnection().uploader.upload(file.path, {
            folder: folder + `${brand.folderId}` + `/product/${folderId}`
        })
        images.push({secure_url,public_id})
    }


    req.folder = folder + `${brand.folderId}` + `/product/${folderId}`;
console.log(folderId);

    const product = { 
        title,
        desc,
        slug,
        folderId,
        basePrice,
        discount,
        appliedPrice,
        stock,
        addedBy,
        spaces: JSON.parse(spaces),
        subCategoryId,
        brandId ,
        categoryId,
        images,
    }

    const addproduct = await Product.create(product);

    req.savedDocument = { model: Product, _id: addProduct._id}

    res.status(201).json({message: "added succefully", success: true, data: addproduct})
}


// =================  update product ==============

export const UpdatePRoduct = async(req,res,next) => {
    // super admin
    // admin, addedBy
    const { title, stock, spaces, oldPublicId, basePrice,discount, desc } = req.body
    const { _id } = req.authUser
    const { productId } = req.params

    // title, stock, price, desc, discount, spaces, images
    const product = await Product.findById(productId)
    if(!product) return next ({ message: "product not found "})
    if(
        req.authUser.role !== systemRoles.SUPER_ADMIN &&
        product.addedBy.toString() !== _id.toString()
    ) return next({message: "you are not allowed to add product to this brand"})


    if(title) {
    product.title = title
    const slug = slugify(title, { lower: true, replacement: '-'})
    product.slug = slug
    }
    if(desc) product.desc = desc
    if(stock) product.stock = stock
    if(spaces) product.spaces = JSON.parse(spaces)
        // price update
    const appliedPrice = (basePrice || product.basePrice) * (1 - ((discount || product.discount) / 100))
    product.appliedPrice = appliedPrice;

    if (basePrice) product.basePrice = basePrice;
    if (discount) product.discount = discount;

    if(discount) product.discount = discount
    if(desc) product.desc = desc

    if(oldPublicId) {
        if(!req.file) return next({cause: 400, message: "image is required"})
        


        const folderPath = product.images[0].public_id.split(
        `${product.folderId}/`
        )[0];
        const newPublicId = oldPublicId.split(`${product.folderId}/`)[1];

            const { secure_url } = await cloudnaryConnection().uploader.upload(req.file.path, {
            folder: `${folderPath}${product.folderId}`,
            public_id: newPublicId
        })
        product.images.map(img => {
            if(img.public_id === oldPublicId) img.secure_url = secure_url
        })

        req.folder = folderPath + `${product.folderId}`
    }

    const updatedproduct = await product.save()
    res.status(200).json({success: true, message: "product updated succeefullt", data: updatedproduct})
}





// ================  get all product =================
export const getAllProductBySearch = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query   

    const features = new APIFeatures(req.query, Product.find()).search(query)


    const Products = await features.mongooseQuery  // mongoose query only need to await line of data base


    res.status(200).json({message: "the product", data: Products})
}


// ================  get all product =================
export const getAllProductByPagination = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query   // rest operator not spread its for collecting data
    const features = new APIFeatures(req.query, Product.find()).pagination({page, size})
    const Products = await features.mongooseQuery  // mongoose query only need to await line of data base


    res.status(200).json({message: "the product", data: Products})
}




// ================  get all product =================
export const getAllProductByFilter = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query   // rest operator not spread its for collecting data
   

    const features = new APIFeatures(req.query , Product.find()).filter(query) 
    const Products = await features.mongooseQuery  


    res.status(200).json({message: "the product", data: Products})
}




// =====================  delete product ===========================
export const deleteProdcut = async(req,res,next) => {
    const{ productId } = req.params
    const{ _id } = req.authUser

    const deletingProduct = await Product.findByIdAndDelete({_id: productId, addedBy: _id})
    if (!deletingProduct) return next({ message: "product not deleted " });

    const folderPath = deletingProduct.images[0].public_id.split(`${deletingProduct.folderId}`)[0]

        await cloudnaryConnection().api.delete_resources_by_prefix(
            `${folderPath}${deletingProduct.folderId}`
);
        await cloudnaryConnection().api.delete_folder(
        `${folderPath}${deletingProduct.folderId}`

);

    res
        .status(200)
        .json({ message: "product deleted succefully", success: true });

}



// ==================  get product by id ===============
export const getProductById = async(req,res,next) => {
    const { productId } = req.params
    const { _id } = req.authUser
    
    const getingProduct = await Product.findById({_id: productId, addedBy: _id})
    if(!getingProduct) return next({message: 'geting product is faild'})
    return res.status(200).json({message: 'the products', data: getingProduct})
}



// ==================  get product by id ===============
export const getAllProductsFor2Brnds = async(req,res,next) => {
    const { BrandIdOne, BrandIdTwo } = req.params;
    console.log(BrandIdOne);
    console.log(BrandIdTwo);
    const brands = [ BrandIdOne, BrandIdTwo]
    console.log(brands);
    const getingProduct = await Product.find({ brandId : { $in: brands }});
    console.log(getingProduct);
    if(!getingProduct) return next({message: 'geting product is faild'})
    return res.status(200).json({message: 'the products', data: getingProduct})
}