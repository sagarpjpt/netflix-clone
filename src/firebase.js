// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWE32GGp7PPexhF3pWAOxCpCoXdz9_IEU",
  authDomain: "netflix-clone-f8f15.firebaseapp.com",
  projectId: "netflix-clone-f8f15",
  storageBucket: "netflix-clone-f8f15.firebasestorage.app",
  messagingSenderId: "650150087167",
  appId: "1:650150087167:web:ae4d93688a9296355abfca",
  measurementId: "G-YEPCWGDD1S"
};

// Initialize Firebase
console.log("firebase config", firebaseConfig);
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    const user = res.user;

    // add user to db
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (e) {
    console.log("error while signup and storing in DB in firebase", e);
    toast.error(e.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
    toast.error(err.code.split("/")[1].split("-").join(" "));
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, db, login, signup, logout };
