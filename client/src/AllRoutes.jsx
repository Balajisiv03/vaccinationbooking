import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './Pages/Auth/Auth';
import AdmPage from './Pages/Auth/AdmPage';
import HomePage from './Pages/Auth/HomePage'

const AllRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Auth />} />
      <Route path="/AdmPage" element={<AdmPage/>}/>
      <Route path="/HomePage" element={<HomePage/>}/>
    </Routes>
  );
};

export default AllRoutes;
