import React from 'react';
import { useAuth } from '../../../services/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Bem-vindo à página inicial!</div>;
};

export default Home;
