import React from 'react';

import busTrackerLogo from '../assets/busTrackerLogo.png'
import user from '../assets/user.png';
const Navbar = () => {
  return (
    <nav>
        {/* the header ======================================= */}
        <div className="bg-red-900 h-18 w-full flex items-center"> {/*flex items-center justify-between*/}
            {/* <div className="flex items-center space-x-3"> */}
                <img className="h-10 w-10" src={busTrackerLogo} alt=""/>
                <p className="text-white ">NEU Bus Tracker</p>
            {/* </div> */}
            {/* user data -------------------------------- */}
            {/* <div className="flex items-center space-x-2">
                <p className="text-white">userName</p>
                <img className="h-8 w-8 rounded-full" src={user} alt="" />
            </div> */}


        </div>
        {/* Navigation bar ======================================= */}
        <div className="Navbar">


        </div>
    </nav>
  )
}

export default Navbar