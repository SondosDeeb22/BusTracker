import Header from '../components/Header';
import {Outlet} from 'react-router-dom';

const HomepageLayout = () => {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default HomepageLayout