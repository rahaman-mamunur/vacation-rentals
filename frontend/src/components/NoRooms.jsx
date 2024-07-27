import gif1 from '../assets/no-rooms.gif';

const NoRooms = () => {
  return (
    <>
      <div className="col-span-3 text-center">
        <button className="btn btn-outline   btn-error">
          {" Unfortunately, We Couldn't Find Any Rooms Meeting Your Criteria!!"}
        </button>

        <img src={gif1} alt="No Rooms Available" className="mx-auto" />
      </div>
    </>
  );
};
export default NoRooms;
