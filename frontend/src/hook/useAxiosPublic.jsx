import axios from "axios";

 const axiosPublc = axios.create({
    baseURL: "https://vacation-rentals-eta.vercel.app" || 'https://vacation-rentals-eta.vercel.app'
})


const useAxiosPublic = ()=>{

    return axiosPublc; 
}

export default useAxiosPublic; 