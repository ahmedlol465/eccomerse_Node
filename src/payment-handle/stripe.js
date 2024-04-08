import Stripe from "stripe";
import Coupon from "../../DB/models/coupon.model.js";




// export const createCheckoutSession = async (
//   // named arguments  , positional arguments , reference arguments
// {
//     customer_email,
//     metadata,
//     line_items,
//     discounts,
// }
// ) => {
//   // console.log(line_items);
//   // console.log(customer_email);
//   // console.log(metadata);
// // 
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const paymentData  = await stripe.checkout.sessions.create({
//     payment_method_types:['card'],
//     mode: 'payment',
//     customer_email,
//     metadata,
//     success_url: "http://localhost:3000/success",
//     cancel_url: "http://localhost:3000/cancel",
//     line_items,
//     discounts,
// });
// // console.log(metadata);
// return paymentData;

// }





// check out sesstion 
export const createCheckoutSession = async (
  // named arguments  , positional arguments , reference arguments
{
    customer_email,
    metadata,
    line_items,
    discounts,
}
) => {
  // console.log(metadata);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const payment = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        customer_email,
        metadata,
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        discounts,
        line_items
    })
    return payment
}




export const createStripeCoupon = async ({couponId}) => {


    const findCoupon = await Coupon.findOne(couponId)
    if(!findCoupon) return next({message: "coupon not found", cause: 404})

    let couponObject = {}

    if(findCoupon.isFixed) {
        couponObject = {
            name: findCoupon.couponCode,
            amount_off: findCoupon.couponAmount,
            currency: 'EGP'
        }
    }

    if(findCoupon.isPercentage) {
        couponObject = {
            percent_off: findCoupon.couponAmount
        }
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const stripeCoupon = await stripe.coupons.create(couponObject)

    return stripeCoupon
}











// create stripe payment method
export const createPaymentMethod = async ({token}) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            token
        },
    })
    return paymentMethod
}

// create payment intent 
export const createPaymentIntent = async ({amount, currency}) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentMethod = await createPaymentMethod({token: 'tok_visa'})

    
 const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
    automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never' // to not redirect
    },
    payment_method: paymentMethod.id
})
return  paymentIntent; 

}









// create stripe coupon 



    // retrive a stripe payemeny inten t  
    export const retrievePaymentIntent = async ({paymentIntentId}) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
return paymentIntent
    }



// confirmation the payment
export const confirmPaymentIntent = async ({paymentIntentId}) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentDetails = await retrievePaymentIntent({paymentIntentId});

// console.log(paymentDetails);
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId,{
        payment_method: paymentDetails.payment_method
    });
    // console.log(paymentIntent);
    return paymentIntent
 
}





export const refundPaymentIntent = async ({paymentIntentId}) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


    const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId
    });
    return refund
 
}


// create stripe payment methodd then 
// create payment intent
// retrive payment intent
// confirm payment method





/*

// create a checkout session
export const createCheckoutSession = async (
    // named arguments  , positional arguments , reference arguments
  {
      customer_email,
      metadata,
      line_items,
      discounts,
  }
) => {
    console.log(line_items);
    // console.log(customer_email);
    console.log(metadata);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentData  = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode: 'payment',
      customer_email,
      metadata,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      line_items,
      discounts,
  });

  return paymentData;

}


// create a stripe coupon

export const createStripeCoupon = async ({couponId})=>{
  
  const findCoupon = await Coupon.findById(couponId);
  if(!findCoupon) return {status: false, message: 'Coupon not found'};
  
  
  let couponObject = {}
  if(findCoupon.isFixed){
      couponObject = {
          name:findCoupon.couponCode,
          amount_off: findCoupon.couponAmount * 100,
          currency: 'EGP'
      }
      
  }
  
  if(findCoupon.isPercentage){
      couponObject = {
          name:findCoupon.couponCode,
          percent_off: findCoupon.couponAmount,
      }
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const stripeCoupon = await stripe.coupons.create(couponObject)

  return stripeCoupon;

}

// create a stripe payment method
export const createStripePaymentMethod = async ({token}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
          token
      }
  });
  return paymentMethod;
}

// create a stripe payment intent
export const createPaymentIntent = async ({amount, currency}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentMethod  = await createStripePaymentMethod({token: 'tok_visa'});

  const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
      },
      payment_method: paymentMethod.id,
  });
  return paymentIntent;
}
// retrive a stripe payment intent
export const retrievePaymentIntent = async ({paymentIntentId}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
}

// confirm a stripe payment intent
export const confirmPaymentIntent = async ({paymentIntentId}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentDetails = await retrievePaymentIntent ({paymentIntentId});

  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentDetails.payment_method
  });
  return paymentIntent;
}



// refund a stripe payment intent
export const refundPaymentIntent = async ({paymentIntentId}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
  });
  return refund;
}
*/