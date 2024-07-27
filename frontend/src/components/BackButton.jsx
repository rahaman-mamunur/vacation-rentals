import { Link } from 'react-router-dom';

import { IoMdArrowRoundBack } from 'react-icons/io';
const BackButtton = ({ to }) => {
  return (
    <div className="flex">
      <Link
        to={to}
        className="bg-sky-800 text-white px-4 py-1 rounded-lg w-fit"
      >
        <IoMdArrowRoundBack className="text-2xl" />
      </Link>
    </div>
  );
};
export default BackButtton;
