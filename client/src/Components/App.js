import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../store/slices/authSlice';
import Dashboard from './Dashboard/Dashboard';
import HomePage from '../pages/HomePage';
import Profile from './Settings/Profile';
import Login from './Auth/Login';
import Register from './Auth/Register';
import PrivateRoute from './Layout/PrivateRoute';
import Navbar from './Layout/Navbar';
import Sidebar from './Layout/Sidebar';
import Footer from './Layout/Footer';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(checkAuthStatus()).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <Router>
      <div className="app-container">
        {/* Layout components */}
        <Navbar />
        <div className="app-content">
          <Sidebar />
          <main className="app-main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Private Routes */}
              <Route 
                path="/dashboard" 
                element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  isAuthenticated ? <Profile /> : <Navigate to="/login" />
                } 
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
