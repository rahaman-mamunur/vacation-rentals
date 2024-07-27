import { Navigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import useAdmin from '../hook/useAdmin';
import useAuth from '../hook/useAuth';

const AdminRoute = ({ children }) => {
  const { user, loading: authloading } = useAuth();
  const [isAuth, isAuthLoading] = useAdmin();

  if (isAuth && isAuth?.isAdmin) {
    return children;
  }

  if (authloading || isAuthLoading) {
    return <Spinner />;
  }

  return <Navigate to="/login" />;
};

export default AdminRoute;
