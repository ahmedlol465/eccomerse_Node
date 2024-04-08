// Importing necessary modules and dependencies
import { Router } from "express";
import * as subcatagorycontroller from "./subCategory.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
import { validmiddleware } from "../../middleware/validationMiddleware.js";
import { subCategoryValidationSchema } from "./subCategory-validationSchema.js";
import { endPointsRoles } from "./Sub-catagory.endpoints.js";
import { multermiddleHost } from "../../middleware/multer.js";
import { allowedExetintion } from "../../uitils/allowedExtentions.js";

// Creating an Express router instance
const router = Router();

router.post(
  "/addSubCategory/:catagoryId",
  auth(endPointsRoles.ADD_SUBCATAGORY),
  multermiddleHost({
    extensions: allowedExetintion.image,
  }).single("image"),
  expressAsynchandler(subcatagorycontroller.addCatogary)
);


router.put(
  "/updateSubCategory/:subCategoryId",
  auth(endPointsRoles.ADD_SUBCATAGORY),
  multermiddleHost({
    extensions: allowedExetintion.image,
  }).single("image"),
  expressAsynchandler(subcatagorycontroller.updeteSubCategort)
);



router.delete(
  "/deleteSubCategory/:subCategoryId",
  auth(endPointsRoles.ADD_SUBCATAGORY),
  expressAsynchandler(subcatagorycontroller.deleteSubCategory)
);


router.get(
  "/getSubCategory",
  auth(endPointsRoles.ADD_SUBCATAGORY),
  expressAsynchandler(subcatagorycontroller.getAllCategories)
);


router.post(
  "/getByIdSubCategory/:subCategoryId",
  // auth(endPointsRoles.ADD_SUBCATAGORY),
  expressAsynchandler(subcatagorycontroller.getByIdSubCategory)
);


router.get('/getAllSubCategoryByPagination', expressAsynchandler(subcatagorycontroller.getAllSubCategoryByPagination))

router.get('/getAllSubCategoryByFilter', expressAsynchandler(subcatagorycontroller.getAllSubCategoryByFilter))

router.get('/getAllSubCategoryBySearch', expressAsynchandler(subcatagorycontroller.getAllSubCategoryBySearch))


// Exporting the router for use in the main application
export default router;
