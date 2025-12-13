//===============================================================================================
//? Importing
//===============================================================================================
// import './App.css'
import Login from "./pages/login";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/resetPasswordPage";
import SetPassword from "./pages/setPassword";

import Homepage from "./pages/homepage";
import HomepageLayout from "./layouts/homepageLayout";

import DriversPage from "./pages/driversPage";
import BusesPage from "./pages/busesPage";
import RoutesPage from "./pages/routesPage";
import StationsPage from "./pages/stationsPage";
import BusSchedule from './pages/busSchedule';


import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from "./components/ProtectedRoute";
import ResetPasswordProtection from "./components/ResetPasswordProtection";

//===============================================================================================

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordProtection><ResetPassword /></ResetPasswordProtection>
  },
  // route for drivers to set their initial password (link in validation emails)
  {
    path: "/set-password",
    element: <SetPassword />
  },
  // this is for driver, we don't need it in the web app
  // {
  //   path:"/set-password",
  //   element: <SetPassword />
  // },
  {
    path: "/",
    element: <ProtectedRoute>  <HomepageLayout />  </ProtectedRoute>,
    children: [
      {
        path: "homepage",
        element: <Homepage />
      },
      {
        path: "drivers",
        element: <DriversPage />
      },
      {
        path: "buses",
        element: <BusesPage />
      },
      {
        path: "routes",
        element: <RoutesPage />
      },
      {
        path: "stations",
        element: <StationsPage />
      },
      {
        path: "schedule",
        element: <BusSchedule />
      }
    ]
  }
]);


const App = () => {
  
  return <RouterProvider router={router}/>
};
//===============================================================================================

export default App;
