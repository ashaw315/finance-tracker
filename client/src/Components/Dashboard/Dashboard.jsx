// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import TransactionsList from './TransactionList';
import Chart from './Chart';
import axiosInstance from '../../api/axiosConfig';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // useEffect(() => {
    //     if(isLinked) {
    //         fetchAccounts();
    //         fetchTransactions();
    //     }
    // }, [isLinked]);

    const fetchAccounts = async () => {
        try {
            const response = await axiosInstance.get('/plaid/accounts');
            setAccounts(response.data.accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };
    
    const fetchTransactions = async () => {
        try {
            const response = await axiosInstance.get('/plaid/transactions');
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };


  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="account-summary">
        <h2>Account Summary</h2>
        <p>Balance: $10,000</p>
        {/* Add more account details here */}
      </div>

      <div className="dashboard-charts">
        <Chart />
      </div>

      <div className="transactions-list">
        <TransactionsList />
      </div>
    </div>
  );
};

export default Dashboard;
