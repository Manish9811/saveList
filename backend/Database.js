const admin = require('firebase-admin');
const serviveAccount = require('./Servive.json');

admin.initializeApp({
    credential: admin.credential.cert(serviveAccount),
    databaseURL: "https://chatapp-1ef04-default-rtdb.firebaseio.com/"
})

const database = admin.database();
module.exports = database;