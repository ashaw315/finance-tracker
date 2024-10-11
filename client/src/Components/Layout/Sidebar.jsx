// src/components/Layout/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li>
          <Link to="/dashboard/overview">Overview</Link>
        </li>
        <li>
          <Link to="/dashboard/accounts">Accounts</Link>
        </li>
        <li>
          <Link to="/dashboard/transactions">Transactions</Link>
        </li>
        <li>
          <Link to="/dashboard/settings">Settings</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
