const firebase = require('./firebase');

const authenticate = (req, res, next) => {
  let token = req.query.token;

  if (token) {
    firebase
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        //id user: decodedToken.sub;
        next();
      })
      .catch(function(err) {
        res.status(401).json({
          msg: 'invalid token'
        });
      });
  } else {
    res.status(401).json({
      msg: 'no token'
    })
  }
};

module.exports = authenticate;
