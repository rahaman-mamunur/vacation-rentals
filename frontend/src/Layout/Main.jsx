import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";


const Main =()=>{

    // const location = useLocation() 
    // const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('signup'); 



    return(

        <>
        {/* {noHeaderFooter || <Navbar />}
        <Outlet />
        {noHeaderFooter || <Footer />} */}
        <Navbar />
        <div className="max-w-screen-xl mx-auto">


        <Outlet  />
        </div>
        <Footer />
        </>
    )
}
export default Main; 