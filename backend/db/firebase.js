// db/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
});

// Correctly export the db object
const db = admin.firestore();
module.exports = { db }; // Wrap db in an object

