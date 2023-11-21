import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../routes/routes';
import PostsContainer from '../components/PostsContainer';
import Dropdown from '../components/Dropdown';
import Topbar from '../components/Topbar';

const MainPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const sign = "->";

  const [user, setUser] = useState("");
  const [isDropdown, setIsDropdown] = useState(false);
  let [count, setCount] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.displayName!);
      } else {
        navigate(PageRoutes.Signin);
      }
    });
  }, [])

  const logOut = () => {
    auth.signOut();
  }

  const handleDropdown = () => {
    console.log(isDropdown);
    setIsDropdown(!isDropdown);
  } 

  return (
    <div className='main-container'>
      <Topbar user={user} handleDropdown={handleDropdown} />
      <Dropdown
        isDropdown={isDropdown}
        user={user}
        sign={sign}
        handleDropdown={handleDropdown}
        logOut={logOut}
      />
      <div className='content-container'>
        <PostsContainer />
      </div>
    </div>
  );
}

export default MainPage;

