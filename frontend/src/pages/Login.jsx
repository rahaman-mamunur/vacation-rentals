import { message } from 'antd';
import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from 'react-router-dom';
import authentication from "../assets/authentication.gif";
import Error from '../components/Error';
import GoogleSignIn from '../components/GoogleSignIn';
import Success from '../components/Success';
import useAuth from "../hook/useAuth";
import useAxiosSecure from '../hook/useAxiosSecure';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {signIn} = useAuth(); 




  const disablehandler = ()=>{

    return email && password
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(true);
      message.error('Please fill all fields and ensure passwords match.');
      return;
    }

    

    // signIn(email,password)
    // .then((result)=>{
    //   console.log('with user inside login page ' , result.user); 
      
    // })
    // .catch((error)=>{
    //   console.log(error); 
      
      
    // })

    try {
      const user = { email, password };
      setLoading(true);

      const userCredential = await signIn (email,password); 

      // console.log('with user inside login page ' , userCredential.user); 
      
      if(userCredential.user){
        const res = await axiosSecure.post('/api/users/login', user);
        // console.log('after posting the data into database ' , res.data);
      localStorage.setItem('currentUser', JSON.stringify(res.data));

      }

      
      setSuccess(true);
      setLoading(false);

      // store userinfo in localstorage
      navigate('/');

      // Clear form fields
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error);
      setError(true);




      if (error.code) {
        if (error.code === 'auth/user-not-found') {
          return message.error('User not found');
        } else if (error.code === 'auth/wrong-password') {
          return message.error('Incorrect password');
        } else if (error.code === 'auth/invalid-email') {
          return message.error('Invalid email');
        }
        
        else if(error.code === 'auth/invalid-credential'){
          return message.error('Invalid credential')
        }
         else {
          return message.error('An unexpected error occurred');
        }
      } else if (error.response) {
        if ([400, 500].includes(error.response.status)) {
          return message.error(error.response.data.message);
        } else if (error.response.status === 404) {
          navigate('/not-found');
        } else {
          setErrorMessage('Something went wrong');
        }
      } else {
        setErrorMessage('Something went wrong');
      }

      setLoading(false);
    }
  };



  if(error && errorMessage){

    return <Error error={errorMessage}  />
  }

  return (
    <>


<Helmet>
        <title>Vacation Rentalsall | Login </title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
    {/* Left side - Image */}
    <div className="flex-1 mb-8 md:mb-0 hidden md:flex items-center justify-center">
      {/* Your image component goes here */}
      <img src={authentication} alt="Authentication" className="w-full h-full object-cover"/>
    </div>
    {/* Right side - Login form */}
    <div className="flex-1 p-8 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome back</h1>
      <GoogleSignIn />
      <div className="text-center mb-6">
        <span className="text-gray-500">or</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* {error && (
          <div className="text-red-500 text-sm">
            <Error error={'Invalid Credentials'} />
          </div>
        )} */}
        {/* {loading ? ( */}
          {/* <button className="btn btn-primary w-full mb-4" disabled>
            <Spinner />
          </button>
        ) : ( */}
          <button
            type="submit"
            className="btn btn-primary w-full bg-slate-600 mb-4"
            disabled = {!disablehandler()}
          >
            Log in
          </button>
        {/* )} */}
      </form>
      <p className="text-center text-sm text-gray-500 mt-8">
        {'Don\'t have an account yet? '}
        <Link to="/signup" className="text-slate-500 hover:underline font-bold">
          Sign-up
        </Link>
      </p>
      {success && (
        <div className="text-green-500 text-sm">
          {' '}
          <Success success='User Login Successfull' />{' '}
        </div>
      )}
    </div>
  </div>
</div>

    </>
  );
};

export default Login;
