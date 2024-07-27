import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Main = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
export default Main;
