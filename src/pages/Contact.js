import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    // Directly using the EmailJS IDs
    emailjs.send(
      'service_mhuul7z', // Service ID
      'template_wh81xbs', // Template ID
      templateParams,
      '3h9Mufs1YyF7UAsN-' // User ID
    )
    .then(response => {
      console.log('SUCCESS!', response.status, response.text);
      setSnackbarMsg('Your message has been sent successfully!');
      setOpenSnackbar(true);
      setName('');
      setEmail('');
      setMessage('');
    }, error => {
      console.error('EmailJS Error:', error);
      setSnackbarMsg(`Failed to send your message: ${error.text}`);
      setOpenSnackbar(true);
    });
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Contact Us
      </Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Message"
          multiline
          rows={4}
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Send Message
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMsg}
      />
    </Container>
  );
};

export default Contact;
