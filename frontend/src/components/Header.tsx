import { COLORS } from '../styles/colorPalette';
import { useState, useEffect } from 'react';
import axios from 'axios';

//importing pictures ==============================
import busTrackerLogo from '../assets/busTrackerlogo.png';
import user from '../assets/user.png';

//importing icons ==============================
import { HomeIcon, UserIcon, TruckIcon, MapIcon, CalendarDaysIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    // Fetch current user data from secure backend API
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/me', {
          withCredentials: true // Important: include cookies
        });
        
        const userData = response.data.data;
        setUserName(userData.userName || 'User');
      } catch (error) {
        setUserName('User');
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <>
    {/* header ================================================================================================================ */}
    <header className="h-20 w-full flex items-center justify-between px-5" style={{ backgroundColor: COLORS.burgundy }}>
        {/* Logo -------------- */}
        <div className="flex items-center space-x-3">
            <img className="h-10 w-10" src={busTrackerLogo} alt="Bus Tracker Logo"/>
            <p className="text-lg font-semibold text-white">Near East University Bus Tracker Admin</p>
        </div>
        
        {/* username and pic -------------- */}
        <div className="flex items-center space-x-2">
            <p className="text-white">{userName}</p>
            <img className="h-8 w-8 rounded-full" src={user} alt="User"/>
        </div>
    </header>

    {/* Navigation bar ================================================================================================================ */}
    <nav className="h-12 w-full flex items-center justify-center " style={{ backgroundColor: COLORS.navbar }}>
        <div className="flex justify-between w-full max-w-[80%] mx-auto px-5">
            <a href="/homepage" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <HomeIcon className="h-5 w-5" />
                <span>Homepage</span>
            </a>
            <a href="/drivers" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <UserIcon className="h-5 w-5" />
                <span>Drivers</span>
            </a>
            <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <TruckIcon className="h-5 w-5" />
                <span>Buses</span>
            </a>
            <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <MapIcon className="h-5 w-5" />
                <span>Routes</span>
            </a>
            <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Bus Schedule</span>
            </a>
            <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <BuildingOfficeIcon className="h-5 w-5" />
                <span>Bus Stations</span>
            </a>
        </div>
    </nav>
    </>
    
  )
}

export default Header;

///! thing from youtube video 

// import { COLORS } from '../styles/colorPalette';
// import { useState, useEffect } from 'react';
// import {Provider, useDispatch, useSelector} from 'react-redux';

// //importing pictures ==============================
// import busTrackerLogo from '../assets/busTrackerlogo.png';
// import user from '../assets/user.png';

// //importing icons ==============================
// import { HomeIcon, UserIcon, TruckIcon, MapIcon, CalendarDaysIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

// //!
// interface User {
//   userid: string;
//   userName: string;
//   userEmail: string;
//   userRole: string;
// }

// interface RootState {
//   userLogin: {
//     userInfo: User | null;
//     loading?: boolean;
//     error?: string;
//   };
// }


// //!--



// const Header = () => {

//     //!nneew
//     const userLogin= useSelector((state: RootState) => state.userLogin);
//     conssnt {userInfo} = userLogin;
//     //!--


// // 
//   const [userName, setUserName] = useState('Loading...');
// // 
//   useEffect(() => {// 
//     // Debug: Log all cookies// 
//     console.log('All cookies:', document.cookie);
//     // 
//     // Get JWT token from cookies// 
//     const getCookie = (name: string) => {// 
//       const nameEQ = name + "=";// 
//       const ca = document.cookie.split(';');// 
//       for(let i = 0; i < ca.length; i++) {// 
//         let c = ca[i];// 
//         while (c.charAt(0) === ' ') {// 
//           c = c.substring(1, c.length);// 
//         }// 
//         if (c.indexOf(nameEQ) === 0) {// 
//           return c.substring(nameEQ.length, c.length);// 
//         }// 
//       }// 
//       return null;// 
//     };
// // 
//     const token = getCookie('loginToken');// 
//     console.log('Token found:', token);
//     // 
//     if (token) {// 
//       try {// 
//         // Debug: Show raw token structure// 
//         console.log('Raw token:', token);// 
//         const tokenParts = token.split('.');// 
//         console.log('Token parts:', tokenParts);
//         // 
//         if (tokenParts.length !== 3) {// 
//           console.error('Invalid JWT structure - should have 3 parts');// 
//           setUserName('User');// 
//           return;// 
//         }
//         // 
//         // Decode JWT token (basic decode without verification for display purposes)// 
//         const payload = JSON.parse(atob(tokenParts[1]));// 
//         console.log('JWT payload:', payload);// 
//         console.log('UserName from payload:', payload.userName);// 
//         setUserName(payload.userName || 'User');// 
//       } catch (error) {// 
//         console.error('Error parsing JWT:', error);// 
//         setUserName('User');// 
//       }// 
//     } else {// 
//       console.log('No token found, using fallback');// 
//       setUserName('User');// 
//     }// 
//   }, []);

//   return (
//     <>
//     {/* header ================================================================================================================ */}
//     <header className="h-20 w-full flex items-center justify-between px-5" style={{ backgroundColor: COLORS.burgundy }}>
//         {/* Logo -------------- */}
//         <div className="flex items-center space-x-3">
//             <img className="h-10 w-10" src={busTrackerLogo} alt="Bus Tracker Logo"/>
//             <p className="text-lg font-semibold text-white">Near East University Bus Tracker Admin</p>
//         </div>
        
//         {/* username and pic -------------- *

//         <div className="flex items-center space-x-2
//             //! new

//             <p className="text-white">{userName}</p>
//             <img className="h-8 w-8 rounded-full" src={user} alt="User"/>
//         </di

//     </header>

//     {/* Navigation bar ================================================================================================================ */}
//     <nav className="h-12 w-full flex items-center justify-center " style={{ backgroundColor: COLORS.navbar }}>
//         <div className="flex justify-between w-full max-w-[80%] mx-auto px-5">
//             <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
//                 <HomeIcon className="h-5 w-5" />
//                 <span>Homepage</span>
//             </a>
//             <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
//                 <UserIcon className="h-5 w-5" />
//                 <span>Drivers</span>
//             </a>
//             <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
//                 <TruckIcon className="h-5 w-5" />
//                 <span>Buses</span>
//             </a>
//             <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
//                 <MapIcon className="h-5 w-5" />
//                 <span>Routes</span>
//             </a>
//             <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
//                 <CalendarDaysIcon className="h-5 w-5" />
//                 <span>Bus Schedule</span>
//             </a>
//             <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
//                 <BuildingOfficeIcon className="h-5 w-5" />
//                 <span>Bus Stations</span>
//             </a>
//         </div>
//     </nav>
//     </>
    
//   )
// }

// export default Header;