// src/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, signOut } = useAuth();

  return (
    <div>
      <h1>Welcome, {currentUser.email}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Dashboard;