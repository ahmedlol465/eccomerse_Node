// Importing necessary modules and dependencies
import { Router } from "express";
import * as Authcontroller from "./auth.controller.js";
import expressAsynchandler from "express-async-handler";
// import { auth } from "../../middleware/auth.middleware.js";
// import { validmiddleware } from "../../middleware/validationMiddleware.js";
// import { siginUpSchema } from "./user.validationSchema.js";
// import { endPointsRoles } from "../model.endPoint.roles.js";

// Creating an Express router instance
const router = Router();


router.post("/signUp", expressAsynchandler(Authcontroller.signUp));
router.get("/verify-email", expressAsynchandler(Authcontroller.verifyEmail));
router.post("/logIn", expressAsynchandler(Authcontroller.signIn));

// Exporting the router for use in the main application
export default router;
