import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../constants';

export const useConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      console.log('Testing connection to:', API_ENDPOINT);
      
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
      });
      
      console.log('Connection test response:', response.status);
      
      if (response.ok) {
        setConnectionStatus('connected');
        console.log('Connection successful');
      } else {
        console.log('Connection failed with status:', response.status);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    connectionStatus,
    setConnectionStatus,
    testConnection
  };
};