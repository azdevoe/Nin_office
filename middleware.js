const protectedRoute = (req, res, next) => {
  console.log('protectedRoute middleware called');
  next();
};
module.exports = {protectedRoute};
