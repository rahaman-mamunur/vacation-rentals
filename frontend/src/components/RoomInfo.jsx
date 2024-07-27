import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from "../components/Spinner";
import useAxiosSecure from "../hook/useAxiosSecure";
import BackButtton from './BackButton';
import Banner from './Banner';
import Error from './Error';

const RoomInfo = () => {
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const axiosSecure = useAxiosSecure();
  const room = rooms.find((item)=> item._id === id)
  // console.log('room', room); 
  // console.log('id is ' , id)
  // console.log('type of id params' , typeof(id)); 
  // console.log('here is rooms ' , rooms)




  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/api/rooms/getallrooms');
        setRooms(res.data);
        // console.log('Fetched rooms data:', res.data); 
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);



  if (!room || loading) {
    // console.log('inside room info spinner ')
    return <Spinner />
  }

  if(!room){
    return <Error  error={'Room not found'}/>
  }

  if(error){
    return <Error error={error} />
  }


  return (
    <>
    
    {/* <Helmet>
        <title>{room?.name} </title>
      </Helmet> */}


    <div className="flex flex-col justify-evenly items-end">
      <BackButtton to={`/home`} />
      <div className="mt-10">
        <span className="font-bold">{room?.name}</span>
        <Banner room={room} />
        <p className="mt-4">{room?.description}</p>
      </div>
    </div>
    
    </>
  );
};

export default RoomInfo;
