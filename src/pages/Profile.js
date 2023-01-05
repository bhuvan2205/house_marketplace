import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  orderBy,
}
  from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';

const Profile = () => {

  const navigate = useNavigate();

  // Initialize auth 
  const auth = getAuth();

  // Local states
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const { name, email } = formData;

  // Onchange Handler for input values
  const onChange = (e) => {

    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  // Form submit when update username
  const onSubmit = async () => {

    try {

      // update in firebase
      if (auth.currentUser.displayName !== name) {

        await updateProfile(auth.currentUser, { displayName: name })
      }

      // update in firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      })
    }
    catch (error) {

      toast.error("Couldn't able to update User Profile");
    }
  }

  // Logout function
  const logout = () => {

    auth.signOut();
    navigate('/');
  }

  useEffect(() => {

    const fetchUserListings = async () => {

      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp')
      )

      const querySnap = await getDocs(q);
      let listings = [];

      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings);
      setLoading(false);
    }


    fetchUserListings();

  }, [auth.currentUser.uid]);

  const onDelete = async (id) => {

    if (window.confirm('Are you sure, you want to delete?')) {

      await deleteDoc(doc(db, 'listings', id));
      const updatedListings = listings.filter((listing) => listing.id !== id);
      setListings(updatedListings);
      toast.success("Successfully deleted listing!");
    }
  }

  const onEdit = (id) => {

    navigate(`/edit-listing/${id}`);
  }

  // Main  return  
  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className="pageHeader">My Profile</p>
        <button type='button' className='logOut' onClick={logout}>Logout</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={
            () => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }
          }>
            {changeDetails ? "update" : "update ?"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />
            <input type="email" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled value={email} onChange={onChange} />
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your home</p>
          <img src={arrowRightIcon} alt="->" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listing</p>
            <ul>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onEdit={() => onEdit(listing.id)}
                  onDelete={() => onDelete(listing.id)} />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile;
