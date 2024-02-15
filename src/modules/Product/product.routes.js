// Importing necessary modules and dependencies
import { Router } from "express";
import * as productController from "./product.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
// import { validmiddleware } from "../../middleware/validationMiddleware.js";
// import { siginUpSchema } from "./user.validationSchema.js";
import { endPointsRoles } from "./product.endpoints.js";
import { multermiddleHost } from "../../middleware/multer.js";
import { allowedExetintion } from "../../uitils/allowedExtentions.js";

// Creating an Express router instance
const router = Router();

router.post("/addProduct",
    auth(endPointsRoles.ADD_PRODUCT),
    multermiddleHost({
        extensions: allowedExetintion.image
    }).array("images", 3),
expressAsynchandler(productController.addProduct))


router.put("/updateProduct/:productId",
    auth(endPointsRoles.ADD_PRODUCT),
    multermiddleHost({
        extensions: allowedExetintion.image
    }).single("image"),
expressAsynchandler(productController.UpdatePRoduct))
// Exporting the router for use in the main application
export default router;
