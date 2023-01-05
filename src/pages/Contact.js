import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

const Contact = () => {

  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  //eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  useEffect(() => {

    const fetchLandlord = async () => {

      const docRef = doc(db, 'users', params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      }

      else {
        toast.error("Couldn't able to find Landlord");
      }
    }

    fetchLandlord();
  }, [params.id]);

  const onChange = (e) => {

    setMessage(e.target.value);
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact <strong >{landlord?.name}</strong></p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className='messageLabel'>Message</label>
              <textarea name="message" id="message" className='textarea' onChange={onChange}></textarea>
            </div>
            <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`} type='button' className='primaryButton'>Send Message</a>
          </form>
        </main>
      )}
    </div>
  )
}

export default Contact;