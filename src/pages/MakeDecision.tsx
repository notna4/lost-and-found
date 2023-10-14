import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';



const MakeDecisionPage = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState("");

    onAuthStateChanged(auth, (user) => {
      if (user) {
          console.log(user);
          setUser(user.displayName!);
      } else {
          navigate("/signup");
      }
    });

  return (
    <div>
      <h1>Next Steps, {user}</h1>
      <button>I lost an item</button>
      <button>I found something</button>
    </div>
  );
};

export default MakeDecisionPage;