import { COLORS } from '../styles/colorPalette';

//importing pictures ==============================
import busTrackerLogo from '../assets/busTrackerlogo.png';
import user from '../assets/user.png';

//importing icons ==============================
import { HomeIcon, UserIcon, TruckIcon, MapIcon, CalendarDaysIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Header = () => {
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
            <p className="text-white">Ahmet Hardy</p>
            <img className="h-8 w-8 rounded-full" src={user} alt="User"/>
        </div>
    </header>

    {/* Navigation bar ================================================================================================================ */}
    <nav className="h-12 w-full flex items-center justify-center " style={{ backgroundColor: COLORS.navbar }}>
        <div className="flex justify-between w-full max-w-[80%] mx-auto px-5">
            <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
                <HomeIcon className="h-5 w-5" />
                <span>Homepage</span>
            </a>
            <a href="#" className="flex items-center space-x-2 font-medium transition-colors duration-200" style={{ color: '#374151' }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.burgundy} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
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