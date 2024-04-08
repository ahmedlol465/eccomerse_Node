


export async function checkProductIsExistInCart (cart, productId) {
    return cart.products.some(
        (product) => product.productId.toString() === productId
    )
    // console.log(cart.products);
}