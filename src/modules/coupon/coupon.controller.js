import Coupon from "../../../DB/models/coupon.model.js"
import CouponUsers from "../../../DB/models/coupon-users.mode.js";
import User from '../../../DB/models/user.model.js'
import { applyCouponvalidation } from "../../uitils/coupon.validation.js";
import { APIFeatures } from "../../uitils/api-features.js";


export const addCoupon = async(req,res,next) => {
    const {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isFixed,
        isPercentage,
      Users, // Users[{userId, macUsage}]  => // Users[{userId, macUsage, couponId}]
    } = req.body;  
    const { _id: addedBy } = req.authUser
    // coupun code chexk 
    const isCouponCodeExist = await Coupon.findOne({couponCode})
    if(isCouponCodeExist) return next({message: "coupon already exist", cause: 409})

    if(isFixed == isPercentage) return next({message: "coupon can be either fixed or percentage", cause: 400})

    if(isPercentage){
        if(couponAmount > 100) return next({message: "percentage should be less than 100", cause: 400})
    }

    const couponObject = {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isFixed,
        isPercentage,
        addedBy
    }

    const coupon = await Coupon.create(couponObject)

    const userIds = []
    // for (const user of Users) {
    //     const isUserExist = await User.findById(user.userId)
    //     if(!isUserExist) {
    //         return next({message: "user not found", cause: 404})
    //     }
    // }
    for (const user of Users) {
        userIds.push(user.userId)
    }
    const isUserexist = await User.find({_id: {$in:userIds}}) // in make sure value in arry usage  
    // it doent return error it return the vlaid only so i will check the length to return error
            if(isUserexist.length !== Users.length){
                await Coupon.findByIdAndDelete(coupon._id)
                return next({message: "user not found", cause: 404})
            }
    const couponUsers = await CouponUsers.create(
        Users.map(ele => ({...ele, couponId: coupon._id}))
        )


    res.status(201).json({mesage: "coupon added successfully", coupon, couponUsers})
}






export const validationCouponApi = async(req,res,next) =>  {
    const { code } = req.body
    const { _id: userId } = req.authUser

    const isCouonValid = await applyCouponvalidation(code, userId)
    if(isCouonValid.status) {
        return next({message: isCouonValid.msg, cause: isCouonValid.status})
    }

    // coupon status check
    if(isCouonValid.couponStatus === 'expired') return { msg: 'this is expired', status: 400}
    res.json({message: 'coupon is valid', coupon: isCouonValid})
}


// ===============================================enablle annd disable coupon ================================
export const enableAndDisableCoupon = async(req,res,next) => {
    const { couponId } = req.params
    const { isEnable } = req.body
    const coupon = await Coupon.findById(couponId)
    if(!coupon) return next({message: "coupon not found", cause: 404})
    if(coupon.isEnable === isEnable) {return next({message: `coupon is already ${isEnable}`, cause: 400})}

    coupon.isEnable = isEnable
    await coupon.save()
    res.json({message: 'coupon is updated successfully', coupon})
}


// =============================================== get disable coupon ================================
export const getDisableCoupon = async(req,res,next) => {
    const coupon = await Coupon.find({isEnable: false})
    if(!coupon) return next({message: "coupon not found", cause: 404})
    res.json({coupon})
}

// =============================================== get enabled coupon ================================
export const getEnabledCoupon = async(req,res,next) => {
    const coupon = await Coupon.find({isEnable: true})
    if(!coupon) return next({message: "coupon not found", cause: 404})
    res.json({coupon})
}



  
  
  // ================  get all Coupons =================
  export const getAllCouponsBySearch = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query, Coupon.find()).search(query)
  
  
    const Products = await features.mongooseQuery  
  
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  // ================  get all coupins =================
  export const getAllCouponsByPagination = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query, Coupon.find()).pagination({page, size})
  
    const Products = await features.mongooseQuery  
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  
  
  // ================  get all coupons =================
  export const getAllCouponsByFilter = async(req,res,next) => {
    const { page, size, sort, ...query } = req.query  
  
    const features = new APIFeatures(req.query , Coupon.find()).filter(query) 
  
  
    res.status(200).json({message: "the product", data: Products})
  }
  
  
  
  // ==================== get coupon by id =================
  export const getCouponById = async(req,res,next) => {
    const { couponId } = req.params
    const coupon = await Coupon.findById({_id:couponId})
    if(!coupon) return next({message: "coupon not found", cause: 404})
    res.json({coupon})
  }


  // =========================== update Coupon ===========================
  export const updateCoupon = async(req,res,next) => {
    const { couponId } = req.params
    const { couponCode, discount, couponAmount, isFixed, isPercentage, fromDate, toDate } = req.body
    const coupon = await Coupon.findByIdAndUpdate({_id: couponId}, {
        couponCode,
        discount,
        couponAmount,
        isFixed,
        isPercentage,
        fromDate,
        toDate
    }, {new: true})
    if(!coupon) return next({message: "coupon not found", cause: 404})
    coupon.code = code
    coupon.discount = discount
    await coupon.save()
    res.json({message: 'coupon is updated successfully', coupon})
  }