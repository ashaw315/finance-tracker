// src/components/Settings/Security.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../store/slices/authSlice'; // Assuming this action exists

const Security = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setError('');
    dispatch(updatePassword({ userId: user.id, newPassword: password }));
  };

  return (
    <div>
      <h2>Security Settings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handlePasswordChange}>Update Password</button>
    </div>
  );
};

export default Security;
