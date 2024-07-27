import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Spinner from './Spinner';

const Banner = ({ room }) => {
    // console.log('banner',room)
    if (!room) {
        // console.log('inside banner spinner')
        return <Spinner />;
    }
    // room && console.log('inside  banner room' , room)

    return (
        <Carousel>
            {room && room.imageurls.map((item, index) => (
                <div key={index}>
                    <img src={item} alt={`Image ${index}`} />
                </div>
            ))}
        </Carousel>
    );
};

export default Banner;
