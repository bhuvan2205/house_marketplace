import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import OAuth from '../components/OAuth';

const SignIn = () => {

  const navigate = useNavigate();

  // Local states
  const [showPassword, setShowPassword] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  // Input Change function
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

      // Create user in firebase
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        toast.success("Logged in Successfully!", {
          position: toast.POSITION.TOP_CENTER
        });
        navigate('/');
      }      
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
          <input type="email" className="emailInput" id="email" placeholder='Email' value={email} onChange={onChange} />
          <div className="passwordInputDiv">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="passwordInput" id='password' value={password} onChange={onChange} />
            <img src={visibilityIcon} alt="show password" className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)} />
          </div>
          <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>
          <div className='signInBar'>
            <p className="signInText">
              Sign In
            </p>
            <button className='signInButton'>
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <OAuth />
        <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
      </div>
    </>
  )
}

export default SignIn;
