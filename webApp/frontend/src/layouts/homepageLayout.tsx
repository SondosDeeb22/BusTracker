// ============================================================
//? Importing
// ============================================================
import Header from '../components/common/Header';
import {Outlet} from 'react-router-dom';

// ============================================================

const HomepageLayout = () => {
  return (
    <>
      <Header/>
      <Outlet/> 
    </>
  )
}

// ============================================================
export default HomepageLayout 