import { applyCouponvalidation } from "../../uitils/coupon.validation.js";
import { checkProductAvailabilty } from "../Cart/utils/check-product-in-db.js";
import Order from "../../../DB/models/order.model.js";
import Cart from "../../../DB/models/cart.model.js";
import couponUsersModel from "../../../DB/models/coupon-users.mode.js";
import { getUserCart } from "../Cart/utils/get-user-cart.js";
import productModel from "../../../DB/models/product.model.js";
import { nanoid } from "nanoid";
import createInvoice from "../../uitils/pdfkit.js";
import sendEmailService from "../services/send-email.service.js"
import { createCheckoutSession, createPaymentIntent, createStripeCoupon, confirmPaymentIntent, refundPaymentIntent } from "../../payment-handle/stripe.js";
import { DateTime } from "luxon";



// ====================== add order ===========================
export const createOrder = async (req, res, next) => {
    // destructure data from the req.body
    const { 
        product,
        quantity,
        couponCode,
        paymentMethod,
        phoneNumber,
        address,
        city,
        country,
        postalCode

    } = req.body;
    const { _id: userId } = req.authUser;

    // check if coupon code is valid
    let coupon = null;
    if(couponCode){
    const isCouponValid = await applyCouponvalidation(couponCode, userId);
    if (isCouponValid.status) return next({ message: isCouponValid.msg, cause: isCouponValid.status });
    coupon = isCouponValid;
    }

    // product check
    const isProductValid = await checkProductAvailabilty(product, quantity);
    if (!isProductValid) return next({ message: "product not found", cause: 404 });

    let orderItems = [{
        title: isProductValid.title,
        quantity,
        price: isProductValid.appliedPrice,
        product: isProductValid._id
    }];

    let shippingPrice =  orderItems[0].price * quantity;
    let totalPrice =  shippingPrice

    if(coupon?.isFixed && !(coupon?.couponAmount <= shippingPrice)) return next({message: "coupon amount should be less than shipping price", cause: 400});


    if(coupon?.isFixed) {
        totalPrice = shippingPrice - coupon?.couponAmount;
    }else if(coupon?.isPercentage) {
        totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount / 100);
    }

    // orderStatus, PaymenMethode
    let orderStatus;
    if(paymentMethod === 'Cash') orderStatus = 'Pending';


    // create order
    const orderObject = new Order({
        userId, 
        orderItems,
        shippingAddress: { address, city, postalCode, country},
        phoneNumber,
        shippingPrice,
        coupon: coupon?._id,
        totalPrice,
        paymentMethod,
        orderStatus
    })


    const savedOrder = await orderObject.save();

    isProductValid.stock -= quantity;
    await isProductValid.save()

    
    if(coupon){
    await couponUsersModel.updateOne({ couponId: coupon._id }, { $inc: { usageCount: 1 } })
    }

    if(!savedOrder) return next({ message: "something went wrong", cause: 500 });



     // create invoive document 
     const orderCode = `${req.authUser.username}_${nanoid(3)}`

     // generate invoice Object
     const orderInvouce = {
         shipping: {
             name: req.authUser.username,
             address: orderObject.shippingAddress.address,
             city: orderObject.shippingAddress.city,
             state: orderObject.shippingAddress.postalCode,
             country: orderObject.shippingAddress.country,
         },
         orderCode,
         date: orderObject.createdAt,
         items: orderObject.orderItems,
         subTotal: orderObject.shippingPrice,
         paidAmount: orderObject.totalPrice,
     }
 
      createInvoice(orderInvouce, `${orderCode}.pdf`)
     await sendEmailService({
        to: req.authUser.email,
        subject: "Order confirmation",
        message: `<h1>Order confirmation</h1>`,
        attachments: [
            {
                path: './Files/' + `${orderCode}.pdf`,
            }
        ]
        })

    res.status(200).json({ success: true });
}



