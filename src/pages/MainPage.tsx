import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../routes/routes';
import PostsContainer from '../componets/PostsContainer';

const MainPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const sign = "->";

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
    <div className='main-container'>
      {/* extract these as different components */}
      <div className='topbar-container'>
        <div>Lost and Found TM</div>
        <div className='mobile-menu'>
          <button className='btn' onClick={() => navigate(PageRoutes.CreateLost)}>
            I lost something {sign}
          </button>
          <button className='btn' onClick={() => navigate(PageRoutes.CreateFind)}>
            I found something {sign}
          </button>
          <div className='topbar-right'>
            <div>{user}</div>
            <button onClick={logOut}>Log out</button>
          </div>
        </div>
      </div>
      <div className='content-container'>
        <PostsContainer />
      </div>
    </div>
  );
}

export default MainPage;

