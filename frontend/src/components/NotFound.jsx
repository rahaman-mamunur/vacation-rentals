import { Link } from "react-router-dom";
import notfoundimg from "../assets/not-found.png";

const NotFound = ()=>{


    return(

        <>

<Link to='/'>

<div className="flex justify-center items-center h-screen w-screen bg-white fixed top-0 left-0">
      <img src={notfoundimg} alt="Not Found" className="max-w-full max-h-full object-contain" />
    </div>
</Link>
        </>
    )
}

export default NotFound; 


