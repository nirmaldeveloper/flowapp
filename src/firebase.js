
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyA3UJiIY96bFyKqyeFw2XcOiyNlB4cmolQ",
  authDomain: "reacttest432.firebaseapp.com",
  databaseURL: "https://reacttest432.firebaseio.com",
  projectId: "reacttest432",
  storageBucket: "reacttest432.appspot.com/",
  messagingSenderId: "1046292441655"
};
firebase.initializeApp(config);

export default firebase;
