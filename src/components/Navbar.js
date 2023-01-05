import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';

const Navbar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const pathMatchRoutes = (route) =>{

        if(route === location.pathname){

            return true;
        }
    }

    return (
        <footer className='navbar'>
            <nav className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className='navbarListItem'>
                        <ExploreIcon fill={pathMatchRoutes('/') ? "#2c2c2c" : "#8f8f8f"} width="36px" height="36px" onClick={()=> navigate('/')} />
                        <p className={pathMatchRoutes('/') ? "navbarListItemNameActive" : "navbarListItemName"}>Explore</p>
                    </li>
                    <li className='navbarListItem'>
                        <OfferIcon fill={pathMatchRoutes('/offers') ? "#2c2c2c" : "#8f8f8f"} width="36px" height="36px" onClick={()=> navigate('/offers')} />
                        <p className={pathMatchRoutes('/offers') ? "navbarListItemNameActive" : "navbarListItemName"}>Offer</p>
                    </li>
                    <li className='navbarListItem'>
                        <PersonOutlineIcon fill={pathMatchRoutes('/profile') ? "#2c2c2c" : "#8f8f8f"} width="36px" height="36px" onClick={()=> navigate('/profile')} />
                        <p className={pathMatchRoutes('/profile') ? "navbarListItemNameActive" : "navbarListItemName"}>PersonOutline</p>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}

export default Navbar
