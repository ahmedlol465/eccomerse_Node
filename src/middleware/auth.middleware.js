// Importing necessary modules
import jwt from "jsonwebtoken";
import User from "../../DB/models/user.model.js";

// Middleware function for authentication and authorization
export const auth = (accesRoles) => {
    return async (req, res, next) => {
    try {
      // Extracting access token from request headers
        const { accesstoken } = req.headers;

      // Handling missing access token
        if (!accesstoken) {
        return next(new Error("Please login first", { cause: 400 }));
        }

      // Checking the validity of the access token format
        if (!accesstoken.startsWith(process.env.TOKEN_PREFIX)) {
          return next(new Error("Invalid access token", { cause: 400 }));
        }

      // Extracting token without the prefix
        const token = accesstoken.split(process.env.TOKEN_PREFIX)[1];

        // console.log(token)
      // Verifying the decoded token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_LOGIN);
// console.log(decoded);
      // Handling invalid or missing user ID in the decoded token
        if (!decoded || !decoded.id) {
        return next(new Error("Please sign up first", { cause: 404 }));
        }

      // Retrieving user information from the database
        const findUser = await User.findById(
        decoded.id,
        "email username role"
        );

      // Handling missing user in the database
        if (!findUser) {
        return next(new Error("Please sign up first", { cause: 404 }));
        }

      // Authorization check based on user roles
        if (!accesRoles.includes(findUser.role)) {
        return next(new Error("You are not authorized", { cause: 401 }));
        }

      // Adding authenticated user information to the request object
        req.authUser = findUser;
      // Passing control to the next middleware or route handler
        next();
    } catch (error) {
      // Handling errors and passing to the error handler
        console.error("Error in auth middleware:", error);
        if(error == 'TokenExpiredError: jwt expired') {

          const { accesstoken } = req.headers;

          const token = accesstoken.split(process.env.TOKEN_PREFIX)[1];

          
          const findUser = await User.findOne({token})
          if(!findUser) return next(new Error("wrong token", { cause: 404 }));
          
          const userToken = jwt.sign({id: findUser._id, isloggedIn: true}, process.env.JWT_SECRET_VERIFICATION, { expiresIn: '1d' })

          findUser.token = userToken
          await findUser.save()
          res.status(200).json({message: 'refreshed Token', userToken})


        }

          return next(new Error("Error in auth middleware", { cause: 500 }, error));
    }
};
};
