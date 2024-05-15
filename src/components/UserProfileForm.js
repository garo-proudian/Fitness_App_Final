import React, { useState,useEffect, useContext } from 'react';
import { Box, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper, Container,Typography,Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ref, set } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../Firebase'; // Adjust this import path if necessary
import { AuthContext } from '../App'; // Import the AuthContext

const activityFactors = {
  'Sedentary': 1.2,
  'Lightly active': 1.375,
  'Moderately active': 1.55,
  'Very active': 1.725,
  'Extra active': 1.9
};

const UserProfileForm = () => {
  const { user, setHasCompletedProfile } = useContext(AuthContext);
  console.log("Logged in user:", user);
  const navigate = useNavigate();

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [PhysicalActivityLevel, setPhysicalActivityLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [calorieNeeds, setCalorieNeeds] = useState(null);
  const [dietOption, setDietOption] = useState('');
  const [calorieCalculationDialogOpen, setCalorieCalculationDialogOpen] = useState(false);
  const [bmr, setBmr] = useState(null);
  const [palFactor, setPalFactor] = useState(null);

  const handleCalorieCalculationClick = () => {
    setCalorieCalculationDialogOpen(true);
  };
  
  const handleCloseCalorieCalculationDialog = () => {
    setCalorieCalculationDialogOpen(false);
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else if (gender === 'female') {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    return 0; // Default return value in case gender isn't correctly specified
  };

  const adjustForPAL = (bmr, PhysicalActivityLevel) => {
    return bmr * (activityFactors[PhysicalActivityLevel] || 1); // Default to 1 if PAL isn't matched
  };

  const calculateCalories = (goal, adjustedBMR) => {
    switch (goal) {
      case 'lose':
        // Assuming a deficit of 500 calories for weight loss
        return Math.max(1200, adjustedBMR - 500); // Ensuring not to go below 1200 calories
      case 'gain':
        // Assuming a surplus of 500 calories for weight gain
        return adjustedBMR + 500;
      case 'maintain':
        // No adjustment needed for maintenance
        return adjustedBMR;
      default:
        return adjustedBMR; // Default case to handle unexpected inputs
    }
  };


  useEffect(() => {
    if (weight && height && age && gender && PhysicalActivityLevel && goal) {
      const calculatedBMR = calculateBMR(parseInt(weight), parseInt(height), parseInt(age), gender);
      const activityFactor = activityFactors[PhysicalActivityLevel] || 1;
      const adjustedBMR = calculatedBMR * activityFactor;
      const dailyCalories = calculateCalories(goal, adjustedBMR);
      setCalorieNeeds(dailyCalories);
      setBmr(calculatedBMR); // Set BMR for the dialog
      setPalFactor(activityFactor); // Set PAL factor for the dialog
    } else {
      setCalorieNeeds(null);
      setBmr(null); // Reset BMR when inputs are incomplete
      setPalFactor(null); // Reset PAL factor when inputs are incomplete
    }
  }, [weight, height, age, gender, PhysicalActivityLevel, goal]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting form", { age, height, weight,gender,PhysicalActivityLevel, goal });
    if (!user) {
      console.log("No user logged in");
      return; // Make sure the user is logged in
    } // Make sure the user is logged in

    // Ensure calorie needs are calculated before proceeding
  if (calorieNeeds === null) {
    alert("Please complete all fields to calculate your daily calorie needs.");
    return;
  }

    try {
    // Save the profile information to Firebase under the users collection
    await set(ref(database, `users/${user.uid}`), {
      age,
      height,
      weight,
      gender,
      PhysicalActivityLevel,
      goal,
      dietOption,
      calorieNeeds: Math.round(calorieNeeds),
    });
    console.log("Profile and calorie needs saved");
    // Update the profile completion state in AuthContext
    if(setHasCompletedProfile){
    setHasCompletedProfile(true); // Ensure this method exists and correctly updates the context
  }
    navigate('/nutrition'); // Navigate to the nutrition page
  }catch (error) {
    console.error("Failed to save profile", error);
    alert("Failed to save profile: " + error.message);
  }
  };

  return (
    <Container component={Paper} elevation={6} sx={{ p: 4, mt: 4, borderRadius: '15px', maxWidth: '500px', mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          fullWidth
          variant="outlined"
        />
        <FormControl component="fieldset" required>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="female" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" required>
          <FormLabel component="legend">How often do you exercise?</FormLabel>
          <RadioGroup row value={PhysicalActivityLevel} onChange={(e) => setPhysicalActivityLevel(e.target.value)}>
            <FormControlLabel value="Sedentary" control={<Radio />} label="Sedentary (little or no exercise)" /><br/>
            <FormControlLabel value="Lightly active" control={<Radio />} label="Lightly active (light exercise/sports 1-3 days/week)" /><br/>
            <FormControlLabel value="Moderately active" control={<Radio />} label="Moderately active (moderate exercise/sports 3-5 days/week)" /><br/>
            <FormControlLabel value="Very active" control={<Radio />} label="Very active (hard exercise/sports 6-7 days a week)" /><br/>
            <FormControlLabel value="Extra active" control={<Radio />} label="Extra active (very hard exercise/sports & physical job or 2x training)" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" required>
          <FormLabel component="legend">Diet Option</FormLabel>
          <RadioGroup row value={dietOption} onChange={(e) => setDietOption(e.target.value)}>
            <FormControlLabel value="Omnivore" control={<Radio />} label="Omnivore" />
            <FormControlLabel value="Vegetarian" control={<Radio />} label="Vegetarian" />
            <FormControlLabel value="Keto" control={<Radio />} label="Keto" />
            <FormControlLabel value="Pescatarian" control={<Radio />} label="Pescatarian" />
        </RadioGroup>
      </FormControl>

        <FormControl component="fieldset" required>
          <FormLabel component="legend">Goal</FormLabel>
          <RadioGroup row value={goal} onChange={(e) => setGoal(e.target.value)}>
            <FormControlLabel value="gain" control={<Radio />} label="Gain Weight" />
            <FormControlLabel value="maintain" control={<Radio />} label="maintain Weight" />
            <FormControlLabel value="lose" control={<Radio />} label="Lose Weight" />
          </RadioGroup>
        </FormControl>

        {calorieNeeds && (
      <>
        <Typography sx={{ mt: 2 }}>
          Based on the information provided, your daily calorie needs are approximately: {calorieNeeds.toFixed(0)} calories.
        </Typography>
        <Button onClick={handleCalorieCalculationClick} size="small">
          How is this calculated?
        </Button>
      </>
    )}
    {/* Dialog for displaying the calorie calculation breakdown */}
    <Dialog open={calorieCalculationDialogOpen} onClose={handleCloseCalorieCalculationDialog}>
      <DialogTitle>Calorie Calculation Breakdown</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your Basal Metabolic Rate (BMR) is the amount of energy expended while at rest. It is calculated based on your weight, height, age, and gender. 
          Physical Activity Level (PAL) is a way to express your daily physical activity.
          <ul>
            {bmr && <li>BMR: {bmr.toFixed(0)} calories</li>}
            {palFactor && <li>PAL Factor: {palFactor}</li>}
            {calorieNeeds && <li>Total Calorie Needs: {calorieNeeds.toFixed(0)} calories</li>}
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCalorieCalculationDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
        


        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Profile
        </Button>
      </Box>
    </Container>
  );
};

export default UserProfileForm;
