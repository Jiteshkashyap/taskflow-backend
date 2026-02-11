

export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack || err);

  // Joi Validation Error
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: err.details.map((d) => d.message).join(", "),
    });
  }

  // Custom Errors 
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
