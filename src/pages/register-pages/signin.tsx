import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/routes';


const SignInPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate(PageRoutes.Main);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
  };

  React.useEffect(() => {
    setIsFormValid(
      formData.email !== '' &&
        formData.password !== ''
    );
  }, [formData]);

  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <button onClick={handleSubmit} disabled={!isFormValid}>
        Next
      </button>
    </div>
  );
};

export default SignInPage;
