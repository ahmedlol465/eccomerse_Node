// Importing necessary modules and dependencies
import { Router } from "express";
import * as orderController from './order.contriller.js';
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
import { validmiddleware } from "../../middleware/validationMiddleware.js";
import { orderValidationSchema } from "./order-validationSchema.js";
import { endPointsRoles } from "./order.endpoints.js";


// Creating an Express router instance
const router = Router();


router.post('/addOrder',auth(endPointsRoles.ADD_ORDER), expressAsynchandler(orderController.createOrder))
router.post('/convertCartToOrder',auth(endPointsRoles.ADD_ORDER), expressAsynchandler(orderController.convertCartToOrder))
router.post('/orderDelivery/:orderId',auth(endPointsRoles.ADD_ORDER), expressAsynchandler(orderController.orderDelivery))
router.post('/stripePay/:orderId',auth(endPointsRoles.ADD_ORDER), expressAsynchandler(orderController.payWithStripe))
router.post('/webhook', expressAsynchandler(orderController.stripeWebhookLocal))
router.post('/refund/:orderId',auth(endPointsRoles.ADD_ORDER), expressAsynchandler(orderController.refundOrder))
router.post('/cancelOrder/:orderId',auth(endPointsRoles.ADD_ORDER), expressAsynchandler(orderController.cancelOrder))

// Exporting the router for use in the main application
export default router;
