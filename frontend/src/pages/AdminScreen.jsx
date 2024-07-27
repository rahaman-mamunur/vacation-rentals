import { Tabs, message } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdDeleteOutline } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import useAxiosSecure from '../hook/useAxiosSecure';

import { RiAdminFill } from "react-icons/ri";
import useAdmin from '../hook/useAdmin';
import useAuth from "../hook/useAuth";
import useData from '../hook/useData';

const { TabPane } = Tabs;
// const user = JSON.parse(localStorage.getItem('currentUser'));
// console.log(user.name);
function Adminscreen() {
  return (
    <>
    <div className="max-w-screen-xl mx-auto">

<div className="flex justify-between items-center p-5">
   <div className=" flex-1 text-center ">
   <h2 className="m-2 " style={{ fontSize: '35px' }}>
        Admin Panel
      </h2>
   </div>
    <BackButton to="/home"  />

</div>

  
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <div className="row">
            <Bookings />
          </div>
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <div className="row">
            <Rooms />
          </div>
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <Addroom />
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
        <TabPane tab="Request Cancellation " key="5">
          <CancellationReq />
        </TabPane>
        <TabPane tab="Admins " key="6">
          <Admin />
        </TabPane>
        <TabPane tab="Reported Bookings " key="7">
          <ReportedBooking />
        </TabPane>
      </Tabs>
    </div>
    
    </>
  );
}

export default Adminscreen;

