// App.js
import React from 'react';
import PasswordDefine from './pages/PasswordModify';
import Header from './components/Header';
import './styles/global.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <PasswordDefine />
      </main>
    </div>
  );
};

export default App;