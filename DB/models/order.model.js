import  mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems:[{
        title: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    }],
    shippingAddress: {
        address: {
            type: String,
            // required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },


    
        phoneNumber: [{
            type: String,
            required: true
        }],



        shippingPrice: {
            type: Number,
            required: true
        },
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        },
        totalPrice: { // shoping price  - coupon price
            type: Number,
            required: true
        },






        paymentMethod: {
            type: String,
            required: true,
            enum: ["Cash", "Stripe", 'Paymob']
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ["Pending", "Paid", "Delivered", "Placed", "Cancelled", "Refund"],
            default: 'Pending'
        },




        isPaid: {
            type: Boolean,
            default: false,
            required: true
        },
        paidAt: {
            type: Boolean,
            default: false,
            required: true
        },





        isDelivered: {
            type: Boolean,
            default: false,
            required: true
        },
        deliveredAt: {
            type: String
        },
        deliveredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        payment_intent: {String}
    
},{
    timestamps: true
})

export default mongoose.model.Order || mongoose.model('Order', orderSchema)