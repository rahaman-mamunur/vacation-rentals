import { Tabs, message } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import useAdmin from '../hook/useAdmin';
import useAuth from '../hook/useAuth';
import useAxiosSecure from '../hook/useAxiosSecure';
import useData from '../hook/useData';

const { TabPane } = Tabs;

const Profilescreen = () => {
  const [isAuth] = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate('/login');
    }
  }, [user, navigate]);

  return (
    <>
      <Helmet>
        <title>Vacation Rentals | Profile</title>
      </Helmet>
      <div className="mt-5 ml-3 ">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Bookings" key="1">
            <MyOrders />
          </TabPane>
          <TabPane tab="My Profile" key="2" className="h-[65vh]">
            <div className="row">
              <div className="col-md-6 bs m-2 p-3">
                <h1>
                  Name: <span className="font-semibold">{isAuth?.name}</span>
                </h1>
                <h1>
                  Email: <span className="font-semibold">{isAuth?.email}</span>
                </h1>
                <h1>
                  Admin Access:{' '}
                  <span className="font-bold">
                    {isAuth?.isAdmin ? 'Yes' : 'No'}
                  </span>
                </h1>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export const MyOrders = () => {
  const [mybookings, setmybookings] = useState([]);
  const [loading, setloading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isAuth, isAuthLoading] = useAdmin();
  const { user } = useAuth();

  const { refetch } = useData();

  useEffect(() => {
    if (!user) {
      return navigate('/login');
    }

    const fetchData = async () => {
      try {
        setloading(true);
        const res = await axiosSecure.post('/api/bookings/getuserbookings', {
          userid: isAuth?._id,
        });

        setmybookings(res.data);
        setloading(false);
      } catch (error) {
        seterror(true);
        if (error.response.status === 400) {
          message.error(error.response.data.message);
        } else if (error.response.status === 404) {
          navigate('/not-found');
        } else if (error.response.status === 500) {
          message.error(error.response.data.message);
        } else {
          message.error('Something went wrong');
        }
        setloading(false);
      }
    };

    if (!isAuthLoading) {
      fetchData();
    }
  }, [axiosSecure, navigate, user, isAuth?._id, isAuthLoading]);

  // todo : validate error checker ----->    /api/bookings/cancelbooking/

  const cancelBooking = async (id, roomid) => {
    try {
      setloading(true);

      const res = await axiosSecure.post('/api/bookings/cancelbooking/', {
        bookingid: id,
        userid: isAuth?._id,
        roomid: roomid,
      });
      if (res.status === 201) {
        message.success(res.data.message);
        const result = await refetch.bookingsById();
        setmybookings(result);
      } else {
        setErrorMessage('Please! try again later .. ');
      }

      setloading(false);
    } catch (error) {
      console.log(error);
      seterror(true);

      if (error.response.status === 403) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 401) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 408) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 409) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 404) {
        navigate('/not-found');
      } else if (error.response.status === 500) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong');
      }
      setloading(false);
    }
  };

  const checkCancellationDeadline = async (item) => {
    try {
      setloading(true);
      const res = await axiosSecure.get(
        `/api/bookings/cancel-deadline/${item._id}`
      );

      setloading(false);

      return res.data.checkCancelDate ? 'alive' : 'dead';
    } catch (error) {
      console.log(error);
      seterror(true);
      if (
        error.response.status === 400 &&
        error.response.data.message === 'Invalid check-in date format'
      ) {
        message.error(error.response.data.message);
      } else if (
        error.response.status === 403 &&
        error.response.data.message === 'Booking not found'
      ) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 404) {
        navigate('/not-found');
      } else if (error.response.status === 500) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong');
      }

      setloading(false);
    }
  };

  const handleCancelBooking = async (item) => {
    const canCancel = await checkCancellationDeadline(item);

    if (canCancel === 'alive') {
      cancelBooking(item._id, item.roomid);
    } else if (canCancel === 'dead') {
      message.error('Cancellation deadline passed');
    } else {
      seterror(true);
    }
  };

  //  request for cancellation

  const cancellationHandler = async (item) => {
    try {
      setloading(true);
      const res = await axiosSecure.post(`/api/bookingCancel/bookingCancel`, {
        bookingid: item._id,
        userId: isAuth._id,
      });
      message.success(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
      seterror(true);
      setloading(false);

      if (error.response)
        error.response.status === 409
          ? message.success(error.response.data)
          : error.response.status === 400
          ? message.error(error.response.data)
          : error.response.status === 500
          ? message.error(error.response.data)
          : error.response.status === 404
          ? navigate('/not-found')
          : message.error('Submission error. Please retry later.');
    }
  };

  // for report
  const handleReport = async (booking) => {
    try {
      setloading(true);

      const res = await axiosSecure.post('/api/report/reports', {
        bookingId: booking._id,
        userId: isAuth?._id,
      });
      if (res.status === 201) {
        message.success('Your report has been sent ');
      } else {
        message.error('error');
      }
      setloading(false);
    } catch (error) {
      console.log(error);
      seterror(true);
      if (error.response.status === 404) {
        navigate('/not-found');
      } else if (error.response.status === 401) {
        message.success(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong !!!');
      }
      setloading(false);
    }
  };

  if (loading || isAuthLoading) {
    return <Spinner />;
  }

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }

  if (mybookings.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>You have no bookings yet...!!</h2>
        <p>Browse our rooms and make a booking today!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
      {mybookings.map((booking, index) => (
        <div
          key={index}
          className="card w-full  bg-base-100 shadow-xl rounded-md"
        >
          <div className="card-body gap-y-4 px-4 py-2 justify-center items-center">
            <h2 className="card-title text-lg font-bold">{booking.room}</h2>
            <div className="flex flex-col gap-2 text-sm">
              <p>
                <b>Booking ID: </b>
                {booking._id}
              </p>
              <p>
                <b>Transaction ID: </b>
                {booking.transactionId}
              </p>
              <p>
                <b>Check In: </b>
                {booking.fromdate}
              </p>
              <p>
                <b>Check Out: </b>
                {booking.todate}
              </p>
              <p>
                <b>Payable Amount: </b>
                {booking.totalAmount}
              </p>
              <p>
                <b>Payment Status: </b>
                {booking.paymentStatus}
              </p>
              <p>
                <b>Status: </b>
                {booking.status === 'pending' ? 'Pending' : 'Confirmed'}
              </p>
              <p>
                Cancellation deadline: <b>{booking.cancellationDeadline}</b>
              </p>
            </div>
          </div>

          <div className="card-actions justify-around px-4 ">
            {booking && booking?.checkCancelDate && (
              <>
                <button
                  className="btn btn-outline btn-accent"
                  onClick={() => handleReport(booking)}
                >
                  Report to Admin
                </button>
                <button
                  className="btn btn-outline btn-accent"
                  onClick={() => handleCancelBooking(booking)}
                >
                  Cancel Booking
                </button>
              </>
            )}
          </div>

          {!booking?.checkCancelDate && (
            <button
              className="btn btn-outline bg-slate-800 text-red-300"
              onClick={() => cancellationHandler(booking)}
            >
              Request for Cancellation
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Profilescreen;
