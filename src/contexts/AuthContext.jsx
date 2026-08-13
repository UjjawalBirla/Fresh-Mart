import { createContext, useContext, useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../Firebase/Firebase";

/* =========================================================
   AUTH CONTEXT
========================================================= */

const AuthContext = createContext();

/* =========================================================
   AUTH PROVIDER
========================================================= */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState("");

  /* =======================================================
     LOAD AUTH USER
  ======================================================= */

  useEffect(() => {
    let unsubscribe;

    const initializeAuth = async () => {
      try {
        /* -----------------------------------------------
           SESSION ONLY FOR CURRENT BROWSER TAB
        ------------------------------------------------ */

        await setPersistence(auth, browserSessionPersistence);

        /* -----------------------------------------------
           FIREBASE AUTH STATE
        ------------------------------------------------ */

        unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser) => {
            if (!firebaseUser) {
              setUser(null);

              setLoading(false);

              return;
            }

            try {
              /* -----------------------------------------
                 GET FIRESTORE USER
              ----------------------------------------- */

              const userRef = doc(db, "users", firebaseUser.uid);

              const userSnapshot = await getDoc(userRef);

              let userData = {};

              if (userSnapshot.exists()) {
                userData = userSnapshot.data();
              }

              /* -----------------------------------------
                 COMPLETE USER OBJECT
              ----------------------------------------- */

              const completeUser = {
                uid: firebaseUser.uid,

                email: firebaseUser.email,

                displayName:
                  firebaseUser.displayName ||
                  userData.displayName ||
                  userData.name ||
                  "User",

                name: userData.name || firebaseUser.displayName || "User",

                role: userData.role || "user",
              };

              console.log("AUTH USER:", completeUser.email);

              console.log("AUTH ROLE:", completeUser.role);

              setUser(completeUser);
            } catch (error) {
              console.error("User profile error:", error);

              setUser({
                uid: firebaseUser.uid,

                email: firebaseUser.email,

                displayName: firebaseUser.displayName || "User",

                name: firebaseUser.displayName || "User",

                role: "user",
              });
            } finally {
              setLoading(false);
            }
          },

          (error) => {
            console.error("Firebase Auth Error:", error);

            setUser(null);

            setLoading(false);
          },
        );
      } catch (error) {
        console.error("Auth initialization error:", error);

        setUser(null);

        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /* =======================================================
     SIGN UP
  ======================================================= */

  const signup = async (name, email, password) => {
    setAuthError("");

    try {
      /* -----------------------------------------------
         CURRENT TAB SESSION
      ------------------------------------------------ */

      await setPersistence(auth, browserSessionPersistence);

      /* -----------------------------------------------
         CREATE FIREBASE ACCOUNT
      ------------------------------------------------ */

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const firebaseUser = userCredential.user;

      /* -----------------------------------------------
         UPDATE FIREBASE DISPLAY NAME
      ------------------------------------------------ */

      await updateProfile(firebaseUser, {
        displayName: name.trim(),
      });

      /* -----------------------------------------------
         CREATE FIRESTORE USER
      ------------------------------------------------ */

      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,

        name: name.trim(),

        displayName: name.trim(),

        email: email.trim(),

        role: "user",

        createdAt: new Date(),
      });

      /* -----------------------------------------------
         LOCAL USER STATE
      ------------------------------------------------ */

      const newUser = {
        uid: firebaseUser.uid,

        email: firebaseUser.email,

        name: name.trim(),

        displayName: name.trim(),

        role: "user",
      };

      setUser(newUser);

      return {
        success: true,

        user: newUser,
      };
    } catch (error) {
      console.error("Signup Error:", error);

      let message = "Unable to create account.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "An account already exists with this email.";

          break;

        case "auth/invalid-email":
          message = "Please enter a valid email address.";

          break;

        case "auth/weak-password":
          message = "Password should be at least 6 characters.";

          break;

        case "auth/operation-not-allowed":
          message = "Email/password authentication is not enabled.";

          break;

        default:
          message = "Unable to create account. Please try again.";
      }

      setAuthError(message);

      return {
        success: false,

        error: message,
      };
    }
  };

  /* =======================================================
     LOGIN
  ======================================================= */

  const login = async (email, password) => {
    setAuthError("");

    try {
      /* -----------------------------------------------
         CURRENT TAB ONLY
      ------------------------------------------------ */

      await setPersistence(auth, browserSessionPersistence);

      /* -----------------------------------------------
         LOGIN
      ------------------------------------------------ */

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const firebaseUser = userCredential.user;

      /* -----------------------------------------------
         GET FIRESTORE USER
      ------------------------------------------------ */

      const userRef = doc(db, "users", firebaseUser.uid);

      const userSnapshot = await getDoc(userRef);

      let userData = {};

      if (userSnapshot.exists()) {
        userData = userSnapshot.data();
      }

      /* -----------------------------------------------
         COMPLETE USER
      ------------------------------------------------ */

      const loggedInUser = {
        uid: firebaseUser.uid,

        email: firebaseUser.email,

        name: userData.name || firebaseUser.displayName || "User",

        displayName: userData.displayName || firebaseUser.displayName || "User",

        role: userData.role || "user",
      };

      console.log("LOGIN USER:", loggedInUser.email);

      console.log("LOGIN ROLE:", loggedInUser.role);

      setUser(loggedInUser);

      return {
        success: true,

        user: loggedInUser,
      };
    } catch (error) {
      console.error("Login Error:", error);

      let message = "Unable to login. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "Please enter a valid email address.";

          break;

        case "auth/user-not-found":
          message = "No account found with this email.";

          break;

        case "auth/wrong-password":

        case "auth/invalid-credential":
          message = "Incorrect email or password.";

          break;

        case "auth/user-disabled":
          message = "This account has been disabled.";

          break;

        case "auth/too-many-requests":
          message = "Too many login attempts. Please try again later.";

          break;

        default:
          message = "Unable to login. Please try again.";
      }

      setAuthError(message);

      return {
        success: false,

        error: message,
      };
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = async () => {
    setAuthError("");

    try {
      await signOut(auth);

      setUser(null);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Logout Error:", error);

      const message = "Unable to logout.";

      setAuthError(message);

      return {
        success: false,

        error: message,
      };
    }
  };

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    user,

    loading,

    authError,

    signup,

    login,

    logout,

    isLoggedIn: !!user,
  };

  /* =======================================================
     PROVIDER
  ======================================================= */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* =========================================================
   USE AUTH
========================================================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthContext;
