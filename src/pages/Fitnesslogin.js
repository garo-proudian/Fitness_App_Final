import React, { useState } from 'react';
import Login from '../components/loginvalidation/Login'; // Assumes you have a Login component
import SignUp from '../components/loginvalidation/SignUp'; // Assumes you have a SignUp component
import {TextField,Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Paper,Snackbar } from '@mui/material';
import backgroundImage from '../assets/images/backgroundeimage.webp'; // Ensure this is the correct path to your image file
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../Firebase';

const FitnessLogin = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');

  const handleOpenResetDialog = () => {
    setDialogOpen(true);
  };

  const handleSendResetEmail = async () => {
    if (emailForReset) {
      try {
        await sendPasswordResetEmail(auth, emailForReset);
        setSnackbarMessage("Password reset email sent. Please check your inbox.");
        setDialogOpen(false);
      } catch (error) {
        setSnackbarMessage("Failed to send password reset email. Please make sure the email is correct.");
      }
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please enter an email address.");
      setSnackbarOpen(true);
    }
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your email address:");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        setSnackbarMessage("Password reset email sent. Please check your inbox.");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error sending password reset email: ", error);
        setSnackbarMessage("Failed to send password reset email. Please make sure the email is correct.");
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const defaultButtonStyles = () => ({
    backgroundColor: '#1976d2',
    color: 'white',
  });

  return (
    <Box
      sx={{
        overflowX: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        width: '100%',
        pt: '20vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          mt: '20vh',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '10px',
        }}
      >
        <Typography variant="h2" sx={{ color: 'primary.main', mb: 4, textAlign: 'center' }}>
          {showLogin ? 'Welcome Back, Warrior!' : 'Join Our Fitness Legion!'}
        </Typography>

        {showLogin ? <Login /> : <SignUp />}

        <Button
          sx={defaultButtonStyles()} 
          variant="contained"
          onClick={() => setShowLogin(!showLogin)}
        >
          {showLogin ? 'Need to create an account?' : 'Already have an account? Log in!'}
        </Button>
        {showLogin && (
          <Button
            sx={defaultButtonStyles()}
            variant="contained"
            onClick={handleOpenResetDialog}
          >
            Forgot Password?
          </Button>
        )}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={emailForReset}
            onChange={(e) => setEmailForReset(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSendResetEmail}>Send</Button>
        </DialogActions>
      </Dialog>
      </Paper>

      <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      message={snackbarMessage}
    />

    </Box>
  );
};

export default FitnessLogin;