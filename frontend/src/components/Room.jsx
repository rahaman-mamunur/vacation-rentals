  // todo checker completed


  import { Link } from 'react-router-dom';
import Error from "../components/Error";

  const Room = ({ room, fromdate, todate }) => {


    if(!room){
      return <Error error={'Room information is not availabe ..!!'} />
    }


    return (
      <>
       





<div className="card bg-base-100 shadow-xl flex flex-row m-4">
        <figure className="w-1/3">
          <img src={room.imageurls && room.imageurls[0]} alt="Room" />
        </figure>
        <div className="card-body p-4 w-2/3">
          <h2 className="card-title">
            {room.name}
            <div className="badge badge-secondary bg-slate-600">{room.type}</div>
          </h2>
          <p>
            <span className="font-bold">Max Count:</span> {room.maxcount}
          </p>
          <p>
            <span className="font-bold">Location</span> {room.phonenumber}  
          </p>
          <div className="card-actions justify-end mt-4">
            {fromdate && todate ? (
              <Link to={`/home/book/${room._id}/${fromdate}/${todate}`}>
                <button className="btn btn-outline btn-accent">Book Now</button>
              </Link>
            ) : (
              <button disabled className="btn  btn-outline btn-accent">
                Book Now
              </button>
            )}

            <Link to={`/home/book/viewdetails/${room._id}`}>
              <button className="btn  btn-outline btn-accent">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
      </>
    );
  };
  export default Room;
