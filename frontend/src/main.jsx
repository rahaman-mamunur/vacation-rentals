import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import AuthProvider from './provider/AuthProvider';
import DataProvider from './provider/DataProvider';
import RoomProvider from './provider/RoomContext';
import { router } from './routes/Routes.jsx';

// import {
//   QueryClient,
//   QueryClientProvider
// } from '@tanstack/react-query';

// const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <AuthProvider>
      <DataProvider>
        <RoomProvider>
          {/* <div className="max-w-screen-xl mx-auto"> */}
          <RouterProvider router={router} />
          {/* </div> */}
        </RoomProvider>
      </DataProvider>
    </AuthProvider>
  </HelmetProvider>

  // <BrowserRouter>
  // <AuthProvider>
  // <BookProvider>
  // <QueryClientProvider client={queryClient}>
  //  {/* <RouterProvider router={router}> */}
  //  <div className="max-w-screen-xl mx-auto">
  //      {/* <App /> */}
  //      <RouterProvider router={router}/>
  //      </div>
  //   {/* </RouterProvider> */}
  // </QueryClientProvider>

  // </BookProvider>
  // </AuthProvider>
  // </BrowserRouter>
);
