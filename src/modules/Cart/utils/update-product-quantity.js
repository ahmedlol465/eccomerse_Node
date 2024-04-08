import { checkProductIsExistInCart } from "./check-product-in-cart.js";
import { calculateSubTotal } from "./calculate-subTotal.js";


export async function updateProductQuantity(cart, productId, quantity) {
    const isProductExistInCart = await checkProductIsExistInCart(cart, productId)
    if(!isProductExistInCart) return null 

    cart?.products.forEach(product => {
        // console.log(product);
        if(product.productId.toString() === productId){
            product.quantity = quantity;
            product.finalPrice = product.basePrice * quantity;
        }
    });

cart.subTotal = calculateSubTotal(cart.products)
return await cart.save()


    // subTotal
//     let subTotal = 0;
// for (const product of cart.products) {
//     subTotal += product.finalPrice
// }
// cart.subTotal = subTotal

// return await cart.save()

}