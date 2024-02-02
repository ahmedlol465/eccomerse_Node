import bcrypt from 'bcrypt'
import Jwt  from 'jsonwebtoken';
import User from "../../../DB/moduls/user.model.js";
import sendEmailService from "../services/send-email.service.js"


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
    const userToken = Jwt.sign({email}, process.env.JWT_SECRET_VERIFICATION, { expiresIn: '30s' })

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
await user.save()

res.status(200).json({
    success: true,
    message: 'user logged in successfuly',
    data: {
        token
    }
})

}