export function Bookings() {
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()
  const {refetch} = useData(); 
  const {user} = useAuth(); 


  useEffect(() => {

    if(!user ){
      return navigate('/login')
    }

    const fetchData = async () => {
      try {
        setloading(true);
        const res = await axiosSecure.get('/api/bookings/getallbookings');
        setbookings(res.data);
        setloading(false);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
        seterror(true);
        if (error.response.status === 500) {
          setErrorMessage(error.response.data.message);
        } else if (error.response.status === 404) {
          navigate('/not-found');
        } else {
          setErrorMessage('Something went wrong !!!');
        }
        setloading(false);
      }
    };
    fetchData();
  }, [axiosSecure , navigate , user]);




  // todo : completed 
  const handleBookings = async (id)=>{

    try {

      setloading(true); 
      
      const res = await axiosSecure.delete(`/api/bookings/delete-bookings/${id}`)
      // console.log(res);

      if(res.status === 200){
        message.success(res.data.message)
        const result = await refetch.bookings(); 
        setbookings(result); 
      }else{
        message.error('Failed to delete booking')
      }
  
      setloading(false); 
      
    } catch (error) {
      console.log(error); 
      seterror(true); 
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 404) {
        navigate('/not-found');
      }
      
      else if(error.response.status === 500) {
        setErrorMessage(error.response.data.message)}

      else {
        setErrorMessage('Something went wrong !!!');
      }
      setloading(false); 
    }


  }





  //todo completed 

  const handleStatus = async (item) => {
    // console.log('itesmmmmmmmmm', item);
    try {
      setloading(true);

      const res = await axiosSecure.patch(
        `/api/bookings/booking-status/${item._id}`
      );
      // console.log(res.data);
      if (
        res.data.paymentStatus === 'received' &&
        res.data.status === 'booked'
      ) {
        message.success('Payment Status Updated');
        const result = await refetch.bookings(); 
        setbookings(result); 
      }else{
        message.error('Payment failed !!!')
      }
      setloading(false);

    } catch (error) {
      console.log(error);
      seterror(true);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 404) {
        navigate('/not-found');
      }
      
      else if(error.response.status === 500) {
        setErrorMessage(error.response.data.message)}

      else {
        setErrorMessage('Something went wrong !!!');
      }
      setloading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }


  if (bookings.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>No bookings found</h2>
        <p>There are currently no bookings in the system.</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Vacation Rentalsall | Admin </title>
      </Helmet>
      {loading ? (
        <Spinner />
      ) : (
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>#</th>
              <th>Booking Id</th>
              <th>Customer</th> 
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Action</th>
              <th>Del-Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{booking._id}</td>
                  <td>{booking.email}</td>
                  <td>{booking.room}</td>
                  <td>{booking.fromdate}</td>
                  <td>{booking.todate}</td>
                  <td>
                    <b
                      className={
                        booking.status === 'booked'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }
                    >
                      {booking.status}
                    </b>
                  </td>
                  <td>
                    {booking.status === 'pending' &&
                    booking.paymentStatus === 'pending' ? (
                      <button
                        onClick={() => handleStatus(booking)}
                        className="btn btn-error btn-outline text-xs "
                      >
                        Pending
                      </button>
                    ) : (
                      <b className="text-green-500">{'received'}</b>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleBookings(booking._id)}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

//todo : rooms

export function Rooms() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState(null);
  const {refetch} = useData(); 
  const navigate = useNavigate()
  const {user} = useAuth(); 



  //todo  completed 

  useEffect(() => {

    if(!user ){
      return navigate('/login')
    }

    const fetchData = async () => {
      try {
        setloading(true);
        const res = await axiosSecure.get('/api/rooms/getallrooms');
        setrooms(res.data);
        setloading(false);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
        seterror(true);
        if (error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } else if (error.response.status === 404) {
          navigate('/not-found');
        }
        
        else if(error.response.status === 500) {
          setErrorMessage(error.response.data.message)}
  
        else {
          setErrorMessage('Something went wrong !!!');
        }
        setloading(false);
      }
    };
    fetchData();
  }, [axiosSecure , navigate , user]);

  // todo : refetch after deleted item



  // todo compeleted 


  const handleRooms = async (id) => {
    try {
      setloading(true);
      await axiosSecure.delete(`/api/rooms/delete-rooms/${id}`);
      // console.log(res.data);
      message.success(`Room  has been deleted successfully!`);
      const result = await refetch.rooms(); 
      setrooms(result); 
      setloading(false);
    } catch (error) {
      // console.log(error.response);
      seterror(true);
      if (error.response.status === 500) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 404) {
        navigate('/not-found');
      } else {
        setErrorMessage('Something went wrong !!!');
      }
      setloading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>No rooms available</h2>
        <p>There are currently no rooms available to add.</p>
      </div>
    );
  }
  

  return (
    <>
      <Helmet>
        <title>Vacation Rentalsall | Admin </title>
      </Helmet>
      {loading ? (
        <Spinner />
      ) : (
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>#</th>
              <th>Room Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per day</th>
              <th>Max Count</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td>{item.rentperday}</td>
                  <td>{item.maxcount}</td>
                  <td>{item.phonenumber}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleRooms(item._id)}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

//todo : add room

const img_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`


export function Addroom() {
  const [room, setroom] = useState('');
  const [rentperday, setrentperday] = useState('');
  const [maxcount, setmaxcount] = useState('');
  const [description, setdescription] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [type, settype] = useState('');
  const [images , setimages] = useState(null);  // Changed from individual image states to a 
  // const [imageUrls, setImageUrls] = useState([]); // State to hold the image URLs

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()
  const {user} = useAuth(); 



  useEffect(()=>{

    if(!user ){
      return navigate('/login')
    }
  } , [user , navigate])



  //todo completed 

  const addRoom = async (e) => {
    e.preventDefault();

    if (!images) {
      return message.error('Please select images.');
    }
  
    if (!room) {
      return message.error('Room is needed.');
    }
  
    if (!rentperday) {
      return message.error('Rent per day is required.');
    }
  
    if (!maxcount) {
      return message.error('Max count is required.');
    }
  
    if (!description) {
      return message.error('Description is required.');
    }
  
    if (!phonenumber) {
      return message.error('Location is required.');
    }
    
    if (!type) {
      return message.error('Type is required.');
    }


    try {
      setloading(true);

      // import to imgdb 

      const uploadedImageUrls = []

     for(let i=0 ; i<images.length ; i++){
      const formData = new FormData(); 
      formData.append('image' , images[i])
      // console.log('form data value ' , formData)

      // send to imgdb server 

      const imgBBRes = await axiosSecure.post(img_hosting_api , formData , {

        headers: {
          'content-type': 'multipart/form-data',
        },
      })

     if(imgBBRes.status === 200){
      uploadedImageUrls.push(imgBBRes.data.data.url); 
     }else{
      message.error(`Failed to upload image ${i+1}`)
      return; 
     }

      // console.log( 'imgbbresss filesss ',imgBBRes); 

     }

    //  console.log('upload images url inside addroom' , uploadedImageUrls)

      const roomobj = {
        room,
        rentperday: parseFloat(rentperday),
        maxcount: parseInt(maxcount),
        description,
        phonenumber,
        type: type.trim(),
        images:  uploadedImageUrls
        // image1,
        // image2,
        // image3,
      };
      const res = await axiosSecure.post('/api/rooms/addroom', roomobj);

      if(res.status === 201){
        message.success(res.data.message)

      
      }else{
        message.error('Failed to add room')
      }


      setloading(false);
      setroom('');
      setrentperday('');
      setmaxcount('');
      setdescription('');
      setphonenumber('');
      settype('');
      // setimage1('');
      // setimage2('');
      // setimage3('');
      setimages(null); 
      // console.log(res);

    } catch (error) {
      console.log(error);
      seterror(true);
      if (error.response  && error.response.status === 500) {
        setErrorMessage(error.response.data.message);
      } else if (error.response  && error.response.status === 404) {
        navigate('/not-found');
      } else {
        setErrorMessage('Something went wrong !!!');
      }
      setloading(false);
    }

    // Clear form fields
  
  };

  if (loading) {
    return <Spinner />;
  }

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }

  
  

  return (
    <>
      <Helmet>
        <title>Vacation Rentalsall | Admin </title>
      </Helmet>

      <div className="max-w-xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="input"
              placeholder="Room Name"
              value={room}
              onChange={(e) => setroom(e.target.value)}
            />
            <input
              type="number"
              className="input"
              placeholder="Rent per Day"
              value={rentperday}
              onChange={(e) => setrentperday(e.target.value)}
            />
            <input
              type="number"
              className="input"
              placeholder="Max Count"
              value={maxcount}
              onChange={(e) => setmaxcount(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
            <input
              type="tel"
              className="input"
              placeholder="Location"
              value={phonenumber}
              onChange={(e) => setphonenumber(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Type"
              value={type}
              onChange={(e) => settype(e.target.value)}
            />
            {/* <input
              type="text"
              className="input"
              placeholder="Image URL 1"
              value={image1}
              onChange={(e) => setimage1(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Image URL 2"
              value={image2}
              onChange={(e) => setimage2(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Image URL 3"
              value={image3}
              onChange={(e) => setimage3(e.target.value)}
            /> */}

          <input 
          
          type="file" 
          className = "input"
          multiple 
          onChange = {(e) => setimages(e.target.files)}
          
          />




          </div>

          <button
            className="btn btn-primary w-full bg-slate-600 mb-4"
            onClick={addRoom}
          >
            Add Room
          </button>
        </form>
      </div>
    </>
  );
}


// todo : for users

export function Users() {
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()
  const {refetch} = useData(); 
  const [isAuth] = useAdmin(); 
  const {user} = useAuth(); 



  //todo completed 

  useEffect(() => {

    if(!user){
      return navigate('/login')
    }


    const fetchData = async () => {
      try {
        setloading(true);

        const res = await axiosSecure.get('/api/users/getallusers');

        

        setusers(res.data);
        setloading(false);
      } catch (error) {
        console.log(error);
        seterror(error);
        if (error.response.status === 500) {
          setErrorMessage(error.response.data.message);
        } 
       else if (error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } 
        
        else if (error.response.status === 404) {
          navigate('/not-found');
        } else {
          setErrorMessage('Something went wrong !!!');
        }
        setloading(false);
      }
    };
    fetchData();
  }, [axiosSecure , navigate , user]);




  // todo completed 
  // delete user 

  const handleUser = async(id)=>{

 
    if(isAuth && isAuth.isAdmin){

      try {

        setloading(true); 
        const res = await axiosSecure.delete(`/api/users/delete-user/${id}`)
        // console.log(res.data); 
        if(res.status === 201){
          message.success(res.data.message)
          const result = await refetch.users(); 
          setusers(result); 
        }else{
          message.error('Failed to user deleted ')
        }
        setloading(false); 
      } catch (error) {
        console.log(error); 
        seterror(true); 
        if (error.response.status === 401) {
          setErrorMessage(error.response.data.message);
        } else if (error.response.status === 404) {
          navigate('/not-found');
        }
        
        else if(error.response.status === 500) {
          setErrorMessage(error.response.data.message)}
  
        else {
          setErrorMessage('Something went wrong !!!');
        }
  
        setloading(false); 
      }

    }

  

  }


  // update admin acces 

  const handleAdminAccess = async(id)=>{

    try {

      setloading(true); 
      const res = await axiosSecure.patch(`/api/users/admin-status/${id}`)
      // console.log(res.data); 
      if(res.status === 201){
        message.success(res.data.message)
        const result = await refetch.users()
        setusers(result)
       
    
      }else{
        message.error('Failed to update !!')
      }
      setloading(false); 

    } catch (error) {
      console.log(error); 
      seterror(true); 
      if (error.response.status === 401) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 404) {
        navigate('/not-found');
      }
      
      else if(error.response.status === 500) {
        setErrorMessage(error.response.data.message)}

      else {
        setErrorMessage('Something went wrong !!!');
      }
      setloading(false); 
    }
  }



  if (loading) {
    return <Spinner />;
  }

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }


  if (users.length === 0 ) {
    return (
      <div className="text-center mt-5">
        <h2>No users found</h2>
        <p>There are currently no users in the system.</p>
      </div>
    );
  }
  



  let indexer =1; 

  return (
    <>
    {/* {JSON.stringify(users)} */}
      <Helmet>
        <title>Vacation Rentalsall | Admin </title>
      </Helmet>
      <div className="row">
        {loading && <Spinner />}

        <div className="col-md-10">
          <table className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>isAdmin</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
        {loading ? (<Spinner />) : ( users &&
                users.map((user, index) => {
                  if(!user.isAdmin){
             
                    return (
                      <tr key={index+1}>
                        <td>{indexer++}</td>
                        <td>{ 
                        user.name}</td>
                        <td>{user.email}</td>
                        <td ><b className={user.isAdmin ? 'text-red-400' : 'text-green-400'}>{user.isAdmin ? <RiAdminFill className="text-xl"/>: 
                        
                        
                      <button className="btn btn-outline btn-error" onClick={()=> handleAdminAccess(user._id)}>Access</button>
                        
                        
                        
                        
                        }</b></td>
                        <td>
  
                          <button className="btn btn-outline btn-error" onClick={()=> handleUser(user._id)}>
  
                          <MdDeleteOutline /> 
                          </button>
  
  
  
                        </td>
                      </tr>
                    );
                  }




                }))  }

             
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const CancellationReq = () => {
  const [reqofcancellation, setreqofcancellation] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const {refetch} = useData(); 
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState(null);
  const {user} = useAuth(); 



  useEffect(() => {
    if(!user ){
      return navigate('/login')
    }
    const fetchData = async () => {
      try {
        setloading(true);

        const res = await axiosSecure.get(
          '/api/bookingCancel/reqofcancellation'
        );
        // console.log('inside of req of cancellation using get method ' , res.data);
        setreqofcancellation(res.data);
        setloading(false);
      } catch (error) {
        console.log(error);
        seterror(true);
        setloading(true);
      }
    };
    fetchData();
  }, [axiosSecure , user ,navigate]);

  const handleCancelReq = async (item) => {

    // console.log('handle cancelReq' , item); 
    try {
      setloading(true)

      const res = await axiosSecure.post(`/api/bookingCancel/reqofcancellation-accepted` , {

        id : item._id,
        bookingid : item.bookingid,
        roomid : item.bookingInfo.roomid,

      })

      if(res.status === 201){
        message.success(res.data); 
        const result = await refetch.cancelreq(); 
        setreqofcancellation(result); 

      }else{
        message.success('Something phissing !!!')
      }

      setloading(false); 

      
    } catch (error) {
      console.log(error)
      seterror(true); 
      setloading(false);
      
      if(error.response.status === 400){
        message.error(error.response.data) 
      }else if(error.response.status === 404){
        navigate('/not-found')
      }
      else if(error.response.status === 701){
        setErrorMessage(error.response.data.message)
      }
      
      else if(error.response.status === 702){
        setErrorMessage(error.response.data.message)
      }
      else if(error.response.status === 703){
        setErrorMessage(error.response.data.message)
      }

      
      else{
        setErrorMessage('Something went wrong')
      }
    }



  };


  if(loading){
    return <Spinner />
  }

  if(error && errorMessage){
    return <Error error={errorMessage} />
  }


  if (reqofcancellation.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>You have no cancellation requests yet...!!</h2>
        <p>Check back later for updates.</p>
      </div>
    );
  }


  return (
    <>

      {loading ? (
        <Spinner />
      ) : (
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Booking Id</th>
              <th>Customerid</th>
              <th>Transaction Id</th>
              <th>Check-in</th>
              <th>Status</th>
              <th>Cancellation Deadline</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reqofcancellation.map((item, index) => (
              <tr key={index} className="text-center">

                {item?.bookingInfo  ? ( <><td><b>{item?.bookingid}</b></td>
             <td><b>{item?.bookingInfo?.userid }</b></td>
                  <td><b>{item?.bookingInfo?.transactionId }</b></td>
                  <td><b>{item?.bookingInfo?.fromdate }</b></td>
                  <td><b className={item?.bookingInfo?.status === 'booked' ? 'text-green-500' : 'text-red-500'} >{item?.bookingInfo?.status }</b></td>
                  <td className="text-center"><b className={item?.bookingInfo?.cancellationDeadline === 'Expired' ? 'text-red-500 ' : 'text-black' } >{item.bookingInfo.cancellationDeadline }</b></td>
                  <td><b className={item?.bookingInfo?.paymentStatus === 'received' ? 'text-green-500' : 'text-red-400'} >{item?.bookingInfo?.paymentStatus }</b></td>
                  <td>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleCancelReq(item)}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td> </>) : (<><td><b>{item?.bookingid}</b></td>
             <td><b>{ 'N/A'}</b></td>
                  <td><b>{ 'N/A'}</b></td>
                  <td><b>{ 'N/A'}</b></td>
                  <td><b  >{ 'N/A'}</b></td>
                  <td className="text-center"><b  >{'N/A'}</b></td>
                  <td><b >{ 'N/A'}</b></td>
                  <td>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleCancelReq(item)}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>  </>)}
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};


// todo : Admin

export function Admin() {
  const [admins, setadmins] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()
  const {refetch} = useData(); 
  const {user} = useAuth();  



  //todo completed 

  useEffect(() => {

    if(!user ){
      return navigate('/login')
    }
    const fetchData = async () => {
      try {
        setloading(true);

        const res = await axiosSecure.get('/api/users/getallusers');

        

        setadmins(res.data);
        setloading(false);
      } catch (error) {
        console.log(error);
        seterror(error);
        if (error.response.status === 500) {
          setErrorMessage(error.response.data.message);
        } 
       else if (error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } 
        
        else if (error.response.status === 404) {
          navigate('/not-found');
        } else {
          setErrorMessage('Something went wrong !!!');
        }
        setloading(false);
      }
    };
    fetchData();
  }, [axiosSecure , navigate , user]);




  // todo completed 
  // delete user 

  // const handleAdmin = async(id)=>{

  //   try {

  //     setloading(true); 
  //     const res = await axiosSecure.delete(`/api/users/delete-user/${id}`)
  //     console.log(res.data); 
  //     if(res.status === 201){
  //       message.success(res.data.message)
  //     }else{
  //       message.error('Failed to user deleted ')
  //     }
  //     setloading(false); 
  //   } catch (error) {
  //     console.log(error); 
  //     seterror(true); 
  //     if (error.response.status === 401) {
  //       setErrorMessage(error.response.data.message);
  //     } else if (error.response.status === 404) {
  //       navigate('/not-found');
  //     }
      
  //     else if(error.response.status === 500) {
  //       setErrorMessage(error.response.data.message)}

  //     else {
  //       setErrorMessage('Something went wrong !!!');
  //     }

  //     setloading(false); 
  //   }

  // }


  // update admin acces 

  // const handleAdminAccess = async(id)=>{

  //   try {

  //     setloading(true); 
  //     const res = await axiosSecure.patch(`/api/users/admin-status/${id}`)
  //     console.log(res.data); 
  //     if(res.status === 201){
  //       message.success(res.data.message)
  //     }else{
  //       message.error('Failed to update !!')
  //     }
  //     setloading(false); 

  //   } catch (error) {
  //     console.log(error); 
  //     seterror(true); 
  //     if (error.response.status === 401) {
  //       setErrorMessage(error.response.data.message);
  //     } else if (error.response.status === 404) {
  //       navigate('/not-found');
  //     }
      
  //     else if(error.response.status === 500) {
  //       setErrorMessage(error.response.data.message)
  //       }

  //     else {
  //       setErrorMessage('Something went wrong !!!');
  //     }
  //     setloading(false); 
  //   }
  // }


  const handleAdmin = async (id)=>{

    try {
      setloading(true); 
      const res = await axiosSecure.delete(`/api/users/delete-user/${id}`)
      // console.log(res.data); 
      if(res.status === 201){
        message.success(res.data.message); 
        const result = await refetch.admin(); 
        setadmins(result); 
      }else{
        message.error('Users not found')
      }
      setloading(false); 
    } catch (error) {
      console.log(error); 
      seterror(true); 
      if(error.response.status === 404){
        navigate('/not-found')
      }else if(error.response.status === 401){
        message.error(error.response.data.message); 
      }else if(error.response.status === 500){
        setErrorMessage(error.response.data.message)
      }else{
        setErrorMessage('Something went wrong')
      }
      setloading(false); 
    }

  }


  if (loading) {
    return <Spinner />;
  }

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }



  if (admins.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>No admin users found</h2>
        <p>There are currently no admin users in the system.</p>
      </div>
    );
  }

  // to maintain index number (id);

  let indexer = 1; 

  return (
    <>
    {/* {JSON.stringify(users)} */}
      <Helmet>
        <title>Vacation Rentalsall | Admin </title>
      </Helmet>
      <div className="row">
        {loading && <Spinner />}

        <div className="col-md-10">
          <table className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>isAdmin</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
        {loading ? (<Spinner />) : ( admins &&
                admins.map((admin, index) => {
                 
                  if(admin.isAdmin){
                    return (
                      <tr key={index}>
                        <td>{indexer++}</td>
                        <td>{ 
                        admin.name}</td>
                        <td>{admin.email}</td>
                        <td ><b className={admin.isAdmin ? 'text-red-400' : 'text-green-400'}>{admin.isAdmin && <RiAdminFill className="text-xl"/>
                        
                        
                
                        
                        
                        }</b></td>
                        <td>
  
                          <button className="btn btn-outline btn-error" onClick={()=> handleAdmin(admin._id)}>
  
                          <MdDeleteOutline /> 
                          </button>
  
  
  
                        </td>
                      </tr>
                    );
                  }




                }))  }

             
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}


//todo : reported bookings 

export function ReportedBooking(){


  const [reports, setreports] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate(); 
  const {refetch} = useData(); 
  const {user} = useAuth(); 

  useEffect(()=>{

    if(!user ){
      return navigate('/login')
    }

    const fetchData = async ()=>{

      try {

        setloading(true); 

        const res = await axiosSecure.get('/api/report/get-reports')
        // console.log('get reports ' , res.data); 
        setreports(res.data); 
        setloading(false); 
        
      } catch (error) {
        console.log(error); 
        seterror(true)
        error.response.status === 500 ? setErrorMessage(error.response.data.message)  : error.response.status === 404 ? navigate('/not-found') : setErrorMessage('Something went wrong')
        setloading(false); 
      }
      
    }
    fetchData(); 

  } , [axiosSecure , navigate , user])

  
  
  
  
  const handleReport = async(id)=>{

    // console.log('reported id ' , id); 

   
    try {
      setloading(true);
      const res = await axiosSecure.get(`/api/report/delete-reports/${id}`);
      // console.log(res.data); 
      if (res.status === 201) {
        message.success(res.data.message);
        const result = await refetch.reported(); 
        setreports(result); 
      } else {
        message.error('Something phishing');
      }
    } catch (error) {
      console.log(error); 
      seterror(true); 
      error.response.status === 500 ? setErrorMessage(error.response.data.message) : error.response.status === 404 ? navigate('/not-found') : error.response.status === 701 ? setErrorMessage(error.response.data.message) : error.response.status === 702 ? setErrorMessage(error.response.data.message) : setErrorMessage('Something went wrong !!!');
    } finally {
      setloading(false); // Ensure loading state is reset after the try/catch block
    }
  }


  if(loading){
    return <Spinner />
  }

  if(error && errorMessage){
    return <Error error={errorMessage} />
  }

  if(reports.length === 0){
    return(
      <>
      <div className="text-center mt-5">
        <h2>No Reported Bookings found</h2>
        <p>There are currently no  reported bookings in the system !!!</p>
      </div>
      
      </>
    )
  }

  return (

    <>

<Helmet>
        <title>Vacation Rentalsall | Admin </title>
      </Helmet>
    {loading ? <Spinner /> : 
    
    ( <>
    
    <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Reported Id</th>
              <th>Booking Id</th>
              <th>Customer</th> 
              <th>Room</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports && reports.map((report, index) => {

              // console.log('reporsts value ' , report)

              return (
                <tr key={index}>
                  <td>{report._id}</td>
                  <td>{report.booking?._id}</td>
                  <td>{report.booking?.email}</td>
                  <td>{report.booking?.room}</td>
             
                  <td>
                    <b
                      className={
                        report.booking.status === 'booked'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }
                    >
                      {report.booking?.status}
                    </b>
                  </td>
                  
                  <td>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleReport(report._id)}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
    
    
     </>
  
  
  )
    
    
    }
    
    </>
  )
}