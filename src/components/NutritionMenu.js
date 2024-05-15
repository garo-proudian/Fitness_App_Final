import React, { useState, useEffect } from 'react';
import FoodCard from './FoodCard';
import NutritionModal from './NutritionModal';
import { Grid, Typography, Button, Snackbar, useTheme, useMediaQuery } from '@mui/material';
import foodItemsData from './FoodItem'; // Make sure this import path matches your data file's location
import ProfileButton from './ProfileButton';
import { get, ref, push } from "firebase/database";
import { auth, database } from '../Firebase';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const NutritionMenu = () => {
  const [foodItems, setFoodItems] = useState(foodItemsData);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showVegetarian, setShowVegetarian] = useState(false); // State for vegetarian filter
  const [showKeto, setShowKeto] = useState(false); // State for Keto filter
  const [showpescatarian, setshowpescatarian] = useState(false);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [userCalorieGoal, setUserCalorieGoal] = useState(null);
  const [showDietOptions, setShowDietOptions] = useState(false);
  const [showBreakfast, setShowBreakfast] = useState(false);
  const [showLunch, setShowLunch] = useState(false);
  const [showDinner, setShowDinner] = useState(false);
  const [showsnak,setShowsnak] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const addAllRecommendedFoodsToProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      setSnackbarMessage('You must be logged in to add foods to your profile.');
      setSnackbarOpen(true);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const dailyIntakeRef = ref(database, `users/${user.uid}/dailyIntake/${today}`);
    recommendedFoods.forEach(async (foodItem) => {
      try {
        await push(dailyIntakeRef, foodItem);
      } catch (error) {
        console.error('Error adding food to profile:', error);
        // In production, you might not want to interrupt this loop but rather collect all errors and report them at the end
      }
    });

    setSnackbarMessage('All recommended foods added to your profile for today!');
    setSnackbarOpen(true);
  };

