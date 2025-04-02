// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
// // Function to send OTP (Email Link)
// export const sendVerificationEmail = async (email) => {
//   const actionCodeSettings = {
//     url: "http://10.5.218.158:5173//forgot-password", // Redirect URL after email verification
//     handleCodeInApp: true,
//   };

//   try {
//     await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//     window.localStorage.setItem("emailForSignIn", email); // Store email in localStorage
//     alert("Verification link sent to your email.");
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//     throw error;
//   }
// };

// Function to verify OTP (Email Link)
// export const verifyEmail = async (email, otp) => {
//   try {
//     if (isSignInWithEmailLink(auth, window.location.href)) {
//       const storedEmail =
//         window.localStorage.getItem("emailForSignIn") || email;
//       if (!storedEmail) throw new Error("No email found. Try again.");

//       const result = await signInWithEmailLink(
//         auth,
//         storedEmail,
//         window.location.href
//       );
//       window.localStorage.removeItem("emailForSignIn"); // Clean up storage
//       return result.user;
//     } else {
//       throw new Error("Invalid verification link.");
//     }
//   } catch (error) {
//     console.error("Email verification error:", error);
//     throw error;
//   }
// };

export { auth, db, analytics, setDoc, doc, storage };
