const admin   = require("firebase-admin");
var _admin;

function firebaseAdmin() {
    if (!_admin) {
      var serviceAccount = require("../conf/beatmix-fb77a-firebase-adminsdk-9bpcq-0c2ef711d2.json");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://beatmix-fb77a.firebaseio.com"
      });
    }
    return _admin = admin;
}

module.exports = firebaseAdmin();
