import { COLORS } from '../styles/colorPalette';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

//importing pictures ==============================
import BusLogoWhite from '../assets/BusLogoWhite.png';
import user from '../assets/user.png';

//importing icons ==============================
import { HomeIcon, UserIcon, TruckIcon, MapIcon, CalendarDaysIcon, BuildingOfficeIcon, ArrowRightOnRectangleIcon, ChevronDownIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { t } = useTranslation('header');
  const [userName, setUserName] = useState('Loading...');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data from secure backend API
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/user-info', {
          withCredentials: true // Important: include cookies
        });
        
        const userData = response.data.data;
        setUserName(userData.userName || 'User');
      } catch (error) {
        navigate('/', { replace: true });
      }
    };

    fetchCurrentUser();
  }, []);

  // Handle logout ==================================================
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, {
        withCredentials: true
      });
      // Redirect to login page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      
    }finally{
      navigate('/', { replace: true });
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
    {/* header ================================================================================================================ */}
    <header className="h-20 w-full flex items-center justify-between px-5" style={{ backgroundColor: COLORS.burgundy }}>
        {/* Logo -------------- */}
        <div className="flex items-center space-x-3">
            <img className="h-12 w-12" src={BusLogoWhite} alt="Bus Tracker Logo"/>
            <p className="text-lg font-semibold text-white">{t('appName')}</p>
        </div>
        
        {/* language switch + username, pic and dropdown -------------- */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="relative">
         
            <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-white transition-colors duration-200"
                title="User menu"
            >
                <p className="text-white text-sm">{userName}</p>
                <img className="h-8 w-8 rounded-full" src={user} alt="User"/>
                <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <button
                        onClick={() => {
                            handleLogout();
                            setShowDropdown(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200 ease-in-out text-sm font-medium rounded-md active:bg-gray-200"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600" />
                        <span className="whitespace-nowrap">{t('logout')}</span>
                    </button>
                </div>
            )}
          </div>
        </div>
    </header>

    {/* Navigation bar ================================================================================================================ */}
    <nav className="h-12 w-full flex items-center justify-center " style={{ backgroundColor: COLORS.navbar }}>
        <div className="flex justify-between w-full max-w-[80%] mx-auto px-5">
            
            <a href="/homepage" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <HomeIcon className="h-5 w-5" />
                <span>{t('nav.homepage')}</span>
            </a>

            <a href="/drivers" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <UserIcon className="h-5 w-5" />
                <span>{t('nav.drivers')}</span>
            </a>

            <a href="/buses" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <TruckIcon className="h-5 w-5" />
                <span>{t('nav.buses')}</span>
            </a>

            <a href="/routes" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <MapIcon className="h-5 w-5" />
                <span>{t('nav.routes')}</span>
            </a>

            <a href="/stations" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <BuildingOfficeIcon className="h-5 w-5" />
                <span>{t('nav.stations')}</span>
            </a>

            <a href="/service-patterns" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <RectangleStackIcon className="h-5 w-5" />
                <span>{t('nav.servicePatterns')}</span>
            </a>

            
            <a href="/schedule" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <CalendarDaysIcon className="h-5 w-5" />
                <span>{t('nav.schedule')}</span>
            </a>



            
        </div>
    </nav>
    </>
    
  )
}

//================================================================================================================================
export default Header;
