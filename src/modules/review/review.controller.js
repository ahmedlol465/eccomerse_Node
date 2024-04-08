import orderModel from "../../../DB/models/order.model.js"
import productModel from "../../../DB/models/product.model.js"
import reviewModel from "../../../DB/models/review.model.js"



export const addReview = async(req, res, next) => {
    const { _id } = req.authUser
    const { productId } = req.query
    const  isProductValidtoReview  =  await orderModel.findOne({
        userId: _id,
        'orderItems.product': productId,
        orderStatus: 'delivered',
    })
    if(!isProductValidtoReview) return next({message: 'product not found', cause: 404})

    const {reviewRate, reviewComment} = req.body
    const reviewObject = {
        userId: _id,
        productId,
        reviewRate,
        reviewComment
    }

    const addingReview = await reviewModel.create(reviewObject)
    if(!addingReview) return next({message: 'review not added', cause: 500})

    const product = await productModel.findById(productId)
    const review = await reviewModel.find({productId}) 
    let sumOfRates = 0
    for(const rate of review) {
        sumOfRates += rate.reviewRate
        console.log(rate.reviewRate);
    }
    console.log(sumOfRates);
    product.rate = Number(sumOfRates / review.length).toFixed(2)
    await product.save()

    res.status(200).json({message: "review added successfully", data: addingReview, product})

}


// ==================  get all reviews =================
export const getAllReviews = async(req, res, next) => {
    const { productId } = req.params
    const getingReviews = await productModel.find({_id: productId}).populate('reviews')
    if(!getingReviews) return next({message: 'geting reviews is faild'})
    res.status(200).json({message: 'the reviews', data: getingReviews})
}

// ================== delete review =================
export const deleteReview  = async(req, res, next) => {
    const { reviewId } = req.params
    const deletingReview = await reviewModel.findByIdAndDelete(reviewId)
    if(!deletingReview) return next({message: 'deleting review is faild'})
    res.status(200).json({message: 'the review is deleted', data: deletingReview})
}