// Define a function to set the default styles of buttons
const defaultButtonStyles = (isActive) => ({
  backgroundColor: isActive ? '#FFA1A0' : '#66B2B2',
  color: '#fffafb',
  '&:hover': {
    backgroundColor: isActive ? '#FFA1A0' : '#66B2B2',
  },
  width: isSmallScreen ? '100%' : 'auto', // Full width on small screens, auto on larger screens
  mb: isSmallScreen ? 1 : 0, // Margin bottom on small screens
});
  
  const addToProfile = async (foodItem) => {
    const user = auth.currentUser;
    if (!user) {
      setSnackbarMessage('You must be logged in to add foods to your profile.');
      setSnackbarOpen(true);
      return;
    }
  
    const today = new Date().toISOString().split('T')[0];
    const dailyIntakeRef = ref(database, `users/${user.uid}/dailyIntake/${today}`);
    console.log(dailyIntakeRef.toString()); // Check the generated path
    try {
      await push(dailyIntakeRef, foodItem);
      setSnackbarMessage('Food added to your profile for today!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding food to profile:', error);
      setSnackbarMessage('Failed to add food to profile.');
      setSnackbarOpen(true);
    }
  };
  

  const handleShowRecommendedFoods = () => {
    console.log("User Calorie Goal:", userCalorieGoal);
    if (!userCalorieGoal) {
        console.log("No calorie goal found");
        alert("Please complete your profile to see recommended foods.");
        return;
    }
    
    // Apply all active diet filters to the initial list of foods
  const filteredFoods = foodItems.filter(item => {
    if (showVegetarian && !item.vegetarian) return false;
    if (showKeto && !item.keto) return false;
    if (showpescatarian && !item.pescatarian) return false;
    return true;
  });

  // Shuffle and select from filteredFoods for meal types
  const shuffledItemsByType = (type) => filteredFoods.filter(item => item[type]).sort(() => 0.5 - Math.random());

  const shuffledBreakfastItems = shuffledItemsByType('breakfast');
  const shuffledLunchItems = shuffledItemsByType('lunch');
  const shuffledDinnerItems = shuffledItemsByType('dinner');
  const shuffledSnackItems = shuffledItemsByType('snak');

  let recommendedFoodsList = [];
  let runningTotal = 0;
  let snackCount = 0;
  let additionalLunchAdded = false;

    
  // Helper function to add a food item to the list and update the running total of calories
  const addFoodItem = (foodItem) => {
    recommendedFoodsList.push(foodItem);
    runningTotal += foodItem.nutrition.calories;
  };

  // Add one item from each meal type: breakfast, lunch, and dinner
  [shuffledBreakfastItems, shuffledLunchItems, shuffledDinnerItems].forEach(mealArray => {
    if (mealArray.length > 0) {
        addFoodItem(mealArray[0]); // Take the first item after shuffling
    }
});

const tryAddingExtraLunch = () => {
  if (!additionalLunchAdded && shuffledLunchItems.length > 1) {
      const extraLunch = shuffledLunchItems[1]; // Second lunch item
      if (runningTotal + extraLunch.nutrition.calories <= userCalorieGoal) {
          addFoodItem(extraLunch);
          additionalLunchAdded = true;
      }
  }
};

// First, attempt to add up to 3 snacks
shuffledSnackItems.forEach(snack => {
  if (snackCount < 3 && (runningTotal + snack.nutrition.calories) <= userCalorieGoal) {
      addFoodItem(snack);
      snackCount++;
  }
});


// If calorie goal not met and less than 3 snacks were added, try adding extra lunch
if (runningTotal < userCalorieGoal && snackCount <= 3) {
  tryAddingExtraLunch();
}

// Continue adding snack items if calorie goal still not met
if (runningTotal < userCalorieGoal) {
  shuffledSnackItems.slice(snackCount).forEach(snack => {
      if ((runningTotal + snack.nutrition.calories) <= userCalorieGoal) {
          addFoodItem(snack);
      }
  });
}


if (runningTotal < userCalorieGoal && additionalLunchAdded) { // Use `additionalLunchAdded` here
  for (let food of shuffledSnackItems) {
    // Avoid adding the same snack again
    if (recommendedFoodsList.find((item) => item.id === food.id)) continue;

    const potentialNewTotal = runningTotal + food.nutrition.calories;
    if (potentialNewTotal <= userCalorieGoal) {
      addFoodItem(food);
    }
  }
}

    console.log("Recommended foods:", recommendedFoodsList);
    console.log("Total calories of recommended foods:", runningTotal);

    setRecommendedFoods(recommendedFoodsList);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      const userRef = ref(database, `users/${user.uid}`);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserCalorieGoal(userData.calorieNeeds); // Assuming calorieNeeds is stored in userData
  
          // Reset all diet options
          setShowVegetarian(false);
          setShowKeto(false);
          setshowpescatarian(false);
  
          // Set the correct diet option based on the database value
          switch (userData.dietOption) {
            case 'Vegetarian':
              setShowVegetarian(true);
              break;
            case 'Keto':
              setShowKeto(true);
              break;
            case 'Pescatarian':
              setshowpescatarian(true);
              break;
            default:
              // If needed, handle default case or unknown diet options
              break;
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleCardClick = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const toggleFavorite = (foodToToggle) => {
    const updatedFoodItems = foodItems.map(food => {
      if (food.id === foodToToggle.id) {
        return { ...food, isFavorite: !food.isFavorite };
      }
      return food;
    });
    setFoodItems(updatedFoodItems);
  };

  const filteredFoodItems = foodItems.filter(item => {
    if (showVegetarian && !item.vegetarian) {
      return false;
    }
    if (showKeto && !item.keto) {
      return false;
    }
    if (showpescatarian && !item.pescatarian) { 
      return false;
    }
    if (showBreakfast && !item.breakfast) {
      return true;
    } // New filter condition
    if (showLunch && !item.lunch) {
      return ture;
     } // New filter condition
    if (showDinner && !item.dinner) {
      return true;
    }
    if (showsnak && !item.snak) {
      return true;
    }
    return true;
    
  });

  return (
    <>
    <ProfileButton />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px' }}>
    <Typography variant="h4" sx={{ textAlign: 'center', mt: 4, mb: 2 }}>Nutrition Menu</Typography>
        <Button sx={defaultButtonStyles()} variant="contained" onClick={() => setShowDietOptions(!showDietOptions)}>
          {showDietOptions ? 'Hide Diet Options' : 'Show Diet Options'}
        </Button>
      </div>

      {showDietOptions && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <Button sx={defaultButtonStyles()} variant="contained" onClick={() => setShowFavorites(!showFavorites)} style={{ backgroundColor: showFavorites ? '#FFA1A0' : undefined }}>
            {showFavorites ? 'Show All' : ' Favorite '}
          </Button>
          <Button sx={defaultButtonStyles()} variant="contained" onClick={() => setShowVegetarian(!showVegetarian)} style={{ backgroundColor: showVegetarian ? '#FFA1A0' : undefined }}>
            {showVegetarian ? 'Show All' : ' Vegetarian '}
          </Button>
          <Button sx={defaultButtonStyles()} variant="contained" onClick={() => setShowKeto(!showKeto)} style={{ backgroundColor: showKeto ? '#FFA1A0' : undefined }}>
            {showKeto ? 'Show All' : ' Keto '}
          </Button>
          <Button sx={defaultButtonStyles()} variant="contained" onClick={() => setshowpescatarian(!showpescatarian)} style={{ backgroundColor: showpescatarian ? '#FFA1A0' : undefined }}>
            {showpescatarian ? 'Show All' : ' pescatarian '}
          </Button>
                    <Button sx={defaultButtonStyles()} 
            variant="contained" 
            onClick={() => {
              if (recommendedFoods.length > 0) {
                setRecommendedFoods([]); // This clears the recommended foods, expecting to show all foods again
              } else {
                handleShowRecommendedFoods(); // Supposed to fetch and show recommended foods
              }
            }} 
            style={{ backgroundColor: recommendedFoods.length > 0 ? '#FFA1A0' : undefined }}>
            {recommendedFoods.length > 0 ? 'Show All' : ' Recommended Food '}
          </Button>
          
        </div>
        
      )}
      {recommendedFoods.length > 0 && (
        <Button
          sx={defaultButtonStyles()}
          variant="contained"
          onClick={addAllRecommendedFoodsToProfile}
          style={{ margin: '20px auto', display: 'block' }} // Adjust styling as needed
        >
          Add All to Profile
        </Button>
      )}

      {/* Breakfast section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h4" sx={{mt: 4, mb: 2, letterSpacing:'15px', backgroundColor: '#FFB6B2', color: '#333333', borderRadius: 20, p: 2, textAlign: 'center', Width: '100%' }}>
        <b>Breakfast</b>
        </Typography>
        </AccordionSummary>
    <AccordionDetails>
<Grid container spacing={2} justifyContent="center" style={{ maxWidth: '1280px', margin: '0 auto' }}>
  {(recommendedFoods.length > 0 ? recommendedFoods : filteredFoodItems)
    .filter(food => food.breakfast && (!showFavorites || food.isFavorite))
    .map((food) => (
      <Grid item key={food.id} xs={12} sm={6} md={4} >
        <FoodCard 
          food={food} 
          onCardClick={handleCardClick} 
          onToggleFavorite={toggleFavorite}
          showRemoveButton={false} 
        />
        <Button sx={defaultButtonStyles()} 
          variant="contained" 
          color="primary" 
          onClick={() => addToProfile(food)}
          style={{ marginTop: '10px' }}
        >
          Add to Profile
        </Button>
      </Grid>
    ))
  }
</Grid>
</AccordionDetails>
  </Accordion>

      {/* Lunch section */}
      <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Typography variant="h4" sx={{mt: 4, mb: 2, letterSpacing:'15px', backgroundColor: '#FFB6B2', color: '#333333', borderRadius: 20, p: 2, textAlign: 'center', Width: '100%' }}>
    <b>Lunch</b>
  </Typography>
  </AccordionSummary>
    <AccordionDetails>
<Grid container spacing={2} justifyContent="center" style={{ maxWidth: '1280px', margin: '0 auto' }}>
  {(recommendedFoods.length > 0 ? recommendedFoods : filteredFoodItems)
    .filter(food => food.lunch && (!showFavorites || food.isFavorite))
    .map((food) => (
      <Grid item key={food.id} xs={12} sm={6} md={4}>
        <FoodCard 
          food={food} 
          onCardClick={handleCardClick} 
          onToggleFavorite={toggleFavorite} 
          showRemoveButton={false}
        />
        <Button 
        sx={defaultButtonStyles()}
          variant="contained" 
          color="primary" 
          onClick={() => addToProfile(food)}
          style={{ marginTop: '10px' }}
        >
          Add to Profile
        </Button>
      </Grid>
    ))
  }
</Grid>
</AccordionDetails>
  </Accordion>

    {/* Snack section */}
    <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h4" sx={{mt: 4, mb: 2, letterSpacing:'15px', backgroundColor: '#FFB6B2', color: '#333333', borderRadius: 20, p: 2, textAlign: 'center', Width: '100%' }}>
      <b>Snack</b>
      </Typography>
      </AccordionSummary>
    <AccordionDetails>
<Grid container spacing={2}justifyContent="center" style={{ maxWidth: '1280px', margin: '0 auto' }}>
  {(recommendedFoods.length > 0 ? recommendedFoods : filteredFoodItems)
    .filter(food => food.snak && (!showFavorites || food.isFavorite))
    .map((food) => (
      <Grid item key={food.id} xs={12} sm={6} md={4}>
        <FoodCard 
          food={food} 
          onCardClick={handleCardClick} 
          onToggleFavorite={toggleFavorite} 
          showRemoveButton={false}
        />
        <Button sx={defaultButtonStyles()} 
          variant="contained" 
          color="primary" 
          onClick={() => addToProfile(food)}
          style={{ marginTop: '10px' }}
        >
          Add to Profile
        </Button>
      </Grid>
    ))
  }
</Grid>
</AccordionDetails>
  </Accordion>

    {/* Dinner section */}
    <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h4" sx={{mt: 4, mb: 2, letterSpacing:'15px', backgroundColor: '#FFB6B2', color: '#333333', borderRadius: 20, p: 2, textAlign: 'center', Width: '100%' }}>
      <b>Dinner</b>
      </Typography>
      </AccordionSummary>
    <AccordionDetails>
<Grid container spacing={2}justifyContent="center" style={{ maxWidth: '1280px', margin: '0 auto' }}>
  {(recommendedFoods.length > 0 ? recommendedFoods : filteredFoodItems)
    .filter(food => food.dinner && (!showFavorites || food.isFavorite))
    .map((food) => (
      <Grid item key={food.id} xs={12} sm={6} md={4}>
        <FoodCard 
          food={food} 
          onCardClick={handleCardClick} 
          onToggleFavorite={toggleFavorite} 
          showRemoveButton={false}
        />
        <Button sx={defaultButtonStyles()} 
          variant="contained" 
          color="primary" 
          onClick={() => addToProfile(food)}
          style={{ marginTop: '10px' }}
        >
          Add to Profile
        </Button>
      </Grid>
    ))
  }
</Grid>
</AccordionDetails>
  </Accordion>

<Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      message={snackbarMessage}
    />


      {selectedFood && (
        <NutritionModal
          food={selectedFood}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
    </>
  );
};

export default NutritionMenu;
