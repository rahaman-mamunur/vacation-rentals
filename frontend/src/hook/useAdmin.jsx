import { useEffect, useState } from 'react';
import useAuth from '../hook/useAuth';
import useAxiosSecure from '../hook/useAxiosSecure';

const useAdmin = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAuth, setIsAuth] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStatus = async () => {
            if (user?.email) {
                try {
                    setIsAuthLoading(true);
                    const res = await axiosSecure.get(`/api/users/get-user-email/${user.email}`);
                    // console.log(res.data);
                    setIsAuth(res.data);
                } catch (error) {
                    console.error('Failed to fetch admin status:', error);
                    setIsAuth(null);
                } finally {
                    setIsAuthLoading(false);
                }
            } else {
                setIsAuthLoading(false);
            }
        };

        if (!authLoading) {
            fetchAdminStatus();
        }
    }, [user, authLoading, axiosSecure]);

    return [isAuth, isAuthLoading];
};

export default useAdmin;
