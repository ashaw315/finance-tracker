import React, { useEffect, useState } from 'react';
import PlaidLink from './PlaidLink';
import axiosInstance from '../../api/axiosConfig';

const PlaidConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, bank_name: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const response = await axiosInstance.get('/plaid/connection_status');
        setConnectionStatus(response.data);
      } catch (error) {
        console.error('Error checking Plaid connection status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkConnectionStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (connectionStatus.connected) {
    return (
      <div>
        <p>Connected to {connectionStatus.bank_name}</p>
        <button onClick={() => {/* Implement disconnect functionality */}}>Disconnect</button>
      </div>
    );
  }

  return <PlaidLink />;
};

export default PlaidConnection;