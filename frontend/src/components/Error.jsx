import { Link } from 'react-router-dom';
import gif1 from '../assets/no-rooms.gif';

const Error = ({ error }) => {
  return (
    <>
      <div className="col-span-3 text-center">
        <Link to="/" />
        <button className="btn btn-outline btn-error">{error}!!</button>
        <Link />
        <img src={gif1} alt="No Rooms Available" className="mx-auto" />
      </div>
    </>
  );
};
export default Error;
