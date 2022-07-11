
import firebase from "firebase";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'


const firebaseConfig = {
    apiKey: "AIzaSyBScj96aTnO7vjX_eNzjyau-ephiVidtTo",
    authDomain: "chat-app-ef034.firebaseapp.com",
    projectId: "chat-app-ef034",
    storageBucket: "chat-app-ef034.appspot.com",
    messagingSenderId: "571417189977",
    appId: "1:571417189977:web:5dc373f4cae9d2db5f5b48",
    measurementId: "G-M7LN6CNS7R"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig)
firebase.analytics()

const db = firebase.firestore()
const auth = firebase.auth()

auth.useEmulator('http://localhost:9099');
if (window.location.hostname === 'localhost'){
    db.useEmulator('localhost','8080');
}

export {db, auth}
export default firebase