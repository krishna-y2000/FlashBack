const jwt = require('jsonwebtoken');

const authSend = function(req,res,next){
  //const token = req.cookies.token;
  const token = req.cookies.token;
  console.log("Token" , req.cookies.token);
    if(!token)
    {
      console.log("No token");
       return next();
    }
    console.log("Got token");

    jwt.verify(token, "randomString", (err, payload) => {
  
      if (err || !payload) {
        return next();
      }
         req.user = payload.user;
        // console.log("reqUser" , req.user);
        next();
      });
}


module.exports = authSend;