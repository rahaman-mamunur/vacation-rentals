import { message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import BackButtton from '../components/BackButton';
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import useAdmin from '../hook/useAdmin';
import useAuth from "../hook/useAuth";
import useAxiosPublic from '../hook/useAxiosPublic';
import useAxiosSecure from '../hook/useAxiosSecure';

const BookingScreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()
  const [erroeMessage , setErrorMessage] = useState('')
  const [isAuth , isAuthLoading] = useAdmin(); 
  const {user}= useAuth(); 


  // const user = JSON.parse(localStorage.getItem('currentUser'));

  const fromDateMoment = moment(fromdate, 'DD-MM-YYYY');
  const toDateMoment = moment(todate, 'DD-MM-YYYY');
  const duration = moment.duration(toDateMoment.diff(fromDateMoment));
  const totalDays = duration.asDays() + 1;
  // const totalAmount = parseFloat(totalDays * room.rentperday);
  const [totalAmount, setTotalAmount] = useState(null);
  // console.log(totalDays);

// todo : booking payment component


  // todo ? completed 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {

    if(!user ){
      return navigate('/login')
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get(`/api/rooms/getroombyid/${roomid}`);
        // console.log(res.data);
        setRoom(res.data);
        setTotalAmount(parseFloat(totalDays * res.data.rentperday));
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
 
        if(error.response.status === 404){
          navigate('/not-found')
        }else if(error.response.status ===500){
          setErrorMessage(error.response.data.message)
        }else{
          setErrorMessage('Something went wrong')
        }


        setLoading(false);
      }
    };
    fetchData();
  }, [axiosPublic , roomid , totalDays , navigate  , user]);



  const tokenHanlder = async (token) => {


    // time 

  

// todo  completed 


    const bookingDetails = {
      // user: JSON.parse(localStorage.getItem('currentUser')),
      user: isAuth,
      room,
      fromdate,
      todate,
      totalDays,
      totalAmount,
      token,
    };
    // console.log(token); 

    try {
      setLoading(true); 
      const res = await axiosSecure.post(
        '/api/bookings/bookroom',
        bookingDetails
      );
      message.success('Payment successful!');
      message.success(res.data.message);
      setLoading(false); 
      navigate('/home/bookings')

      // console.log(res.data);
    } catch (error) {
      setError(true);
      console.log(error);
      if(error.response.status === 404){
        navigate('/not-found')
      }else if(error.response.status === 401){
        setErrorMessage(error.response.data.message)
      }
      
      
      else if(error.response.status === 402){
        setErrorMessage(error.response.data.message)
      }
      else if(error.response.status === 403){
        setErrorMessage(error.response.data.message)
      }
      
      else{
        setErrorMessage('Something went wrong ')
      }
      setLoading(false);
    }
  };

  if (!room || isAuthLoading || loading) {
    return <Spinner />;
  }

  if (error && erroeMessage) {
    return <Error error={erroeMessage} />;
  }


  

  // console.log(room.imageurls && room.imageurls[0]);

  return (
    <>
    

<Helmet>
        <title>Vacation Rentalsall | Bookings </title>
      </Helmet>



      {isAuthLoading || loading  ? <Spinner /> : <div>
        <div className="flex flex-col justify-evenly items-end">
          <BackButtton to={`/home`} />
        </div>
        <div>
          <div className="card lg:card-side bg-base-100 shadow-xl">
            {/* Image container with image name */}
            <div className="relative">
              <figure
                className="w-full h-auto overflow-hidden"
                style={{ maxWidth: '700px' }}
              >
                <img
                  src={
                    isAuthLoading || loading ? <Spinner /> : room.imageurls && room.imageurls[0]
                  }
                  alt="Album"
                  className="w-full h-auto"
                />
              </figure>
              <div className="absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white px-4 py-2 text-center">
                <span className="font-bold">{room?.name}</span>
              </div>
            </div>

            {/* Booking details container */}
            <div className="card-body grid grid-cols-4 gap-4">
              {/* Booking details heading */}
              <div className="col-span-4">
                <h2 className="text-lg font-semibold mb-4">Booking Payment Information</h2>
              </div>

              {/* Booking information */}
              <div className="col-span-2">
                <h2 className="card-title"></h2>
                <p>
                  Name: <span className="font-semibold">{isAuth?.name}</span>
                </p>
                <p>
                  Check-in: <span className="font-semibold">{fromdate}</span>
                </p>
                <p>
                  Check-out: <span className="font-semibold">{todate}</span>
                </p>
                <p>
                  Max Count:{' '}
                  <span className="font-semibold">{room?.maxcount}</span>
                </p>
              </div>

              {/* Amount details */}
              <div className="col-span-2">
                {/* <p className="text-gray-800 font-semibold mb-1">Amount</p> */}
                <p>
                  Total Days: <span className="font-semibold">{totalDays}</span>
                </p>
                <p>
                  Rent Per Day:{' '}
                  <span className="font-semibold">{room?.rentperday}</span>
                </p>
                <p>
                Payable Amount:{' '}
                  <span className="text-slate-800 font-bold text-lg"> ৳{totalAmount} /-</span>
                </p>
              </div>

              {/* Pay Now button */}
              <StripeCheckout
                amount={totalAmount * 100}
                token={tokenHanlder}
                stripeKey={import.meta.env.VITE_STRIPE_PK_KEY}
                currency="BDT"
              >
                <div className="col-span-4 flex justify-end">
                  <button className="btn btn-outline btn-accent">
                    Pay Now
                  </button>
                </div>
              </StripeCheckout>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
};
export default BookingScreen;
