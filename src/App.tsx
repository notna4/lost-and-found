import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignUpPage from './pages/register-pages/signup';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import MakeDecisionPage from './pages/MakeDecision';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfwTK_UcnWu0HbLVjXSJgnFe-d6STRkkM",
  authDomain: "lost-and-found-373e1.firebaseapp.com",
  projectId: "lost-and-found-373e1",
  storageBucket: "lost-and-found-373e1.appspot.com",
  messagingSenderId: "699180430397",
  appId: "1:699180430397:web:ce9f1b1ef1823447f82654"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



function App() {
  return (
    <Router>
        <Routes><Route path="/signup"  Component={SignUpPage} /></Routes>
        <Routes><Route path="/make-decision" Component={MakeDecisionPage} /></Routes>
    </Router>
  );
}

export default App;
