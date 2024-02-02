// Array of request keys to validate
const reqKeys = ["query", "body", "params", "headers"];

// Middleware for validating request data against a schema
export const validmiddleware = (schema) => {
    return (req, res, next) => {
    // Array to store validation errors
    let validationErrorsArr = [];

    // Loop through each request key
    for (const key of reqKeys) {
      // Validate the corresponding data in the request against the schema
        const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false,
        });

      // If validation error exists, add it to the array
        if (validationResult?.error) {
        validationErrorsArr.push(...validationResult.error.details);
        }
    }

    // If there are validation errors, respond with error details
    if (validationErrorsArr.length) {
        return res.status(200).json({
        err_msg: "validation error",
        errors: validationErrorsArr.map((ele) => ele.message),
        });
    }

    // If no validation errors, proceed to the next middleware
    next();
    };
};
