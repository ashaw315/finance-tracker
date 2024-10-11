import React from 'react';
import { useSelector } from 'react-redux';
import Profile from '../Components/Settings/Profile';
import Security from '../Components/Settings/Security';
import Navbar from '../Components/Layout/Navbar';
import PlaidLink from '../Components/PlaidLink';

const SettingsPage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <Navbar />
      <h1>Settings</h1>
      <h3>Connect Your Bank Account</h3>
    <PlaidLink />
      {user && (
        <div>
          <Profile />
          <Security />
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
