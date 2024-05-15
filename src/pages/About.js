// About.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to Gold's Gym, where we are dedicated to helping you reach your fitness goals.
        Our team of expert trainers and state-of-the-art facilities are here to support your journey
        towards a healthier lifestyle. Join us and become a part of a community that celebrates
        strength, dedication, and passion for fitness.
      </Typography>
      {/* Add more content here */}
    </Container>
  );
};

export default About;
