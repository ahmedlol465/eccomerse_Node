import { Router } from "express";
import * as reviewController from "./review.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import expressAsynchandler from "express-async-handler";
import { endPointsRoles } from "./review.endPoint.js";
import { validmiddleware } from "../../middleware/validationMiddleware.js";
import * as validator from './review.validation.js'



const router = Router()


router.post('/addReview', 
auth(endPointsRoles.ADD_REVIEW), 
validmiddleware(validator.addReviewSchema),expressAsynchandler(reviewController.addReview))


router.get('/getAllReviews/:productId', 
auth(endPointsRoles.ADD_REVIEW), 
// validmiddleware(validator.addReviewSchema),
expressAsynchandler(reviewController.getAllReviews))




router.delete('/deleteReview/:reviewId', 
auth(endPointsRoles.ADD_REVIEW), 
// validmiddleware(validator.addReviewSchema),
expressAsynchandler(reviewController.deleteReview))


export default router