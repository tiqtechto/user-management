const checkAuthorization = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
  
    // Check if the request has a Bearer Token
    if (typeof bearerHeader !== 'undefined') {
      // Extract the token from the Authorization header
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      if(bearerToken !== process.env.BEARER_KEY){
        return res.status(403).json({ msg: 'Unauthorized' });
      } else {
        next();
      }
      
    } else {
      // Check if the request comes from your app (e.g., check origin)
      const requestOrigin = req.get('Origin');
      const allowedOrigins = ['http://localhost:3000', 'https://yourappdomain.com'];
  
      if (allowedOrigins.includes(requestOrigin)) {
        next();
      } else {
        return res.status(403).json({ msg: 'Unauthorized' });
      }
    }
  };

  module.exports = checkAuthorization;