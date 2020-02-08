const app = require('./app');
const admin = require('firebase-admin');
var firebase = require("firebase/app");




var serviceAccount = require("../serviceAccountKey.json");

/*admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mygalery-74523.firebaseio.com"
});*/
const ref = admin.database().ref('images');

var pushMensaje = ref.push();
//pushMensaje.set({
//    name: 'img_6.jpg',
//    url: 'gs://mygalery-74523.appspot.com/images/people-having-a-good-time-3619839.jpg',
//})

console.log(pushMensaje.key);



app.listen(app.get('puerto'));
console.log('server on port ', app.get('puerto'));