import { createContext, useEffect, useState } from 'react';
import useAxiosPublic from '../hook/useAxiosPublic';

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get('/api/rooms/getallrooms');
        setRooms(res.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosPublic]);

  const refetch = () => {
    axiosPublic
      .get('/api/rooms/getallrooms')
      .then((res) => {
        setRooms(res.data);

        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const roomInfo = {
    rooms,
    loading,
    refetch,
    error,
    setRooms,
  };

  return (
    <RoomContext.Provider value={roomInfo}>{children}</RoomContext.Provider>
  );
};
export default RoomProvider;
