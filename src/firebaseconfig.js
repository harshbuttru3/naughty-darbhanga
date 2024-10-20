import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc } from 'firebase/firestore';
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7rUjOBZ1CY5-NRtvFiIyHIJClxh9kVwc",
  authDomain: "naughty-darbhanga.firebaseapp.com",
  projectId: "naughty-darbhanga",
  storageBucket: "naughty-darbhanga.appspot.com",
  messagingSenderId: "201108044104",
  appId: "1:201108044104:web:1a6023809412911aaa5b7d",
  measurementId: "G-DRRL6NRH23",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

// Function to sign in as guest
export const signInAsGuest = async (name, gender) => {
  try {
    // Sign in anonymously first
    const { user } = await signInAnonymously(auth);

    // Construct the guest username based on the provided name
    const guestName = name ? `guest-${name}` : "guest-anonymous";

    // Set the avatar URL based on gender
    const avatarUrl = gender === "female" ? "/female.png" : "/male.png";
    const userDoc = doc(db, "onlineMembers", user.uid);
    await setDoc(userDoc, {
      displayName: guestName,
      avatar: avatarUrl,
    });
    // Update the user profile with the guest username and avatar
    await updateProfile(user, {
      displayName: guestName,
      photoURL: avatarUrl,
    });

    console.log(guestName); // Log the correct guest name

    return user;
  } catch (error) {
    console.error("Error signing in as guest:", error);
    throw error;
  }
};

export { auth, db, googleProvider };
