import { Navigate } from 'react-router-dom';
import useAdmin from '../hook/useAdmin';

import Spinner from '../components/Spinner';
import useAuth from '../hook/useAuth';

const PrivateRoute = ({ children }) => {
  const [isAuth, isAuthLoading] = useAdmin();
  const { user, loading } = useAuth();

  if (isAuthLoading || loading) {
    return <Spinner />;
  }

  if (isAuth || user) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
