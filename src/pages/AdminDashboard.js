import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { getAuth, signOut } from "firebase/auth";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    // Function to handle logout
    const handleLogout = () => {
        signOut(auth).then(() => {
            // Redirect to login page after logout
            navigate('/Fitnesslogin');
        }).catch((error) => {
            // Handle Errors here.
            console.error('Logout Error:', error);
        });
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard!</p>
            <Button
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                }}
                variant="contained"
                color="secondary"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    );
};

export default AdminDashboard;
