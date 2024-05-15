import React, {useState} from 'react';
import { TextField, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../Firebase'; // Adjust the path to your firebase config file, if necessary
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignUp = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const confirmPassword = event.target.elements.confirmPassword.value;

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // User successfully signed up
      console.log("User created and signed in:", userCredential.user);
      setSnackbarMessage("User created successfully. Please complete your profile.");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Wait a moment before navigating to give any global state updates time to process
      setTimeout(() => navigate('/profilesetup'), 500); // Adjust timing if necessary
    } catch (error) {
      console.error("Sign up failed:", error);
  
      let errorMessage = "Sign up failed: " + error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "The email address is already in use by another account.";
      }else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is formatted incorrectly.";
      }
  
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (<>
    <form onSubmit={handleSubmit}>
      {/* Removed the username field as it's not used in the auth process */}
      <TextField name="email" label="Email" type="email" required />
      <TextField name="password" label="Password" type="password" required />
      <TextField name="confirmPassword" label="Confirm Password" type="password" required />
      <Button type="submit" variant="contained" color="primary">Sign Up</Button>
    </form>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignUp;
