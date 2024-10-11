import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axiosInstance from '../../api/axiosConfig';

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Step 1: Request link token from your server when component mounts
  useEffect(() => {
    const fetchLinkToken = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post('/plaid/create_link_token');
        // Step 2: Receive link token from your server
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkToken();
  }, []);

  // Step 4 & 5: Receive public token from Plaid and send to your server
  const onSuccess = useCallback(async (public_token, metadata) => {
    setIsLoading(true);
    try {
      // Step 5: Send public token to your server
      const response = await axiosInstance.post('/plaid/exchange_public_token', { public_token, metadata });
      if (response.status === 200) {
        // Step 7: Your server has saved the access token
        setIsConnected(true);
      } else {
        console.error('Failed to exchange public token');
      }
    } catch (error) {
      console.error('Error exchanging public token:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Step 3: Initialize Plaid Link with the link token
  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  if (isConnected) {
    return <div>Bank account connected successfully!</div>;
  }

  return (
    <button onClick={open} disabled={!ready || isLoading}>
      {isLoading ? 'Connecting...' : 'Connect a bank account'}
    </button>
  );
};

export default PlaidLink;
