import bcrypt from 'bcrypt'
import Jwt  from 'jsonwebtoken';
import User from "../../../DB/models/user.model.js";
import sendEmailService from "../services/send-email.service.js"
import generateUniqueString from '../../uitils/generateUniqeString.js';
import { customAlphabet, nanoid } from 'nanoid';


export const signUp = async (req, res, next) => {
    const {
        username,
        age,
        email,
        role,
        mobileNumber,
        password,
        address
    } = req.body

    // check if user in data base 

    const isEmailDublicated =  await User.findOne({email})
    if(isEmailDublicated) {
        return next (new Error("email already exist", { cause: 409 }))
    }

    // make token for email 
    const userToken = Jwt.sign({email}, process.env.JWT_SECRET_VERIFICATION, { expiresIn: "1d" })

    // confirmation email
    const isEmailSent = await sendEmailService({
        to: email,
        subject: 'email verification',
        message: `<h2>please click on this link to verify your email</h2>
                    <a href="http://localhost:3000/Auth/verify-email?token=${userToken}">verify Email</a>`
    })
    if(!isEmailSent) {
        return next (new Error("email not sent", { cause: 500 }))
    }


    // hash password 
    const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);  // + to make strint to a number 

    // create user 
    const newUser = await User.create({
        username,
        email,
        password: hashpassword,
        age,
        mobileNumber,
        address,
        role
    })
    if(!newUser) return next(new Error("error creating User please try again later", { cause: 409 }))
    res.status(200).json({
        success: true,
        message: "user created succefully",
        data: newUser
    })
}


export const verifyEmail = async (req, res, next) => {
    const { token } = req.query
    const decodedData = Jwt.verify(token, process.env.JWT_SECRET_VERIFICATION)
    //check email
    const user  = await User.findOneAndUpdate({email: decodedData.email, isEmailVerifide: false}, {isEmailVerifide: true})
    if(!user) return next(new Error("user not found", { cause : 404 }))

    res.status(200).json({
        success: true,
        message: 'email verified successfully',
        data: user
    })
}



// ================ sign In  ==========
export const signIn = async (req, res, next) => {
    const { email, password } = req.body 
    // check user
    const user = await User.findOne({email, isEmailVerifide: true})
    if(!user) {
        return next(new Error("invalid login credentails", { cause: 404 }))
    }
        // check password 
        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if(!isPasswordValid) {
            return next(new Error("invalid login credentails", { cause: 404 }))
    }

// gemnerate login token 
const token = Jwt.sign({email, id: user._id, isloggedIn: true}, process.env.JWT_SECRET_LOGIN, {expiresIn: '1d'})

// update islogged in = true in data base 
user.isloggedIn = true;
user.token = token
await user.save()


res.status(200).json({
    success: true,
    message: 'user logged in successfuly',
    data: {
        token
    }
})

}




// =====================  update user =================
export const updateProfile = async (req, res, next) => {
    const { username, email, password, oldPassword, mobileNumber, address, age } = req.body
    const { _id } = req.authUser

    // git the date in updated field
    const updateField = {username}
    if(username) updateField.username = username
    if(mobileNumber) updateField.mobileNumber = mobileNumber
    if(age) updateField.age = age
    if(address) updateField.address = address
    
    
    if(password && oldPassword) {
      // get pass from database
        const getPasswordFromDateBase = await User.findById(_id, "password")
        // compare old password with password in data base
        const isPasswordValid = bcrypt.compareSync(oldPassword, getPasswordFromDateBase.password);
            if (!isPasswordValid) return next(new Error("invalid password userd before please try another one", { cause: 404 }));
        // becypt password
        const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
        updateField.password = hashpassword

    }



    // check email found
    if(email){
    const isEmailDublicated = await User.findOne({email: updateField.email})
    if(!isEmailDublicated) return next (new Error("email is already exist please choose another one", { cause: 400 }))
    updateField.email = email
    }

        if (Object.keys(updateField).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

    // find user by id and update 
    const findUserAndUpdate = await User.findByIdAndUpdate(
        { _id },
        updateField,
        { new: true }
    );
    if(!findUserAndUpdate) return next (new Error("faild update please try agein", { cause: 404 }))
    return res.status(200).json({message: "updated Done"})
}



// =====================  delete user =================
export const deleteProfile = async (req, res, next) => {
    const { _id, role } = req.authUser

    if(role === 'User'){

    // find user by id and update 
    const findUserAndUpdate = await User.findByIdAndDelete( _id );
    if(!findUserAndUpdate) return next (new Error("faild delete please try agein", { cause: 404 }))
    return res.status(200).json({message: "deleted Done"})
    }
}


//==================  get user date ===========
export const getUserData = async (req, res, next) => {
    const { returnPassword } = req.body 
    const { _id } = req.authUser

    // get password only woith writing in body returnPassword
    if(returnPassword){ 
    const pass = await User.findById(_id,"password")
    res.status(200).json({message: "dont share your password",pass })
    }

    // find user by id and update 
    const findUser = await User.findById(
    _id ,
    " username email mobileNumber address age -_id"
    );
    if(!findUser) return next (new Error("faild get error", { cause: 404 }))
    return res.status(200).json({message: "the data", findUser})
}




// ============= forget password =========================
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return next(new Error('not found email', { cause: 401 }))

    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const nanoid = customAlphabet(alphabet, 10);
    const code = nanoid()
    console.log("aldjas",code)
    
    const hashCode = bcrypt.hashSync(code, +process.env.SALT_ROUNDS)
    const token = nanoid(email)
    const resetPasswordLink = `${req.protocol}://${req.headers.host}/auth/reset${token}`
    const isEmailSent = await sendEmailService({
        to: email,
        subject: 'reset password',
        message: `<h2>please click on this link to reset your password</h2>
                    <a href="${resetPasswordLink}">reset password</a>`
    })
    if(!isEmailSent) {
        return next(new Error('email not sent', { cause: 400 }))
    }
    const userUpdate = await User.findOneAndUpdate({ email }, { forgetCode: hashCode }, { new: true })

    return res.status(200).json({ message: 'show your email', success: true , userUpdate})
}


// ====================== reset password =================
export const resetPassword = async (req, res, next) => {
    const { token } = req.params
    const { password } = req.body
    const decodedData = Jwt.verify(token, process.env.JWT_SECRET_RESET)
    const user = await User.findOne({ email: decodedData.email })
    if (!user) return next(new Error('not found email', { cause: 401 }))
    const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
}



