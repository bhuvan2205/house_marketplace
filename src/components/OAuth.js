import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

const OAuth = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {

        try {
            
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check for user exists
            const docRef = doc(db, 'users', user.uid);            
            const docSnapshot = await getDoc(docRef);

            // Store the user to storage
            if(!docSnapshot.exists()){

                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                });
            }

            navigate('/');

        } 
        catch (error) {
         
            toast.error("Couldn't authorize with Google !", {
                position: toast.POSITION.TOP_CENTER
              });
        }

    }

    return (
        <div className='socialLogin'>
            <p>Sign {location.pathname === '/sign-up' ? "Up" : "In"}</p>
            <button className='socialIconDiv' onClick={onGoogleClick}>
                <img className='socialIconImg' src={googleIcon} alt="Google" />
            </button>
        </div>
    )
}

export default OAuth;