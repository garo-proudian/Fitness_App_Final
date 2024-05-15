import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem } from '@mui/material';

const NutritionModal = ({ food, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{food.name} Nutrition Facts</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Servings: {food.servings}</Typography>
        <List>
          {Object.entries(food.nutrition).map(([key, value]) => (
            <ListItem key={key}>
              <Typography variant="body2">{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}</Typography>
            </ListItem>
          ))}
        </List>
        <Typography variant="caption">*Percent Daily Values are based on a 2000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionModal;
