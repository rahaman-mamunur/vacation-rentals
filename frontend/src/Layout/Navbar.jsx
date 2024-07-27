
import { FaUserAstronaut } from "react-icons/fa";
import { LuHotel } from "react-icons/lu";
import { TbBrandBooking } from "react-icons/tb";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAdmin from "../hook/useAdmin";
import useAuth from "../hook/useAuth";


const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation(); 
  const {user , logOut , loading : userLoading} = useAuth(); 
  const [isAuth , isAuthLoading] = useAdmin()


  // console.log('inside navbar ' , user)
  // console.log('inside navbar of useadmin  ' , isAuth); 

  const handleLogout = async () => {

    await logOut(); 

    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // console.log(location.pathname)


  const navOptions = (
    <>


<li className="mr-4 ">


{location.pathname.includes('/home/bookings') ?  <>


<Link
          to="/home/"
          className="btn btn-outline flex items-center btn-accent "
          style={{ margin: 0, padding: '0.5rem 1rem' }} 
        >
          <LuHotel className="icon text-slate-300 text-xl"/>
          Rooms
        </Link>

</> : <>


<Link
          to="/home/bookings"
          className="btn btn-outline flex items-center btn-accent "
          style={{ margin: 0, padding: '0.5rem 1rem' }} 
        >
          <TbBrandBooking className="icon text-slate-300 text-2xl"/>
          Bookings
        </Link>

        
</>}




      </li>


      {/* {localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).isAdmin &&   <li className="text-xl mr-4 ">
        <Link
          to="/admin"
          className="btn btn-outline btn-accent text-center w-full "
        >
          Dashboard
        </Link>
      </li>} */}
    
      {isAuth && isAuth.isAdmin &&   <li className="text-xl mr-4 ">
        <Link
          to="/admin"
          className="btn btn-outline btn-accent text-center w-full "
        >
          Dashboard
        </Link>
      </li>}
    

    
      {user ? (
        <>
          <Link to="/home">
            <li className="text-base mr-5 flex flex-row btn btn-accent btn-outline ">
              <FaUserAstronaut className="icon" />
              {user.displayName || 'User'}
            </li>
          </Link>
          <button onClick={handleLogout} className="btn btn-outline btn-accent">
            Logout
          </button>
        </>
      ) : (
        <li className="text-base">
          <Link
            to="/login"
            className="btn btn-outline btn-accent text-center w-full "
          >
            Login
          </Link>
        </li>
      )}
       
    </>
  );

  if(isAuthLoading || userLoading){
    return null
  }

  return (
    <>
        {/* Full-width navbar */}
        <div className="navbar mb-10 bg-slate-600 text-white flex justify-between items-center px-4 py-3">
        {/* Align "Booking Rooms" link to the left */}
        <div className="navbar-start flex-grow flex items-center">
          <Link to="/" className="btn btn-ghost text-xl ml-20 flex items-center text-white font-bold">
            Vacation Rentals
          </Link>
        </div>
        {/* Align username and logout button to the right */}
        <div className="navbar-end mr-20 mt-2"> <ul className="flex items-center">
                      {navOptions}
                  </ul></div>
      </div>
    </>

  );
};

export default Navbar;
