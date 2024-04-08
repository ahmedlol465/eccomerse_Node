import { scheduleJob } from "node-schedule";
import Coupon from "../../DB/models/coupon.model.js";
import { DateTime } from 'luxon'

export function cronToChaneExpiredCoupons(){
    scheduleJob('*/20 * * * * *' ,async()=> {
        console.log("cronToChaneExpiredCoupons() is running every 5 secound");
        const coupons = await Coupon.find({couponStatus: 'valid'})  // find all less than today
        for (const coupon of coupons) {
            if (DateTime.fromISO(coupon.toDate) < DateTime.now()) {
                coupon.couponStatus = "expired";
                // coupon.addedBy = _id
            }
            await coupon.save()
        }
    })
}
export function cronToChaneExpiredCouponsv2(){
    scheduleJob('*/5 * * * * *' ,async()=> {
        console.log("cronToChaneExpiredCoupons() is running every 5 secound v2");
        const coupons = await Coupon.find({couponStatus: 'valid'})  // find all less than today
        for (const coupon of coupons) {
            if (DateTime.fromISO(coupon.toDate) < DateTime.now()) {
                coupon.couponStatus = "expired";
                // coupon.addedBy = _id
            }
            await coupon.save()
        }
    })
}

