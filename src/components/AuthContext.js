import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase'; // Ensure this import is correct

export const AuthContext = createContext({
  currentUser: null,
  isUserAdmin: false, // Include admin check flag
  setCurrentUser: () => {}
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false); // State to track if the user is an admin

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Check if the logged-in user is an admin
      setIsUserAdmin(user ? user.email === 'admin@admin.admin' : false);
    });
    return unsubscribe; // This function will be called on component unmount
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isUserAdmin, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export a hook to use the auth context
export const useAuth = () => useContext(AuthContext);
