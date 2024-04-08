import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 0
            },
            basePrice: {
                type: Number,
                required: true,
                default: 0
            },
            finalPrice: {
                type: Number,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            
        }
    ],
    subTotal: {
        type: Number,
        required: true,
        default: 0
    }
    
},{
    timestamps: true
})

export default mongoose.model.Cart || mongoose.model('Cart', cartSchema)