import Catagory from "../../../DB/moduls/catagory.model.js";
import slugify from "slugify";
import cloudnaryConnection from "../../uitils/cloudnary.js";
import generateUniqueString from "../../uitils/generateUniqeString.js";
import subCategory from "../../../DB/moduls/sub-category.model.js";
import Brand from "../../../DB/moduls/brand.model.js";

// ============  add category ========
export const addCatogary = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.authUser;

  // check if catagory name already exist
  const isNameDublicate = await Catagory.findOne({ name });
  if (isNameDublicate) {
    return next(new Error("catagory name is already exist", { cause: 409 }));
  }

  //3- generate slug
  const slug = slugify(name, "-");

  // 4- handel image
  if (!req.file) return next({ cause: 400, message: "image is required" });

  const folderId = generateUniqueString(4);
  const { secure_url, public_id } = await cloudnaryConnection().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.MAIN_FOLDER}/categories/${generateUniqueString(
        4
      )}`,
    }
  );

  // 5- create the catagory object
  const catagory = {
    name,
    slug,
    image: { secure_url, public_id },
    folderId,
    addedBy: _id,
  };

  const createCatagory = await Catagory.create(catagory);
  res.status(201).json({
    success: true,
    message: "catagory created succeffuly",
    data: createCatagory,
  });
};

// ==============  update catagory =======

export const updateCatagory = async (req, res, next) => {
  const { name, oldPublicId } = req.body;
  const { catagoryId } = req.params;
  const { _id } = req.authUser;

  const catagory = await Catagory.findById(catagoryId);
  if (!catagory) return next({ cause: 303, message: "catagory not found" });

  if (name) {
    if (name == catagory.name) {
      return next({
        cause: 400,
        message: "please enter diffrent catagory name from the existing one",
      });
    }

    const isNameDuplicated = await Catagory.findOne({ name });
    if (isNameDuplicated)
      return next(new Error("the name already exist", { cause: 409 }));
    catagory.name = name;
    catagory.slug = slugify(name, "-");
  }
  // 6- check if the user want to update the image
  if (oldPublicId) {
    if (!req.file) return next({ cause: 409, message: "image is required" });
    const newPublicId = oldPublicId.split(`${catagory.folderId}/`)[1];
    const { secure_url, public_id } =
      await cloudnaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/categories/${catagory.folderId}`,
        public_id: newPublicId,
      });
    catagory.image.secure_url = secure_url;
  }

  // 7- sst value for updatedBy field
  catagory.updatedBy = _id;

  await catagory.save();
  res.status(200).json({
    message: "catagory updated successfully",
    success: true,
    data: catagory,
  });
};

// ============  get all catagory ===========
export const getAllCatagory = async (req, res, next) => {
  const catagories = await Catagory.find().populate([
    {
      path: "subCategory",
      populate: [
        {
          path: "Brands",
        },
      ],
    },
  ]);
  if (!catagories)
    return next(new Error("Error getting categories", { cause: 404 }));
  res.status(200).json({ message: "catagory getting successfuly", catagories });
};

// ===============  delete category ==========

export const deleteCategory = async (req, res, next) => {
  const { catagoryId } = req.params;

  const deletecategory = await Catagory.findByIdAndDelete(catagoryId);
  if (!deletecategory)
    return next(new Error("category not found", { cause: 404 }));

  const deleteSubCategory = await subCategory.deleteMany({ catagoryId });
  if (deleteSubCategory.deletedCount <= 0)
    console.log(deleteCategory.deletedCount);
  console.log("there is no subCaategory in this category");

  const deleteBrands = await Brand.deleteMany({ catagoryId });
  if (deleteBrands.deletedCount <= 0) console.log(deleteBrands.deletedCount);
  console.log("there is no Brands related");

  // delete on the host
  await cloudnaryConnection().api.delete_resources_by_prefix(
    `${process.env.MAIN_FOLDER}/categories/${deletecategory.folderId}`
  );
  await cloudnaryConnection().api.delete_folder(
    `${process.env.MAIN_FOLDER}/categories/${deletecategory.folderId}`
  );

  res
    .status(200)
    .json({ message: "category deleted succefully", success: true });
};
