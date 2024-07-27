import axios from "axios";

 const axiosSecure = axios.create({
    baseURL: "https://vacation-rentals-eta.vercel.app" || 'https://vacation-rentals-eta.vercel.app'
})


const useAxiosSecure = ()=>{

    return axiosSecure; 
}

export default useAxiosSecure; 