//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import AddBus from '../components/buses/addBus';

//======================================================================================
const BusesPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);


  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new bus');
    setShowModel(true);
  };

  
  // Case: Bus was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddBusSuccess = () => {
    setShowModel(false);
    setSuccessMessage('Bus was successfully added!');
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // 10 seconds
  };

  // Case : user click close button in the window, so close it
  // Close Model window -----------------------------------------------
  const handleCloseModel = () => {
    setShowModel(false);
  };

  //======================================================================================
  return (
    <>
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      <Table
        key={tableKey}
        title="Buses"
        endpoint="http://localhost:3001/api/admin/buses/fetch"
        onAddNew={handleAddNew}
      />
      {showModel && (
        <AddBus
          onClose={handleCloseModel}
          onSuccess={handleAddBusSuccess}
        />
      )}
    </>
  );
};

export default BusesPage;