export const convertCartToOrder = async ( req, res, next ) => {
    // destructure data from the req.body
    const { 
        couponCode,
        paymentMethod,
        phoneNumber,
        address,
        city,
        country,
        postalCode

    } = req.body;
    const { _id: userId } = req.authUser;

    // cart check
    const userCart = await getUserCart(userId);
    if(!userCart) return next({ message: "user cart not found", cause: 404 });

    // check if coupon code is valid
    let coupon = null;
    if(couponCode){

    const isCouponValid = await applyCouponvalidation(couponCode, userId);
    if (isCouponValid.status) return next({ message: isCouponValid.msg, cause: isCouponValid.status });
    coupon = isCouponValid;
    }


    let orderItems = userCart.products.map(cartItem => {
        return {
            title: cartItem.title,
            quantity: cartItem.quantity,
            price: cartItem.basePrice,
            product: cartItem.productId
        }
    })

    
    
    let shippingPrice =  userCart.subTotal
    let totalPrice =  shippingPrice

    // applaying coupons
    if(coupon?.isFixed && !(coupon?.couponAmount <= shippingPrice)) return next({message: "coupon amount should be less than shipping price", cause: 400});

    if(coupon?.isFixed) {
        totalPrice = shippingPrice - coupon?.couponAmount;
    }else if(coupon?.isPercentage) {
        totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount / 100);
    }



    // orderStatus, PaymenMethode
    let orderStatus;
    if(paymentMethod === 'Cash') orderStatus = 'Pending';


    // create order
    const orderObject = new Order({
        userId, 
        orderItems,
        shippingAddress: { address, city, postalCode, country},
        phoneNumber,
        shippingPrice,
        coupon: coupon?._id,
        totalPrice,
        paymentMethod,
        orderStatus
    })


    const savedOrder = await orderObject.save();



    for (const item of orderObject.orderItems) {
        await productModel.updateMany({_id: item.product }, {$inc: {stock: -item.quantity}})
        
    }

    
    if(coupon){
    await couponUsersModel.updateOne({ couponId: coupon._id }, { $inc: { usageCount: 1 } })
    }


    await Cart.findByIdAndDelete(userCart._id)


    if(!savedOrder) return next({ message: "something went wrong", cause: 500 });

   

    res.status(200).json({ success: true, data: savedOrder });
}



// ===================== order delivery ===============

export const orderDelivery = async (req, res, next) => {
    const {orderId}= req.params;

    const updateOrder = await Order.findOneAndUpdate({
        _id: orderId,
        orderStatus: {$in: ['Paid','Placed']}
    },{
        orderStatus: 'Delivered',
        deliveredAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        deliveredBy: req.authUser._id,
        isDelivered: true
    },{
        new: true
    })

   if(!updateOrder) return next({message: 'Order not found or cannot be delivered', cause: 404});

    res.status(200).json({message: 'Order delivered successfully', order: updateOrder});
}


// ================= order payment with stripe =====================
export const payWithStripe = async (req, res, next) => {
    const { orderId } = req.params
    // const { _id } = req.authUser

    const order = await Order.findOne({_id: orderId, orderStatus: 'Pending'})
    if(!order) return next({message: 'Order not paid', cause: 404})

    const paymentObject = {
        metadata:{orderId: order._id.toString()},
        customer_email: req.authUser.email,
        discounts:[],
        line_items: order.orderItems.map(item => {
            return {
                price_data: {
                    currency: 'EGP',
                    product_data: {
                        name: item.title
                    },
                    unit_amount: Math.ceil(item.price * 100)
                },
                quantity: item.quantity
            }
        })
    }

    if(order.coupon) {
        const stripeCoupon = await createStripeCoupon({couponId: order.coupon})
        if(stripeCoupon.status) return next({message: stripeCoupon.msg, cause: stripeCoupon.status})
        
        paymentObject.discounts.push({
            coupon: stripeCoupon.id
        })

    }

console.log(paymentObject);
    const checkoutSession = await createCheckoutSession(paymentObject)


    res.status(200).json({ checkoutSession  }) // PaymentIntent
    

}









// solve the error of webhook (metadata)

// ==================================applay webhook locally==========================================
export const stripeWebhookLocal = async (req, res, next) => {
    const orderId = req.body.data.object.metadata.orderId;
    
 
    const confirmedOrder = await confirmPaymentIntent({paymentIntentId: req.body.data.object.payment_intent}) 
    console.log(confirmedOrder);

    res.status(200).json({ data: "webhook getting" })
}




// ======================= refund order =====================
export const refundOrder = async (req, res, next) => {
    const { orderId } = req.params



    const findOrder = await Order.findOne({_id: orderId}) //orderSataus: "Paid", user: req.authUser._id
    if(!findOrder) return next({message: 'Order not found', cause: 404})
 

    const refundOrder = await refundPaymentIntent({paymentIntentId: findOrder.payment_intent})
    if(!refundOrder) return next({message: 'Order not found', cause: 404})

    findOrder.orderStatus = 'Refunded'
    await findOrder.save()

    res.status(200).json({message: 'Order refunded successfully', data: refund})

}



// ======================= cancel order =====================
export const cancelOrder = async (req, res, next) => {

    const { orderId } = req.params

   const findOrder = await Order.findById({_id: orderId}) 

   const twentyFourHoursLater = new Date(findOrder.createdAt.getTime() + 24 * 60 * 60 * 1000);
   if(new Date(Date.now()) > twentyFourHoursLater) return next({message: 'Order not found', cause: 404})

    findOrder.orderStatus = 'Cancelled'
    await findOrder.save()
    if(!findOrder) return next({message: 'Order not found', cause: 404})

    res.status(200).json({message: 'Order cancelled successfully', data: cancelOrder})
}