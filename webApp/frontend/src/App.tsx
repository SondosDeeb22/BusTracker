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
import BusSchedule from './pages/schedule';
import ServicePatterns from './pages/servicePatterns';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from "./components/ProtectedRoute";
import ResetPasswordProtection from "./components/ResetPasswordProtection";
import SetPasswordProtection from "./components/SetPasswordProtection";
import RouterErrorElement from "./components/RouterErrorElement";
import NotFoundPage from "./components/NotFoundPage";


//===============================================================================================

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <RouterErrorElement />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <RouterErrorElement />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordProtection><ResetPassword /></ResetPasswordProtection>,
    errorElement: <RouterErrorElement />
  },
  // route for drivers to set their initial password (link in validation emails)
  {
    path: "/set-password",
    element: <SetPasswordProtection><SetPassword /></SetPasswordProtection>,
    errorElement: <RouterErrorElement />
  },
 
  {
    path: "/",
    element: <ProtectedRoute>  <HomepageLayout />  </ProtectedRoute>,
    errorElement: <RouterErrorElement />,
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
        path: "service-pattern",
        element: <ServicePatterns />
      },
      {
        path: "schedule",
        element: <BusSchedule />
      },
      
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <RouterErrorElement />
  }
]);


const App = () => {
  
  return <RouterProvider router={router}/>
};
//===============================================================================================

export default App;
