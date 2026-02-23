import OperatingBuses from '../components/buses/operatingBuses';
import buses from '../assets/buses.png';

const Homepage = () => {
  return (
    <>
    <div className="homepage-container fixed inset-0" style={{ backgroundImage: `url(${buses})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: '-1' }}>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
      
    </div>
        <OperatingBuses/>
    </>

  )
}

export default Homepage