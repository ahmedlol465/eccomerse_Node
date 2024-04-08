import {Router} from 'express'
import * as cartController from './cart.controller.js'
import { auth } from "../../middleware/auth.middleware.js";
import expressAsyncHandler from 'express-async-handler'
import { systemRoles } from '../../uitils/system.role.js';
import { endPointsRoles } from '../model.endPoint.roles.js';
const router = Router()

router.post('/addProductToCart', auth(endPointsRoles.ADD_CATAGORY),expressAsyncHandler(cartController.addProductCart))
router.put('/removeProductFromCart/:productId', auth(endPointsRoles.ADD_CATAGORY),expressAsyncHandler(cartController.removeFromCart))

export default router
