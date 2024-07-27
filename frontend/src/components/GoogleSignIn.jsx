import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import useAuth from "../hook/useAuth";
import useAxiosSecure from "../hook/useAxiosSecure";



const GoogleSignIn = ()=>{


    const {gooleSignIn} = useAuth()
    const axiosSecure = useAxiosSecure(); 
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);



    const handleGoogle = async()=>{



        try {

            setLoading(true)

            const googleInfo = await gooleSignIn() ; 
            // console.log('google sign info  ' , googleInfo.user)

            const userinfo = {
                name : googleInfo.user?.displayName,
                email : googleInfo.user?.email
            }


            const res = await axiosSecure.post('/api/users/google-register' , userinfo)

            // console.log('after googling ' , res.data); 
      localStorage.setItem('currentUser', JSON.stringify(res.data));


            setLoading(false); 
            navigate('/')
            
        } catch (error) {
            console.log(error);
            setError(true); 
            

            if(error.response.status === 404){
              navigate('/not-found')
            }else{
                setErrorMessage('Something went wrong')
            }

            setLoading(false); 

        }


        // gooleSignIn()
        // .then((result)=>{
        //     console.log('google info' , result.user); 

        //     const userinfo = {
        //         name : result.user?.displayName,
        //         email : result.user?.email
        //     }

        //     axiosSecure.post('/api/users/google-register' , userinfo)
        //     .then((result)=>{
        //         console.log('google user insert to db ' , result); 
        //         navigate('/')
        //     })
            

        // })
        // .catch((error)=>{
        //     console.log(error); 

        //     if(error.response.status === 409){
        //         message.error(error.response.data.message)
        //     }else if(error.response.status === 404){
        //         navigate('/not-found')
        //     }else{
        //         message.error('Something went wrong')
        //     }


        // })
      
    }

    



    if(error && errorMessage){
        return <Error error={errorMessage} />
    }

    return(

        <>
         <button className="btn btn-outline w-full mb-4 btn-accent" onClick={handleGoogle}>
         Google
      </button>
        </>
    )
}

export default GoogleSignIn; 