// Importing necessary modules and dependencies
import { Router } from "express";
import * as catagorycontroller from "./catagory.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
// import { validmiddleware } from "../../middleware/validationMiddleware.js";
// import { siginUpSchema } from "./user.validationSchema.js";
import { endPointsRoles } from "./catagory.endpoints.js";
import { multermiddleHost } from '../../middleware/multer.js'
import { allowedExetintion } from "../../uitils/allowedExtentions.js";


// Creating an Express router instance
const router = Router();


router.post('/addCatagory', 
auth(endPointsRoles.ADD_CATAGORY),
multermiddleHost({
    extensions: allowedExetintion.image
}).single('image'),
expressAsynchandler(catagorycontroller.addCatogary))



router.put('/updateCatagory/:catagoryId', 
auth(endPointsRoles.ADD_CATAGORY),
multermiddleHost({
    extensions: allowedExetintion.image
}).single('image'),
expressAsynchandler(catagorycontroller.updateCatagory))


router.get('/getAllCategory',auth(endPointsRoles.ADD_CATAGORY) ,expressAsynchandler(catagorycontroller.getAllCatagory))


router.delete('/deleteCategory/:catagoryId',auth(endPointsRoles.ADD_CATAGORY) ,expressAsynchandler(catagorycontroller.deleteCategory))

// Exporting the router for use in the main application
export default router;
