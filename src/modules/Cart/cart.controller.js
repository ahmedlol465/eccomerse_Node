import { get } from 'mongoose';
import Cart from '../../../DB/models/cart.model.js'
import Product from '../../../DB/models/product.model.js'
import { addCart } from './utils/add-cart.js'
import { pushNewProduct } from "./utils/add-product-to-cart.js";
// import { checkProductIsExistInCart } from './utils/check-product-in-cart.js'
import { checkProductAvailabilty } from './utils/check-product-in-db.js'
import { getUserCart } from './utils/get-user-cart.js'
import { updateProductQuantity } from './utils/update-product-quantity.js'
import { calculateSubTotal } from './utils/calculate-subTotal.js';


//================================   add to cart====================================

/**
 * @params { productId, quantity } from req.body
 * @params { userId = _id } from req.authUser
 * @description 1. check if product exist and aviliable
 * 2. check if user has a cart 
 * 3. if he has a cart then{
 * 4. product if the product already exist or not 
 * 5. if it exist, then update quantity and finalPrice}
 * 6. if not exist then add the product to the cart 
 * 
 * 7. add to you db and add the product to the cart 
 */


export const addProductCart = async(req,res,next) => {
    const { productId, quantity } = req.body
    const { _id } = req.authUser

    // // 1. check if product exist and if its avaliable
    // const checkProduct = await Product.findById(productId)
    // // console.log(checkProduct);
    // if(checkProduct.stock < quantity) return next({message: 'product finished quantity', cause: 400}) 
    
    const checkProduct = await checkProductAvailabilty(productId, quantity)
    if(!checkProduct) return next({message: 'product not found', cause: 404}) 

    // 2. check if user has a cart 
    // if _id found the cart is found

    const userCart = await getUserCart(_id)
    // if user has no cart
    if(!userCart) {
      
        const newCart = await addCart(_id, checkProduct, quantity)
        return res.status(200).json({message: 'product added to your cart', data: newCart})
}
 // if user has cart
 // check if the product aleady exist or no 
    // let isProductExist = false

    

    // usercart.products  she make it in setion why

    const getUpdated = await updateProductQuantity(userCart,productId, quantity)
    if(!getUpdated) {
        const added = await pushNewProduct(userCart, checkProduct, quantity);
        if(!added) return next ({message: 'product not added to cart', cause: 400})
    }



await userCart.save()
res.status(200).json({messagea: 'product added to cart succefully', data: userCart})
}






// ====================  remove from cart ===================
export const removeFromCart = async(req,res,next) => {
    const { productId } = req.params
    const { _id } = req.authUser
    
// in => array 

// check if product exist in cart or no 
const  userCart = await Cart.findOne({userId: _id, "products.productId": productId})   // "access arr in mongoose"
console.log(userCart);

if(!userCart) return next({message: 'product not found in cart', cause: 404})


// delete product from cart 
    // loop on every product and return all without productId in params 
    userCart.products = userCart.products.filter(product => product.productId.toString() !== productId)  // return all withouth the productId


    // recalculate subToltal

userCart.subTotal = calculateSubTotal(userCart.products)
// save cart without the the product Id tha i give him
const newCart = await userCart.save()

// remove cart in final product
if(newCart.products.length === 0) {
    await Cart.findByIdAndDelete(newCart._id)
}
res.status(200).json({messagea: 'product deleted to cart succefully'})
}




// =================     ====================================





/** @notes 
*possitional arguments ()   no depending on the name x = y depend on the possition in the function 
*named  arguments   ({ })   depending on the name x = x
 */




