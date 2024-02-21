import Cart from '../../../DB/models/cart.model.js'
import Product from '../../../DB/models/product.model.js'
import { addCart } from './utils/add-cart.js'
// import { checkProductIsExistInCart } from './utils/check-product-in-cart.js'
import { checkProductAvailabilty } from './utils/check-product-in-db.js'
import { getUserCart } from './utils/get-user-cart.js'
import { updateProductQuantity } from './utils/update-product-quantity.js'


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
    // const userCart = await Cart.findOne({userId: _id})
    const userCart = await getUserCart(_id)
    // if user has no cart
    if(!userCart) {
        // const cartObj = {
        //     userId: _id,
        //     products:[
        //         {
        //             productId,
        //             quantity,
        //             basePrice: checkProduct.appliedPrice,
        //             title: checkProduct.title,
        //             finalPrice: checkProduct.appliedPrice * quantity
        //         }
        //     ],
        //     subTotal: checkProduct.appliedPrice * quantity
        // }
        // const newCart = await Cart.create(cartObj)

        const newCart = await addCart(_id, checkProduct, quantity)
        return res.status(200).json({message: 'product added to your cart', data: newCart})
}
 // if user has cart
 // check if the product aleady exist or no 
    // let isProductExist = false


    // usercart.products  she make it in setion why

    const getUpdated = await updateProductQuantity(userCart,productId, quantity)

    if(!getUpdated) return next({message: 'product not douns in cart', cause: 404})



//     const isProductExistInCart = await checkProductIsExistInCart(userCart, productId)
//     console.log({ isProductExistInCart });

    
// for (const product of userCart.products) {
//     if(product.productId.toString() === productId) {
//         // console.log(product);
//         // the same product 
//         product.quantity = quantity
//         // console.log(product.finalPrice);
//         product.finalPrice = product.basePrice * quantity
//         isProductExist  = true
//     }
// }
// // push the info of the same product 
// if(!isProductExist) {  // = TRUE
//     userCart.products.push({
//         productId,
//         quantity,
//         basePrice: checkProduct.appliedPrice,
//         title: checkProduct.title,
//         finalPrice: checkProduct.appliedPrice * quantity,
//     });
// }

    // let subTotal = 0; 


// for (const product of userCart.products) {
//     // console.log(product);
//     subTotal += product.finalPrice
// }
// userCart.subTotal = subTotal

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
    
    let subTotal = 0;
    // loop every product in userCart.product 
    // to sumtion the final price for  each prouct 
    for (const product of userCart.products) {
        subTotal += product.finalPrice
}
userCart.subTotal = subTotal
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




