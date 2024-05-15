import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, Snackbar } from '@mui/material';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../Firebase'; // Adjust the path to your firebase config file
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const defaultButtonStyles = () => ({
    backgroundColor: '#FFB6B2',
    backgroundColor: '#1976d2', // Note: backgroundColor is duplicated. You should resolve this.
    color: 'white',
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = email === 'admin@admin.admin'; // Check if the logged in user is an admin
      setSnackbarMessage(isAdmin ? "Admin logged in" : "User logged in");
      setSnackbarOpen(true);
      navigate(isAdmin ? '/admin-dashboard' : '/'); // Navigate to the admin dashboard if admin, otherwise home page
    } catch (error) {
      console.log(error.code); // Log the error code to the console
      let errorMessage = error.message; // Use Firebase's default error message or create custom messages

      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        fullWidth
        margin="normal"
      />
      <TextField
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        required
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={defaultButtonStyles()}
        >
          Login
        </Button>
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </form>
  );
};

export default Login;
