import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stack } from '@mui/material';
import Logo from '../assets/images/Logo.png';
import { AuthContext } from '../App'; // Import the AuthContext

const Navbar = () => {
  
  const { isLoggedIn, hasCompletedProfile } = useContext(AuthContext); // Destructure new state variable from context
  const location = useLocation();

  // Determine whether to show logged-in links based on isLoggedIn and hasCompletedProfile
  const shouldDisplayLoggedInLinks = isLoggedIn && hasCompletedProfile;

  // Links for logged in users
  const loggedInLinks = (
    <Stack
      direction="row"
      gap="40px"
      fontFamily="Alegreya"
      fontSize="24px"
      alignItems="flex-end"
    >
      <Link to="/" style={{ textDecoration: 'none', color: '#3A1212', borderBottom: location.pathname === "/" ? '3px solid #FF2625' : 'none' }}>Home</Link>
      <Link to="/nutrition" style={{ textDecoration: 'none', color: '#3A1212', borderBottom: location.pathname === "/nutrition" ? '3px solid #FF2625' : 'none' }}>Nutrition</Link>
      {/* Conditionally render the Exercises link unless the user is on the profile page */}
      {location.pathname !== "/profile" && location.pathname !== "#exercises" && location.pathname !== "/nutrition" && <a href="#exercises" style={{ textDecoration: 'none', color: '#3A1212' }}>Exercises</a>}
    </Stack>
  );

  // Links for users who are not logged in
  const loggedOutLinks = (
    <Stack
      direction="row"
      gap="40px"
      fontFamily="Alegreya"
      fontSize="24px"
      alignItems="flex-end"
    >
      <Link to="/fitnesslogin" style={{ textDecoration: 'none', color: '#3A1212', borderBottom: location.pathname === "/fitnesslogin" ? '3px solid #FF2625' : 'none' }}>Home</Link>
      <Link to="/about" style={{ textDecoration: 'none', color: '#3A1212', borderBottom: location.pathname === "/about" ? '3px solid #FF2625' : 'none' }}>About Us</Link>
      <Link to="/contact" style={{ textDecoration: 'none', color: '#3A1212', borderBottom: location.pathname === "/contact" ? '3px solid #FF2625' : 'none' }}>Contact Us</Link>
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent="space-around" sx={{ gap: { sm: '123px', xs: '40px' }, mt: { sm: '32px', xs: '20px' }, justifyContent: 'none' }} px="20px">
      <Link to="/">
        <img src={Logo} alt="logo" style={{ width: '100px', height: '100px', margin: '0 20px' }} />
      </Link>
      {shouldDisplayLoggedInLinks ? loggedInLinks : loggedOutLinks}
    </Stack>
  );
};

export default Navbar;
