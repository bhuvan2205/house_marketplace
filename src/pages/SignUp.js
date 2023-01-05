import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from 'react-toastify';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase.config';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';


const SignUp = () => {

  const navigate = useNavigate();

  // Local states
  const [showPassword, setShowPassword] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = formData;

  // Input change function
  const onChange = (e) => {

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  // Form submit 
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // Generate auth
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = await userCredential.user;
      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp();

      // save the user to firebase database
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate('/');

    }
    catch (error) {

      toast.error("Something went wrong!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>
        <form onSubmit={handleSubmit}>
          <input type="name" className="nameInput" id="name" placeholder='Name' value={name} onChange={onChange} />
          <input type="email" className="emailInput" id="email" placeholder='Email' value={email} onChange={onChange} />
          <div className="passwordInputDiv">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="passwordInput" id='password' value={password} onChange={onChange} />
            <img src={visibilityIcon} alt="show password" className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)} />
          </div>
          <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>
          <div className='signUpBar'>
            <p className="signUpText">
              Sign Up
            </p>
            <button className='signUpButton'>
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        { /* Google OAuth*/}
        <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>
      </div>
    </>
  )
}

export default SignUp;
