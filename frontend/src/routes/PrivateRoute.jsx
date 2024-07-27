// import { useContext } from 'react';
import { Navigate } from "react-router-dom";
import useAdmin from "../hook/useAdmin";
// import { AuthContext } from '../provider/AuthContext';



// const PrivateRouter = ({children})=>{

    
//     const {user , loading} = useContext(AuthContext)
    
//     if(loading){
//         return <progress className="progress w-56"></progress>
//     }

//     if(user){
//         return children
//     }
//     return <Navigate to="/login" />
// }
// export default PrivateRouter; 

import Spinner from "../components/Spinner";
import useAuth from "../hook/useAuth";

const PrivateRoute = ({children})=>{

    const [isAuth , isAuthLoading] =  useAdmin(); 
    const {user , loading } = useAuth(); 

    // const user = JSON.parse(localStorage.getItem('currentUser'))

    if(isAuthLoading || loading){
        return <Spinner />
    }



    if(isAuth || user){

        return children; 
    }

  

    return <Navigate to='/login' />
}

export default PrivateRoute