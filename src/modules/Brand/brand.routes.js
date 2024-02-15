// Importing necessary modules and dependencies
import { Router } from "express";
import * as Breandcontroller from "./brand.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
// import { validmiddleware } from "../../middleware/validationMiddleware.js";
// import { siginUpSchema } from "./user.validationSchema.js";
import { endPointsRoles } from "./Brand.endpoints.js";
import { multermiddleHost } from '../../middleware/multer.js'
import { allowedExetintion } from "../../uitils/allowedExtentions.js";


// Creating an Express router instance
const router = Router();


router.post('/addBrand', 
auth(endPointsRoles.ADD_BRAND),
multermiddleHost({
    extensions: allowedExetintion.image
}).single('image'),
expressAsynchandler(Breandcontroller.addBrand))




router.put('/updateBrand/:brandId', 
auth(endPointsRoles.ADD_BRAND),
multermiddleHost({
    extensions: allowedExetintion.image
}).single('image'),
expressAsynchandler(Breandcontroller.updateBrands))



router.get('/getData', 
auth(endPointsRoles.ADD_BRAND),
expressAsynchandler(Breandcontroller.getAllBrands))


router.delete('/deleteBrand/:brandId', 
auth(endPointsRoles.ADD_BRAND),
expressAsynchandler(Breandcontroller.deletebrand))


// Exporting the router for use in the main application
export default router;
