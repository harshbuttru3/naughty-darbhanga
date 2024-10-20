import React, { useState } from "react";
import { auth, googleProvider, signInAsGuest } from "./firebaseconfig"; // Ensure `signInAsGuest` is imported correctly
import { signInWithPopup } from "firebase/auth";
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseconfig'; // Make sure to import your Firestore instance

const AuthProvider = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male"); // Default gender

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user.uid, result.user.displayName, gender); // Save user info
    onLogin(result.user);
  };

  const handleGuestLogin = async () => {
    const user = await signInAsGuest(name, gender); // Ensure this handles Firestore saving
    await saveUserToFirestore(user.uid, name, gender); // Save guest user info
    onLogin(user);
  };

  // Function to save user data to Firestore
  const saveUserToFirestore = async (uid, displayName, gender) => {
    try {
      await setDoc(doc(db, "users", uid), {
        displayName,
        gender,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  };

  return (
    <div className="auth-container">
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>
          <input 
            type="radio" 
            value="male" 
            checked={gender === "male"} 
            onChange={() => setGender("male")} 
          />
          Male
        </label>
        <label>
          <input 
            type="radio" 
            value="female" 
            checked={gender === "female"} 
            onChange={() => setGender("female")} 
          />
          Female
        </label>
      </div>
      <button onClick={handleGuestLogin}>Login as Guest</button>
    </div>
  );
};

export default AuthProvider;
