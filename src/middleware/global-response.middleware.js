// Global error response middleware
export const globalResponse = (err, req, res, next) => {
  // Check if an error is present
  if (err) {
    console.log(err);
    // Respond with the appropriate status code and error details
    res.status(err["cause"] || 500).json({
      message: "catch Error",
      errorMEssage: err.message,
      errorLocation: err.stack,
    });
    next();
  }
};

// make two logical function to roleBack with saving document and uploading on cloudnary
