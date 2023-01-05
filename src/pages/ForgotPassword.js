import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

const ForgotPassword = () => {

  // Local states
  const [email, setEmail] = useState('');

  // Input Change
  const onChange = (e) => {

    setEmail(e.target.value);
    console.log(e.target.value);
  }

  // Form Submit 
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // Get auth and Password Link
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email Sent !", {
        position: toast.POSITION.TOP_CENTER
      });
      setEmail('');
    }
    catch (error) {

      toast.error("Couldn't able to Sent !", {
        position: toast.POSITION.TOP_CENTER
      });
      setEmail('');
    }
  }


  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input type="email" className="emailInput" id='email' placeholder='Email' value={email} onChange={onChange} />
          <Link className='forgotPasswordLink' to='/sign-in' />
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className='signInButton'>
              <ArrowRightIcon fill="#fff" height="34px" width="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword;
