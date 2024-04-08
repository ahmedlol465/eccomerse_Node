/**
 * 
 * @param {*} userId 
 */

import Cart from "../../../../DB/models/cart.model.js";

// userId  === _id
export async function getUserCart (userId) {
    const userCart = await Cart.findOne({userId})
    return userCart
}