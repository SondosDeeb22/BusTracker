// ============================================================
//? Importing 
// ============================================================
import {Outlet} from 'react-router-dom';
import Navbar from '../components/Navbar';

// ============================================================
const adminPageMainLayout = () => {
  return (
    <>
    <Navbar/>
    <div>adminPageMainLayout</div>
    <Outlet /> 
    </>
  )
}

// ============================================================

export default adminPageMainLayout