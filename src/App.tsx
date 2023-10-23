import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PageRoutes } from './routes/routes';

import SignUpPage from './pages/register-pages/SignUpPage';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import MakeDecisionPage from './pages/MakeDecision';
import SignInPage from './pages/register-pages/SignInPage';
import MainPage from './pages/MainPage';
import Lost from './pages/create-posts/create-lost';
import Find from './pages/create-posts/create-find';
import SuccessPage from './pages/create-posts/SuccessPage';

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
    <Routes>
      <Route path={PageRoutes.Main} Component={MainPage} />
      <Route path={PageRoutes.Signup} Component={SignUpPage} />
      <Route path={PageRoutes.Signin} Component={SignInPage} />
      <Route path={PageRoutes.ItemPostedSuccess} Component={SuccessPage} />
      <Route path={PageRoutes.MakeDecision} Component={MakeDecisionPage} />
      <Route path={PageRoutes.CreateLost} Component={Lost} />
      <Route path={PageRoutes.CreateFind} Component={Find} />
    </Routes>
  );
}

export default App;
