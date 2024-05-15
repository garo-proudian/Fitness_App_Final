import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const FoodCard = ({ food, onCardClick, onToggleFavorite, onEdit }) => {
  const favoriteIcon = food.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />;

  return (
    <Card 
      sx={{ 
        width: 345, height: 400, display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'space-between'
      }} 
      onClick={() => onCardClick(food)}
    >
      <CardMedia
        component="img"
        height="200"
        image={food.image}
        alt={food.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {food.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingredients: {food.ingredients}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Calories: {food.nutrition.calories}
        </Typography>
      </CardContent>
      <IconButton 
        sx={{ alignSelf: 'flex-end', position: 'absolute', bottom: 5, right: 16 }} 
        onClick={(e) => { 
          e.stopPropagation(); 
          onToggleFavorite(food); 
        }}
      >
        {favoriteIcon}
      </IconButton>
      <CardActions>
        {onEdit && <Button size="small" onClick={() => onEdit(food)}>Edit</Button>}

      </CardActions>
    </Card>
  );
};


FoodCard.defaultProps = {
  onCardClick: () => {},
  onToggleFavorite: () => {},
  onEdit: null, // Assuming that not all FoodCards need edit functionality.
};

export default FoodCard;
