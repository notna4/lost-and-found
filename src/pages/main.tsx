import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../routes/routes';

const Main = () => {

    const auth = getAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState("");

    onAuthStateChanged(auth, (user) => {
      if (user) {
          console.log(user);
          setUser(user.displayName!);
      } else {
          navigate(PageRoutes.Signup);
      }
    });

    const logOut = () => {
        auth.signOut();
    }
    
    return(
        <div>
            <div>Main, {user}</div>
            <button onClick={logOut}>Log out</button>
        </div>
    );
}

export default Main;