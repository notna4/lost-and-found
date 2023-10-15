import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../routes/routes';

const MainPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState("");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user.displayName!);
    } else {
      navigate(PageRoutes.Signin);
    }
  });

  const logOut = () => {
    auth.signOut();
  }

  return (
    <div>
      <div>Main, {user}</div>
      <button onClick={logOut}>Log out</button>
    </div>
  );
}


export default MainPage;