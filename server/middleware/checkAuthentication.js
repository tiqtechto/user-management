const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuthentication = async (req, res, next) => {
   let token;
   if(typeof req.body != 'undefined' && Object.entries(req.body).length != 0){
      token = req.body.token;
   } else {
      token = req.params.token;
   }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ id: decoded.userId, 'token': token });
        
        if (!user) {
           return res.status(500).send({ msg: 'No user found!' });
        }

        // Check if the token is expired
        const isTokenExpired = decoded.exp < Date.now() / 1000;
        if (isTokenExpired) {
           return res.status(401).send({ msg: 'Login expired!' });
        }

        // Attach user and token to the request for further processing
        req.user = {};
        req.user.id = user._id;
        req.user.UserName = user.UserName;
        req.user.Role = user.Role;
        req.user.verified = user.verified;
        req.token = token; 
        next();
    } catch (error) {
       return res.status(403).send({ msg: error.message || 'Please authenticate' });
    }
    
};

module.exports = checkAuthentication;