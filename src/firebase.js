import firebase from 'firebase';

 const firebaseApp = firebase.initializeApp({
   apiKey: "AIzaSyAX8vKlvJPnIXt5hh_4YhbZXQydOBtX3BQ",
   authDomain: "instagram-clone-b76b5.firebaseapp.com",
   databaseURL: "https://instagram-clone-b76b5.firebaseio.com",
   projectId: "instagram-clone-b76b5",
   storageBucket: "instagram-clone-b76b5.appspot.com",
   messagingSenderId: "231357958709",
   appId: "1:231357958709:web:fe918f089678081955bf7c",
   measurementId: "G-9T05V90J5M"
 });

 const db = firebaseApp.firestore();
 const auth = firebase.auth();
 const storage = firebase.storage();

 export {db, auth, storage};