export const errors = (error, req, res , next) => {

  if(!error.statusCode) {
    error.statusCode = 500;
  }
  if(!error.message) {
    error.message = 'An error occured';
  }
  res.status(error.statusCode).json({
    message: error.message,
  })
  next();
  
};