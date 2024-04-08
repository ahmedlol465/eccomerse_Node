import { calculateSubTotal } from "./calculate-subTotal.js"

export async function pushNewProduct(cart, product, quantity) {
    cart?.products.push({
        productId: product._id,
        quantity: quantity,
        basePrice: product.appliedPrice,
        title: product.title,
        finalPrice: product.appliedPrice * quantity
    })


    cart.subTotal = calculateSubTotal(cart.products)
    await cart.save()
}


