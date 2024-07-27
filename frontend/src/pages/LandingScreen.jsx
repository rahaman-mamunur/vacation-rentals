


import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Footer from '../Layout/Footer';
import backgroundImage from "../assets/background.webp";

const LandingScreen = () => {
  return (
    <>




      <Helmet>
        <title>Vacation Rentals | Home</title>
      </Helmet>
      <div
        className="hero min-h-screen w-full absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center', // Centers the image
          backgroundSize: 'cover', // Covers the entire width
          backgroundRepeat: 'no-repeat', // Prevents repeating the image
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-green-300">
              Vacation rentalsall over the world
            </h1>
            <p className="mb-5 text-slate-400 text-2xl">
              Houses, cabins, apartments, and more!
            </p>
            <Link to="/home">
              <button className="btn btn-accent">Get Started</button>
            </Link>
          </div>
        </div>
      </div>

<div className="z-10 footer">

      <Footer />

</div>
    </>
  );
};

export default LandingScreen;
