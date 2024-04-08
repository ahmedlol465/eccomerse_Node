
import Cart from "../../../../DB/models/cart.model.js"


export async function  addCart(userId, checkProduct,quantity){
        const cartObj = {
            userId,
            products:[
                {
                    productId: checkProduct._id,
                    quantity: quantity,
                    basePrice: checkProduct.appliedPrice,
                    title: checkProduct.title,
                    finalPrice: checkProduct.appliedPrice * quantity
                }
            ],
            subTotal: checkProduct.appliedPrice * quantity
        }
        const newCart = await Cart.create(cartObj)
        return newCart
}