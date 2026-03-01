import OperatingBuses from '../components/buses/operatingBuses';
import ActiveDrivers from '../components/drivers/activeDrivers';
import CoveredRoutes from '../components/routes/coveredRoutes';
import buses from '../assets/buses.png';

const Homepage = () => {
  return (
    <>
    <div className="homepage-container fixed inset-0" style={{ backgroundImage: `url(${buses})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: '-1' }}>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
      
    </div>
        <div className="relative z-10 w-full px-20 pt-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-start">
            <div className="flex flex-col gap-6">
              <OperatingBuses/>

              <ActiveDrivers/>
            </div>

            <div className="min-w-0">
              <CoveredRoutes/>
            </div>
          </div>
        </div>
    </>

  )
}

export default Homepage