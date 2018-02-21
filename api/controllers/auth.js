const firebase = require('../firebase');

const auth = {
  login: (req, res) => {
    //https://github.com/firebase/firebase-admin-node/issues/210
    res.json({
      logged: true;
    });
  },
  logout: (req, res) => {
    res.json({
      logout: true
    });
  },
  signup: (req, res) => {
    firebase
    .auth()
    .createUser({
      email: req.body.email,
      emailVerified: false,
      password: req.body.password,
    })
    .then(function(userRecord) {
      res.json({
        msg: "Successfully created new user",
        id: userRecord.uid
      });
    })
    .catch(function(error) {
      res.json({
        msg: "Error creating new user",
        error: JSON.stringify(error)
      });
    });
  },
  test: (req, res) => {
    res.json({test: 'ttest'});
  }
}

module.exports = auth;
