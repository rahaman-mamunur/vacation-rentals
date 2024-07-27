import { createBrowserRouter } from "react-router-dom"
import Main from "../Layout/Main"
import Homescreen from "../components/Homescreen"
import NotFound from "../components/NotFound"
import RoomInfo from "../components/RoomInfo"
import Adminscreen from "../pages/AdminScreen"
import BookingScreen from "../pages/BookingScreen"
import LandingScreen from "../pages/LandingScreen"
import Login from "../pages/Login"
import Profilescreen from "../pages/ProfileScreen"
import SignUp from "../pages/SignUp"
import Try from "../pages/Try"
import AdminRoute from "./AdminRoute"
import PrivateRoute from "./PrivateRoute"

export const router = createBrowserRouter([


    {
        path : '/',
        element : <LandingScreen />
    },
    {
        path: '/try' , 
        element : <Try />
    },

    {
        path: 'home',
        element: <Main />,
        children : [

            {
                path : '/home',
                element: <Homescreen />
            },
            {
                path:'/home/book/viewdetails/:id',
                element: <RoomInfo />
            },
            {
                path: '/home/book/:roomid/:fromdate/:todate',
                element: <PrivateRoute><BookingScreen /></PrivateRoute>
            },
            
           
            {
                path: 'bookings',
                element: <PrivateRoute><Profilescreen /></PrivateRoute>
            }
         
            
            
        ]
    },
    {
        path : 'admin',
        element : <AdminRoute><Adminscreen /></AdminRoute>
    },
    {
        path : 'login',
        element:<Login />
    },
    {
        path: 'signup',
        element: <SignUp />
    },
    {
        path : '*',
        element: <NotFound />
    }
   
    
])