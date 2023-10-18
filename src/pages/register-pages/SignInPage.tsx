import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/routes';
import '../../styles.css';

const SignInPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const sign = "->";

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate(PageRoutes.Main);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case "auth/user-not-found":
            setErrorMessage("User not found. Please check your email or sign up");
            break;
          case "auth/wrong-password":
            setErrorMessage("Incorrect password. Please try again");
            break;
          case "auth/invalid-email":
            setErrorMessage("Invalid email address. Please enter a valid email");
            break;
          case "auth/network-request-failed":
            setErrorMessage("Network request failed. Please check your internet connection");
            break;
          default:
            setErrorMessage("An error occurred. Please try again later");
            break;
        }
        
      });
  };

  React.useEffect(() => {
    setIsFormValid(
      formData.email !== '' &&
      formData.password !== ''
    );
  }, [formData]);

  return (
    <div className='divide-page'>
      <div className='left-side'>
        <div className='register-box'>
          <h1 className='register-header'>Welcome back</h1>
          <h1 className='register-header'>Sign In</h1>
          <form className='input-form-box'>
            <div>
              <input
                className='input-form'
                type="email"
                name="email"
                placeholder="Email"
                autoComplete='off'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                className='input-form'
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className="error-text">{errorMessage}</div>
            </div>
            <div className="button-container">
              <button className='btn' onClick={handleSubmit} disabled={!isFormValid}>
                Next {sign}
              </button>
            </div>
            <div className="text-hover" onClick={() => navigate(PageRoutes.Signup)}><u>Don't have an account? Sign Up</u></div>
          </form>
        </div>
      </div>
      <div className='right-side'>
        {/* Content for the right side (empty on desktop) */}
      </div>
    </div>
  );
};

export default SignInPage;
