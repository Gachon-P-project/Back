const dotenv = require('dotenv').config();

const admin = require("firebase-admin");

const serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const registrationToken = process.env.token;
const payload = {
    notification: {
        title: "제목",
        body: "내용"
    }
}

admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    console.log("Successfully sent with response: ", response); 
  })
  .catch(function(error) {
      console.log("Error sending message: ", error);
  })