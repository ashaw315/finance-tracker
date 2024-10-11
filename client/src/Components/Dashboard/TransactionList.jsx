// TransactionsList.jsx
import React from 'react';

const TransactionsList = () => {
  const transactions = [
    { id: 1, date: '2024-10-01', description: 'Grocery Store', amount: -50 },
    { id: 2, date: '2024-10-02', description: 'Salary', amount: 5000 },
    { id: 3, date: '2024-10-03', description: 'Electricity Bill', amount: -100 },
  ];

  return (
    <div className="transactions-list">
      <h2>Recent Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.description} - ${transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;
