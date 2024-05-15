import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

function AdminRoleManager() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpgradeToAdmin = () => {
        const functions = getFunctions();
        const addAdminRole = httpsCallable(functions, 'addAdminRole');

        addAdminRole({ email: email })
            .then((result) => {
                setMessage(result.data.message);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div>
            <h1>Upgrade User to Admin</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user's email"
            />
            <button onClick={handleUpgradeToAdmin}>Make Admin</button>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default AdminRoleManager;
