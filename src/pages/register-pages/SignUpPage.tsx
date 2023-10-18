import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../../styles.css';
import { PageRoutes } from '../../routes/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUpPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirementsVisible, setPasswordRequirementsVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    clearValidationErrors(name);
  };

  const handlePasswordInputFocus = () => {
    setPasswordRequirementsVisible(true);
  };

  const handlePasswordInputBlur = () => {
    setPasswordRequirementsVisible(false);
  };

  const checkIfEmailExists = async (email: string) => {
    const auth = getAuth();

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods && methods.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateForm();

    if (isFormValid) {
      const emailExists = await checkIfEmailExists(formData.email);

      if (emailExists) {
        setEmailError("Email is already in use");
      } else {
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
          .then((userCredential) => {
              const user = userCredential.user;
              updateProfile(user, {
                  displayName: formData.username,
              })
              .then(() => {
                navigate(PageRoutes.MakeDecision);
              })
              .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.error('Error updating username:', errorCode, errorMessage);
              });
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
          });
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const clearValidationErrors = (name: string) => {
    switch (name) {
      case 'username':
        setUsernameError('');
        break;
      case 'email':
        setEmailError('');
        break;
      case 'password':
        setPasswordError('');
        break;
      case 'confirmPassword':
        setConfirmPasswordError('');
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email);
    const isUsernameValid = formData.username.length >= 4;
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password);
    const isConfirmPasswordEmpty = formData.confirmPassword === '';
    const isConfirmPasswordValid = formData.password === formData.confirmPassword;

    setEmailError(isEmailValid ? '' : 'Invalid email');
    setUsernameError(isUsernameValid ? '' : 'Username must be at least 4 characters long');
    setPasswordError(isPasswordValid ? '' : 'Password does not meet the criteria');
    setConfirmPasswordError(
      isConfirmPasswordEmpty
        ? 'Please confirm your password'
        : isConfirmPasswordValid
        ? ''
        : 'Passwords do not match'
    );

    setIsFormValid(isEmailValid && isUsernameValid && isPasswordValid && isConfirmPasswordValid);
  };

  const passwordRequirementsSection = passwordRequirementsVisible && (
    <div className="password-requirements">
      Your password must meet the following criteria:
      <ul>
        <li>At least one uppercase letter (A-Z).</li>
        <li>At least one lowercase letter (a-z).</li>
        <li>At least one number (0-9).</li>
        <li>At least one special character (e.g., !, @, #, $, etc).</li>
      </ul>
    </div>
  );

  return (
    <div className="divide-page">
      <div className='left-side'>
        <div className='register-box'>
          <h1 className="register-headers">Lost something?<br />
              You’ve come to the right place!</h1>
          <h1 className="register-headers">Create an account</h1>
          <form className='input-form-box'>
            <div>
              <input
                className="input-form"
                placeholder="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <div className="error-text">{usernameError}</div>
            </div>
            <div>
              <input
                className="input-form"
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <div className="error-text">{emailError}</div>
            </div>
            <div>
              <input
                className="input-form"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={handlePasswordInputFocus}
                onBlur={handlePasswordInputBlur}
              />
              <div className="error-text">{passwordError}</div>
              {passwordRequirementsSection}
            </div>
            <div>
              <div>
                <input
                  className="input-form"
                  placeholder="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <span className="toggle-password" onClick={toggleShowPassword}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className="error-text">{confirmPasswordError}</div>
            </div>
            <div className="button-container">
              <button type="submit" className="btn" onClick={handleSubmit} >
                Next
              </button>
            </div>
            <div className="text-hover" onClick={() => navigate(PageRoutes.Signin)}><u>Already have an account? Sign In</u></div>
          </form>
        </div>
      </div>
      <div className='right-side'>

      </div>
    </div>
  );
};

export default SignUpPage;
