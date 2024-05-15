import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './Firebase'; // Adjust the path to your Firebase config
import { getDatabase, ref, get } from 'firebase/database';

import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NutritionMenu from "./components/NutritionMenu";
import ProfilePage from './components/ProfilePage';
import FitnessLogin from './pages/Fitnesslogin';
import About from './pages/About';
import Contact from './pages/Contact';
import UserProfileForm from './components/UserProfileForm';
import ProtectedRoute from './ProtectedRoute'; // Make sure this path is correct
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
console.log("Routes setup: ", AdminLogin, AdminDashboard, Home);
// Update the context to include user object and a method to update it
export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
  hasCompletedProfile: false,
  setHasCompletedProfile: () => {}
});

// Implement this function based on your Firebase data structure
const fetchProfileCompletionStatus = async (user) => {
  const db = getDatabase();
  const userRef = ref(db, 'users/' + user.uid);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      // Check if the required fields are present and not empty
      const isProfileComplete = userData.dietOption && userData.gender && userData.goal && userData.height && userData.weight;
      return isProfileComplete;
    } else {
      console.log("No data available for user.");
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  // Inside your useEffect hook in the App component
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      console.log("onAuthStateChanged: Logged in user:", currentUser);
      setUser(currentUser);

      fetchProfileCompletionStatus(currentUser).then(isComplete => {
        setHasCompletedProfile(isComplete);
      }).catch(error => {
        console.error("Failed to fetch profile status:", error);
        setHasCompletedProfile(false);
      });

    } else {
      console.log("onAuthStateChanged: No user logged in");
      setUser(null);
      setHasCompletedProfile(false);
    }
  });

  return () => {
    unsubscribe(); // Cleanup subscription on component unmount
  };
}, []);


  // Derived state for isLoggedIn to simplify context value
  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, hasCompletedProfile, setHasCompletedProfile }}>
      <Box width="400px" sx={{ width: { xl: '1488px' } }} m="auto">
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate replace to="/fitnesslogin" />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/nutrition" element={<ProtectedRoute><NutritionMenu /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/fitnesslogin" element={isLoggedIn ? <Navigate replace to="/" /> : <FitnessLogin />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/complete-profile" element={isLoggedIn ? <UserProfileForm /> : <Navigate replace to="/fitnesslogin" />} />
          <Route path="/profilesetup" element={isLoggedIn ? <Navigate replace to="/complete-profile" /> : <Navigate replace to="/fitnesslogin" />} />
        </Routes>
        <Footer />
      </Box>
    </AuthContext.Provider>
  );
};

export default App;
