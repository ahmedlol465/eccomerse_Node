// Importing necessary modules and dependencies
import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
import { validmiddleware } from "../../middleware/validationMiddleware.js";
import * as validator from './coupon-validationSchema.js'
// import { addCouponSchema } from "./coupon-validationSchema.js";
import { endPointsRoles } from "./coupon.endpoints.js";


// Creating an Express router instance
const router = Router();

router.post('/addCoupon', auth(endPointsRoles.ADD_COUPON),
validmiddleware(validator.addCouponSchema)
,expressAsynchandler(couponController.addCoupon))

router.post('/', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.validationCouponApi))
router.post('/enableAndDisableCoupon', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.enableAndDisableCoupon))
router.post('/getDisableCoupon', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.getDisableCoupon))
router.post('/getEnabledCoupon', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.getEnabledCoupon))

router.get('/getAllCouponsBySearch', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.getAllCouponsBySearch))
router.get('/getAllCouponsByPagination', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.getAllCouponsByPagination))
router.get('/getAllCouponsByFilter', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.getAllCouponsByFilter))


router.get('/getCouponById/:couponId', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.getCouponById))


router.get('/getCouponById/:couponId', auth(endPointsRoles.ADD_COUPON),expressAsynchandler(couponController.getCouponById))

// Exporting the router for use in the main application
export default router;

