import { firestore } from './firebase-config'; // ensure this imports correctly
import { collection, addDoc } from 'firebase/firestore';

const uploadFoodItems = async (items) => {
    const foodCollectionRef = collection(firestore, 'foods');
    const uploadPromises = items.map(item => {
        const { id, ...itemData } = item; // remove the hardcoded id if it's not needed in Firestore
        return addDoc(foodCollectionRef, itemData);
    });

    try {
        await Promise.all(uploadPromises);
        console.log('All food items have been uploaded successfully!');
    } catch (error) {
        console.error('Error uploading food items:', error);
    }
};

uploadFoodItems(foodItems);
