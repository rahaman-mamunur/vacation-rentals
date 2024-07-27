import Spinner from "../components/Spinner";
import useAdmin from '../hook/useAdmin';
import useAuth from "../hook/useAuth";

const Try = () => {
  const { user, loading: authLoading } = useAuth(); 
  const [isAuth, isAuthLoading] = useAdmin(); 

  const handler = () => {
    console.log('user data', user);
    console.log('user loading', authLoading);
    console.log('admin data', isAuth?.isAdmin); 
    console.log('admin loading', isAuthLoading);
  };

  if (authLoading || isAuthLoading) {
    return <Spinner />;
  }

  return (
    <>
      <button onClick={handler} className="btn btn-outline bg-slate-700">
        clicker
      </button>
    </>
  );
};

export default Try;
