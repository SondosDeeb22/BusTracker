// import './App.css'
import Login from "./pages/login";
import Homepage from "./pages/homepage";
import DriversPage from "./pages/driversPage";
import HomepageLayout from "./layouts/homepageLayout";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
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
      }
    ]
  }
]);


const App = () => {
  return <RouterProvider router={router}/>
};

export default App;
