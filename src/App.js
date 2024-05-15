import React, { useState,useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Navigate
import Register from './pages/Register';
import Product from './pages/ProductManagement'
import ProductList from './Productlist';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';
import logoImg from './assets/img/logo-img.png'

function App() {

  const [ pageLoading, setpageLoading ] = useState(false);

  const PreLoader = () => {
    return (
      <div className='pre-loader'>
        <div style={{padding:'20px',borderRadius:'80px', background:'#fff'}}>
        <img src={logoImg} alt='pre-loader' width={75}></img>
        </div>
        <p>Vendor Management Platform</p>
      </div>
    )
  }

  useEffect(()=> {
    setpageLoading(true);
    setTimeout(() => {
      setpageLoading(false)
    },2000);
  },[])
  
  

  return (
    <>
      {pageLoading ? (
        <PreLoader />
      ) : (
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product" element={<Product />} />
            <Route path="/productlist" element={<ProductList />} />
          </Routes>
        </Router>
      )}
    </>
)
}

export default App;