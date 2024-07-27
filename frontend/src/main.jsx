import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import AuthProvider from './provider/AuthProvider';
import DataProvider from './provider/DataProvider';
import RoomProvider from './provider/RoomContext';
import { router } from './routes/Routes.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <AuthProvider>
      <DataProvider>
        <RoomProvider>
          <RouterProvider router={router} />
        </RoomProvider>
      </DataProvider>
    </AuthProvider>
  </HelmetProvider>
);
