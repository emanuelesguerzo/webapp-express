const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
  
    return res.status(statusCode).json({
      status: "fail",
      message: statusCode === 404 ? "Movie Not Found" : err.message,
    });
    
  };
  
  module.exports = errorHandler;