import axios from "axios";

const axiosPublic = axios.create({

    baseURL : 'https://vacation-rentals-eta.vercel.app/' || 'https://vacation-rentals-eta.vercel.app'
})

export default axiosPublic; 