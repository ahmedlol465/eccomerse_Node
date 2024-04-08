/**
 * @param { string } productId
 * @param { number } quantaty
 * @describtion check if product exist and if its available
 * @returns { promise<void> || null}  void  === null
 */

import product from "../../../../DB/models/product.model.js"





export async function checkProductAvailabilty(productId, quantity){
    const checkProduct = await product.findById({_id: productId, stock: {$gte: quantity}})

    if(checkProduct.stock < quantity || !checkProduct) return null

    return checkProduct

}