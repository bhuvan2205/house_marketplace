import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import { Map, Marker, ZoomControl } from "pigeon-maps";
import shareIcon from '../assets/svg/shareIcon.svg';
import Spinner from '../components/Spinner';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Listing = () => {

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(null);

    const [hue, setHue] = useState(0);
    const color = `hsl(${hue % 360}deg 39% 70%)`;

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {

        const fetchListings = async () => {

            const docRef = doc(db, 'listings', params.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                setListing(docSnap.data());
                setLoading(false);
            }
        }

        fetchListings();

    }, [navigate, params.id]);

    if (loading) {

        return <Spinner />;
    }

    return (
        <main>

            <Swiper slidesPerView={1} pagination={{ clickable: true }}>
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            style={{
                                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                backgroundSize: 'cover',
                                marginTop:"20px"
                            }}
                            className='swiperSlideDiv'
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="shareIconDiv" onClick={() => {

                navigator.clipboard.writeText(window.location.href);
                setShareLinkCopied(true);
                setTimeout(() => {

                    setShareLinkCopied(false);
                }, 2000);
            }}>
                <img src={shareIcon} alt="" />
            </div>

            {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

            <div className="listingDetails">
                <p className='listingName'>
                    {listing.name} - $
                    {listing.offer
                        ? listing.discountPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : listing.regularPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className="listingLocation">{listing.location}</p>
                <p className='listingType'>
                    For {listing.type === 'rent' ? "Rent" : "Sale"}
                </p>
                {
                    listing.offer && (
                        <p className='discountPrice'>
                            $ {Math.abs(listing.regularPrice - listing.discountPrice)} discount
                        </p>
                    )
                }
                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>{listing.parking && "Parking Spot"}</li>
                    <li>{listing.furnished && "Furnished"}</li>
                </ul>
                <p className="listingLocationTitle">Location</p>
                <div className="leafletContainer">
                    <Map height={300} defaultCenter={[listing.geolocation.lat, listing.geolocation.lng]}>
                        <ZoomControl />
                        <Marker
                            width={50}
                            anchor={[listing.geolocation.lat, listing.geolocation.lng]}
                            onClick={() => setHue(hue + 20)}
                            color={color}
                        />

                    </Map>
                </div>
                {auth.currentUser?.uid !== listing.userRef && (
                    <Link
                        to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                        className='primaryButton'
                    >
                        Contact Landlord
                    </Link>
                )}
            </div>
        </main>
    )
}

export default Listing;