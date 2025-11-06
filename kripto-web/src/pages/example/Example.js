import React from 'react'
import { useAuth } from '../../authContext';
import { Navigate } from 'react-router-dom';


function Dashboard() {
    const { logout } = useAuth();
    const { user } = useAuth();

    // if (!user) {
    // return <Navigate to="/kriptografi/login" />;
    // }

    return (
        <>
            <button onClick={logout}>Logout</button>;
        </>
    )
}

export default Dashboard;