import { createContext, useCallback, useEffect, useState } from 'react';
import useAdmin from '../hook/useAdmin';
import useAxiosSecure from "../hook/useAxiosSecure";


export const DataContext = createContext(null); 

const DataProvider = ({children})=>{

    const [bookings, setbookings] = useState([]);
  const [rooms, setrooms] = useState([]);
  const [users, setusers] = useState([]);

  const [reqofcancellation, setreqofcancellation] = useState([]);
  const [admins, setadmins] = useState([]);
  const [isAuth ] = useAdmin(); 



  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const axiosSecure = useAxiosSecure();




  //todo :  bookings 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchBookings =useCallback(async()=>{
        try {
            setloading(true);
            const res = await axiosSecure.get('/api/bookings/getallbookings');
            setbookings(res.data);
            setloading(false);
            return res.data ; 
            
          } catch (error) {
            console.log(error);
            seterror(true);
           
            setloading(false);
          }
      
    } , [axiosSecure])



    // todo : specific id bookings 

    const fetchIdBookings = useCallback(async()=> {

        try {
            setloading(true);
            const res = await axiosSecure.post('/api/bookings/getuserbookings', {
              userid: isAuth?._id,
            });
            // console.log(res.data.length); 
            // console.log(res.data); 
            setloading(false);
            return res.data
          } catch (error) {
            console.log(error); 
            seterror(true);
          
          }

    }, [axiosSecure , isAuth])



    //todo : Rooms 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchRooms = useCallback(async () => {
        try {
          setloading(true);
          const res = await axiosSecure.get('/api/rooms/getallrooms');
          setrooms(res.data);
          setloading(false);
        //   console.log(res.data);
          return res.data
        } catch (error) {
          console.log(error);
          seterror(true);
         
          setloading(false);
        }
      } , [axiosSecure])




      //todo : Users 
      // eslint-disable-next-line react-hooks/exhaustive-deps


const fetchUsers = useCallback(async () => {
    setloading(true);
    seterror(false);
    try {
        const res = await axiosSecure.get('/api/users/getallusers');
        setusers(res.data);
        return res.data ; 
    } catch (error) {
        console.log(error);
        seterror(true);
    } finally {
        setloading(false);
    }
}, [axiosSecure]);



      //todo : Cancel Request
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const fetchCancellationReq = useCallback(async () => {
        try {
          setloading(true);
  
          const res = await axiosSecure.get(
            '/api/bookingCancel/reqofcancellation'
          );
          // console.log('inside of req of cancellation using get method ' , res.data);
          setreqofcancellation(res.data);
          setloading(false);
          return res.data ; 
        } catch (error) {
          console.log(error);
          seterror(true);
          setloading(true);
        }
      } , [axiosSecure])


      // todo : Admin
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const fetchAdmin = useCallback(async () => {
        try {
          setloading(true);
  
          const res = await axiosSecure.get('/api/users/getallusers');
  
          
  
          setadmins(res.data);
          setloading(false);
          return res.data 
        } catch (error) {
          console.log(error);
          seterror(error);
         
          setloading(false);
        }
      } , [axiosSecure])



   

    //todo : reported 

    const fetchReport = useCallback(async ()=>{

      try {

        setloading(true); 

        const res = await axiosSecure.get('/api/report/get-reports')
        // console.log(res.data); 
        setloading(false); 
        return res.data; 
        
      } catch (error) {
        console.log(error); 
       
        setloading(false); 
      }
    } , [axiosSecure])





    useEffect(()=>{
        fetchBookings(); 
        fetchRooms(); 
        fetchUsers(); 
        fetchCancellationReq()
        fetchAdmin(); 
        fetchIdBookings();
        fetchReport(); 


    } , [ fetchBookings , fetchRooms , fetchCancellationReq , fetchAdmin,fetchUsers ,fetchIdBookings , fetchReport ])


    const refetch = {
        bookings : fetchBookings,
        rooms : fetchRooms,
        users : fetchUsers,
        cancelreq : fetchCancellationReq,
        admin : fetchAdmin,
        bookingsById: fetchIdBookings,
        reported : fetchReport , 
    }


    const dataInfo = {
        bookings,
        rooms,
        users,
        reqofcancellation,
        admins,
        loading,
        error,

        refetch,
    }

    return(
        <DataContext.Provider value={dataInfo}>
{children}
        </DataContext.Provider>

    )
}

export default DataProvider; 