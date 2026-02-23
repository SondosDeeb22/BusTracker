//===============================================================================================
//? Importing
//===============================================================================================


// auth pages --------------------------------------------------
import Login from "./pages/auth/login";
import ForgotPassword from "./pages/auth/ForgotPasswordPage";
import ResetPassword from "./pages/auth/resetPasswordPage";
import SetPassword from "./pages/auth/setPassword";

// protected pages --------------------------------------------------
import Homepage from "./pages/homepage";
import HomepageLayout from "./layouts/homepageLayout";


import DriversPage from "./pages/driversPage";
import BusesPage from "./pages/busesPage";
import RoutesPage from "./pages/routesPage";
import StationsPage from "./pages/stationsPage";
import BusSchedule from './pages/schedule';
import ServicePatterns from './pages/servicePatterns';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// components --------------------------------------------------
import ProtectedRoute from "./components/common/auth/ProtectedRoute";
import ResetPasswordProtection from "./components/common/auth/ResetPasswordProtection";
import SetPasswordProtection from "./components/common/auth/SetPasswordProtection";
import RouterErrorElement from "./components/common/errors/RouterErrorElement";
import NotFoundPage from "./components/common/errors/NotFoundPage";


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
