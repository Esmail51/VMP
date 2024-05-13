import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Navigate
import Register from './pages/Register';
import Product from './pages/ProductManagement'
import ProductList from './Productlist';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product" element={<Product />} />
        <Route path="/productlist" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;