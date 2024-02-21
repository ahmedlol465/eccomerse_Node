import { checkProductIsExistInCart } from "./check-product-in-cart.js";


export async function updateProductQuantity(cart, productId, quantity) {
    const isProductExistInCart = await checkProductIsExistInCart(cart, productId)
    if(!isProductExistInCart) return null 

    cart?.products.forEach(product => {
        console.log(product);
        if(product.productId.toString() === productId){
            product.quantity = quantity;
            product.finalProce = product.basePrice * quantity;
        }
    });
    // subTotal
    let subTotal = 0;
for (const product of cart.products) {
    // console.log(product);
    subTotal += product.finalPrice
}
cart.subTotal = subTotal

return await cart.save()

}