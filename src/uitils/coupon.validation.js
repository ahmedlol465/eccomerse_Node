import Coupon from "../../DB/models/coupon.model.js"
import couponUsers from "../../DB/models/coupon-users.mode.js"
import { DateTime } from "luxon";


export async function applyCouponvalidation ( couponCode, userId) {
    // coupon code check 
    const coupon = await Coupon.findOne({couponCode})
    //  coupon status check
    if(!coupon) return {msg: 'Coupon code is invalid', status: 400}
    
    if(coupon.couponStatus === 'expired' ||  DateTime.fromISO(coupon.toDate) < DateTime.now())

        return { msg: "coupon is expired", status: 400 };

    if(DateTime.now() < DateTime.fromISO(coupon.fromDate)) return {msg: 'coupoin time to use not now ', status: 400}


    // user cases
    const isUserAssgined = await couponUsers.findOne({couponId: coupon._id, userId})
    if(!isUserAssgined) return {msg: 'this coupon not valid for you', status: 400}

    // max usage check 
    if(isUserAssgined.maxUsage <= isUserAssgined.UsageCount) 
    return {msg: 'this coupon not valid for use', status: 400}
        return coupon
}


export const convertCartToOrder = async ( req, res, next ) => {
    
}
