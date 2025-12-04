// import './App.css'
import Login from "./pages/login";
import Homepage from "./pages/homepage";
import DriversPage from "./pages/driversPage";
import BusesPage from "./pages/busesPage";
import HomepageLayout from "./layouts/homepageLayout";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/resetPasswordPage";
import SetPassword from "./pages/setPassword";


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
    element: <ResetPassword />
  },
  {
    path:"/set-password",
    element: <SetPassword />
  },
  {
    path: "/",
    element: <HomepageLayout />,
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
      }
    ]
  }
]);


const App = () => {
  
  return <RouterProvider router={router}/>
};

export default App;
