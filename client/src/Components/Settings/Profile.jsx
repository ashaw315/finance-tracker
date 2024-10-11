import React from 'react';
import { useSelector } from 'react-redux';
import PlaidLink from '../Plaid/PlaidLink';
import PlaidConnection from '../Plaid/PlaidConnection';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          {/* Add more user profile fields here */}
        </div>
      )}
      <PlaidLink />
      <PlaidConnection />
    </div>
  );
};

export default Profile;