import { message } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import authentication1 from "../assets/authentication1.png";
import Error from "../components/Error";
import GoogleSignIn from '../components/GoogleSignIn';
import Success from '../components/Success';
import useAuth from '../hook/useAuth';
import useAxiosSecure from '../hook/useAxiosSecure';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const { createUser  , updateUserProfile} = useAuth()




  // disabled button  
  
  const forvalidator = ()=>{
    return name && email && password && password === cpassword
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !cpassword) {
      setError(true);
      message.error('Please fill all fields required and ensure passwords match.');
      return;
    }

    if (password !== cpassword) {
      setError(true);
      message.error('Passwords do not match');
      return;
    }



    // Create user using Firebase
    try {
      setLoading(true);
      const result = await createUser(email, password);
      await updateUserProfile(name, 'https://i.ibb.co/8zNGYt1/photo-1633332755192-727a05c4013d-q-80-w-1000-auto-format-fit-crop-ixlib-rb-4-0.jpg');
      
      setName(result.user?.displayName)
      setEmail(result.user?.email); 

      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        password,
        cpassword
      };

      const response = await axiosSecure.post('/api/users/register', userInfo);

      localStorage.setItem('currentUser', JSON.stringify(response.data));

      setName('');
      setEmail('');
      setPassword('');
      setCpassword('');
      setSuccess(true);
      navigate('/');
    } catch (error) {
      console.error('Error during sign up:', error);
      
      if (error.code) {

          if(error.code === 'auth/email-already-in-use'){
            return  message.error('Email already in use');
          }
          else if(error.code ==='auth/invalid-email' ){
            return  message.error('Invalid email');
          }else if(error.code === 'auth/operation-not-allowed'){
            return  message.error('Operation not allowed');
          }else if(error.code === 'auth/weak-password'){
            return  message.error('Weak password')
          }else{
            return message.error('An unexpected error occurred')
          }

       
      } else if (error.response) {
        if ([400, 409, 500].includes(error.response.status)) {
          return message.error(error.response.data.message);
        } else if (error.response.status === 404) {
          return navigate('/not-found');
        } else {
          setErrorMessage('Something went wrong');
        }
      } else {
        setErrorMessage('Something went wrong');
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };



  // if(loading){
  //   return <Spinner />
  // }

  if(error && errorMessage){
    return <Error error={errorMessage} />
  }

  return (
    <>
      <Helmet>
        <title>Vacation Rentalsall | Sign-up </title>
      </Helmet>

{/* 
      
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
          <button className="btn btn-outline w-full mb-4 btn-accent">
            Sign Up with Google
          </button>
          <div className="text-center mb-6">
            <span className="text-gray-500">or</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div className="space-y-2">
              <label
                htmlFor="cpassword"
                className="text-sm font-bold text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="cpassword"
                name="cpassword"
                className="input input-bordered w-full"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
              />
            </div> */}




            {/* {error &&
            
            ei portion tuku hobe na 
            
            (
              <div className="text-red-500 text-sm">
                <Error error="Email already registred" />
              </div>
            )} */}








            {/* {loading ? (
              <button className="btn btn-primary w-full mb-4" disabled>
                <Spinner />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-full bg-slate-600 mb-4"
              >
                Sign Up
              </button>
            )}
          </form>
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-500 hover:underline">
              Login here
            </Link>
          </p>
          {success && (
            <div className="text-green-500 text-sm">
              {' '}
              <Success success="User Registered Successfully" /> You can now log
              in.
            </div>
          )}
        </div>
      </div> */}


<div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
    {/* Left side - Image */}
    <div className="flex-1 mb-8 md:mb-0 hidden md:flex items-center justify-center">
      <img src={authentication1} alt="Authentication" className="w-full h-full object-cover" />
    </div>
    {/* Right side - Sign up form */}
    <div className="flex-1 p-8 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
     
<GoogleSignIn />


      <div className="text-center mb-6">
        <span className="text-gray-500">or</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold text-gray-700">
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
          <label htmlFor="password" className="text-sm font-bold text-gray-700">
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
        <div className="space-y-2">
          <label htmlFor="cpassword" className="text-sm font-bold text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="cpassword"
            name="cpassword"
            className="input input-bordered w-full"
            value={cpassword}
            onChange={(e) => setCpassword(e.target.value)}
          />
        </div>


        <button
            type="submit"
            className="btn btn-primary w-full bg-slate-600 mb-4"
            disabled = {!forvalidator()}
          >
            Sign Up
          </button>

      </form>
      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-slate-500 hover:underline">
          Login here
        </Link>
      </p>
      {success && (
        <div className="text-green-500 text-sm">
          {' '}
          <Success success="User Registered Successfully" /> You can now log
          in.
        </div>
      )}
    </div>
  </div>
</div>




    </>
  );
};

export default SignUp;
