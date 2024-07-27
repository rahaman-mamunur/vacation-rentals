import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../components/Error';
import useAuth from '../hook/useAuth';
import useAxiosSecure from '../hook/useAxiosSecure';

const GoogleSignIn = () => {
  const { gooleSignIn } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGoogle = async () => {
    try {
      setLoading(true);

      const googleInfo = await gooleSignIn();

      const userinfo = {
        name: googleInfo.user?.displayName,
        email: googleInfo.user?.email,
      };

      const res = await axiosSecure.post(
        '/api/users/google-register',
        userinfo
      );

      localStorage.setItem('currentUser', JSON.stringify(res.data));

      setLoading(false);
      navigate('/');
    } catch (error) {
      console.log(error);
      setError(true);

      if (error.response.status === 404) {
        navigate('/not-found');
      } else {
        setErrorMessage('Something went wrong');
      }

      setLoading(false);
    }
  };

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }

  return (
    <>
      <button
        className="btn btn-outline w-full mb-4 btn-accent"
        onClick={handleGoogle}
      >
        Google
      </button>
    </>
  );
};

export default GoogleSignIn;
