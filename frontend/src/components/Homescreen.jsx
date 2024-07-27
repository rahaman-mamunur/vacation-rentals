import { DatePicker, message } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../hook/useAdmin';
import useAuth from "../hook/useAuth";
import useAxiosPublic from '../hook/useAxiosPublic';
import Error from './Error';
import NoRooms from './NoRooms';
import Room from './Room';
import Spinner from './Spinner';

const { RangePicker } = DatePicker;

const Homescreen = () => {
  // const { rooms, loading, error } = useContext(RoomContext);
  const [fromdate, setFromDate] = useState('');
  const [todate, setToDate] = useState('');
  const [rooms, setRooms] = useState([]);
  const [duplicatehotes, setduplicatehotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fildate , setfildate] = useState([])
  const [filsearch , setfilsearch] = useState('')
  const [filtype , setfiltype] = useState('all')
  const [error, setError] = useState(false);
  const axiosPublic = useAxiosPublic();
const [ ,isAuthLoading] = useAdmin(); 
const {  loading: userLoading} = useAuth()

  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // todo : '/api/rooms/getallrooms' ==> completed

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await axiosPublic.get('/api/rooms/getallrooms');
        setRooms(res.data);
        setduplicatehotes(res.data);
        setError(false);
        setLoading(false);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
        setError(true);

        if (error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } else if (error.response.status === 404) {
          navigate('/not-found');
        } else {
          setErrorMessage('Something went wrong !!!');
        }

        setLoading(false);
      }
    };

    fetchData();
  }, [axiosPublic, navigate]);



  
  // disabled all before dates from current dates

  const disabledDate = (current) => {
    const currentDate = moment().add(1, 'days');

    // console.log('current' , current._d); 
    // console.log('current start of ' , currentDate.startOf('day'))

    if(current && current < currentDate.startOf('day')){
      return true; 
    }


    // disabled accordingt to filtered date

  



  };

  function filterByDate(dates) {
    // console.log('Selected dates:', dates);
    const fromDateFormatted = dates[0]
      ? moment(dates[0]).format('DD-MM-YYYY')
      : '';
    const toDateFormatted = dates[1]
      ? moment(dates[1]).format('DD-MM-YYYY')
      : '';
    // console.log(fromDateFormatted);
    // console.log(toDateFormatted);
    setFromDate(fromDateFormatted);
    setToDate(toDateFormatted);




    /// just betwen days 

   

    var temp = [];

    for (var room of duplicatehotes) {
      
      // console.log('rooomss' , room)
      var availability = true;

      // console.log('inside 0');

      for (var booking of room.currentbookings) {

       
        // console.log('bookinggggggggg', booking);
        const bstartdate = moment(booking.fromdate, 'DD-MM-YYYY');  
        const benddate = moment(booking.todate, 'DD-MM-YYYY');


        const userstartdate = moment(fromDateFormatted, 'DD-MM-YYYY');
        const userenddate = moment(toDateFormatted, 'DD-MM-YYYY');
    
        // console.log('user start date', userstartdate);
        // console.log('user end date', userenddate);
        // console.log('b start date', bstartdate.format('DD-MM-YYYY'));
        // console.log('b end date', benddate.format('DD-MM-YYYY'));
    
        // console.log('inside 1...5');
    
        // Check if user's start date and end date are between booking's start and end dates
        // console.log('checkerr 1', userstartdate.isBetween(bstartdate, benddate, null, []));
        // console.log('checkerr 2', userenddate.isBetween(bstartdate, benddate, null, []));

        if (
          userstartdate.isBetween(bstartdate, benddate, null, []) &&
          userenddate.isBetween(bstartdate, benddate, null, [])
        ) {
          // console.log('inside 1');

          if (
            userstartdate.isSame(bstartdate) ||
            userenddate.isSame(benddate) ||
            userstartdate.isSame(benddate) ||
            userenddate.isSame(bstartdate)
          ) {
            // console.log('inside 2');

            if (
              (userstartdate.isSameOrAfter(bstartdate) &&
                userstartdate.isSameOrBefore(benddate)) ||
              (userenddate.isSameOrAfter(bstartdate) &&
                userenddate.isSameOrBefore(benddate))
            ) {
              // console.log('inside 3');

              availability = false;
              break; 
            }
          }
        }
      }

      if (availability) {
        temp.push(room); // Add room to the list if it's available
      }
    }
    setRooms(temp); // Update the state with the filtered list of available rooms
    setfildate(temp); 

    
    
    
    
    
    
    
    
  


    
  }

  const filterBySearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    // console.log('serach value ' , e.target.value); 
    setfilsearch(searchValue); 

    const temp = duplicatehotes.filter((room) =>
      room.name.toLowerCase().includes(searchValue)
    );
    // console.log('tempppppp', temp);
    setRooms(temp);
  };

  const filterByType = (e) => {
    const tag = e.target.value.toLowerCase().trim();
    // console.log('taggggggggggg', tag);
    setfiltype(e.target.value); 

    if (tag === 'all') {
      setRooms(duplicatehotes);
    } else {
      const filteredtag = duplicatehotes.filter(
        (room) => room.type.toLowerCase() === tag.toLowerCase() 
      );
      // console.log('filtertagggggggggg', filteredtag);
      setRooms(filteredtag);
    }
  };


  const handleSearch= ()=>{

    // console.log('filter by date' , fildate); 
    // console.log('filter by type' , filtype); 
    // console.log('filter by search ' , filsearch); 

    if(!fildate || !filtype || !filsearch){
      message.error('Missing required fields..!! ')
      return ; 
    }
    
    const temp = fildate.filter((item)=>{

      if(filtype === 'all'){

        return item.name.toLowerCase().includes(filsearch.toLowerCase() )
        
      }else{
        return item.type.toLowerCase() === filtype.toLowerCase() && item.name.toLowerCase().includes(filsearch)
        
      }

    })

    // console.log(temp); 
    setRooms(temp);  
    setfilsearch('');
    setfiltype('all');


  }


  const getUniqueRoomTypes = (room)=>{

    let uniqueTypes = []

    room.forEach((item)=> {


      if(!uniqueTypes.includes(item.type.toLowerCase().trim())){
        // console.log('inside get unique types value ' , item.type)
        uniqueTypes.push(item.type.toLowerCase().trim())
      }
      // console.log('unique types array ' , uniqueTypes)
    })

    return uniqueTypes; 

  }


  if (!rooms || isAuthLoading || userLoading) {
    return <Spinner />;
  }

  if (error && errorMessage) {
    return <Error error={errorMessage} />;
  }

  // todo : completed error validation

  return (
    <>
      <Helmet>
        <title>Vacation Rentalsall | Home </title>
      </Helmet>
      <div className="flex justify-between items-center mt-5 mb-5 gap-10">
        <div className="w-1/4">
          <RangePicker
            onChange={filterByDate}
            format="DD-MM-YYYY"
            className="h-10 w-full"
            disabledDate={disabledDate}
          />
        </div>

        <div className="w-2/4">
          <input
            type="text"
            className="h-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Search rooms"
            value={filsearch}
            onChange={filterBySearch}
          />
        </div>


      
      
      

  <div className="w-1/4" >
          <select
            className="h-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={filtype}
            onChange={filterByType}
          >
            <option value="all">All</option>
            {loading ? (<Spinner />) : (rooms.length > 0 ? 
              

              (


                getUniqueRoomTypes(duplicatehotes).map((item , index)=>  <option key={index} value={item}>{item}</option>)







              )
              
              
              
              
              
              
              : <><NoRooms /></>)}
            {/* <option value={item.type}>{item.type}</option> */}
            {/* <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option> */}
          </select>
        </div>
    
      
    
        
        
        


{/* 
        <div className="w-1/4">
          <select
            className="h-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={filtype}
            onChange={filterByType}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div> */}
        <button onClick={handleSearch} className="btn btn-outline ">Search</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <Spinner />
        ) : rooms.length > 0 ? (
          rooms.map((room, index) => {
            return (
              <Room
                key={index}
                room={room}
                fromdate={fromdate}
                todate={todate}
              />
            );
          })
        ) : (
          <>
            <NoRooms />
          </>
        )}
      </div>
    </>
  );
};
export default Homescreen;
