// src/components/Auth/Register.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../store/slices/authSlice'; // Action to register the user

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }
    try {
        const resultAction = await dispatch(registerUser({ username, email, password }));
        
        // Check if the action was fulfilled
        if (registerUser.fulfilled.match(resultAction)) {
          const user = resultAction.payload;
          // User registration successful
          // You can access user data here if needed
          console.log('Registration successful:', user);
          
          // Redirect to dashboard or show success message
          navigate('/dashboard');
        } else if (registerUser.rejected.match(resultAction)) {
            setErrors(resultAction.payload.errors);
        } else {
          // Registration failed
          setErrors([resultAction.error.message]);
          throw new Error('Registration failed');
        }
    } catch (error) {
      // Handle registration error (e.g., show error message)
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {errors.length > 0 && errors.map((error, index) => (
        <p key={index} className="error-message">{error}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
