import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import ProfileIcon from '../assets/icons/user.jpg'; // Path to the profile image

const ProfileButton = () => {
  let navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <Avatar
      onClick={handleProfileClick}
      src={ProfileIcon} // The image for the profile
      alt="Profile"
      style={{
        cursor: 'pointer',
        position: 'absolute',
        top: 20,
        right: 20,
        width: 70, // Size of the avatar circle
        height: 70, // Size of the avatar circle
      }}
    />
  );
};

export default ProfileButton;
