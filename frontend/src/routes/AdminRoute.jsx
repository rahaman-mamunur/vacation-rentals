import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import useAdmin from "../hook/useAdmin";
import useAuth from "../hook/useAuth";


const AdminRoute = ({children})=>{

    // const user = JSON.parse(localStorage.getItem('currentUser')) 
    const {user , loading : authloading} = useAuth(); 
    const [isAuth , isAuthLoading] = useAdmin(); 

     

    // if(user && JSON.parse(localStorage.getItem('currentUser')).isAdmin){

    //     return children  ;
    // }


    

    if(isAuth && isAuth?.isAdmin){
        // console.log('user data', user);
    // console.log('user loading', authloading);
    // console.log('admin data', isAuth?.isAdmin); 
    // console.log('admin loading', isAuthLoading);
        return children ; 
    }

    if(authloading || isAuthLoading){
        // console.log('inside of cpinner user data', user);
        // console.log('inside of cpinner user loading', authloading);
        // console.log('inside of cpinner admin data', isAuth?.isAdmin); 
        // console.log('inside of cpinner admin loading', isAuthLoading);
        return <Spinner />
    }
    
    return <Navigate to='/login' />
}


export default AdminRoute; 