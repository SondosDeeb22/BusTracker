//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import AddDriver from '../components/ui/addDriver';
import RemoveDriver from '../components/ui/removeDriver';


//======================================================================================
const DriversPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [driverToRemove, setDriverToRemove] = useState<{id: number, name: string} | null>(null);


  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new driver');
    setShowModel(true);
  };

  
  // Case: Driver was Added  ------------------------------------------------
  // close Model windo and show Success message. 
  const handleAddDriverSuccess = () => {
    setShowModel(false);
    setSuccessMessage('Driver was successfully added!');
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






  
  // ------------------------------------------------
  const handleEdit = (driver: any) => {
    console.log('Edit driver:', driver);
    // TODO: Implement edit functionality
  };

  // ------------------------------------------------
  const handleDelete = (driver: any) => {
    console.log('Delete driver:', driver);
    setDriverToRemove({ id: driver.id, name: driver.name || driver.email || 'this driver' });
    setShowRemoveModal(true);
  };

  // Close remove modal
  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setDriverToRemove(null);
  };

  // Handle successful driver removal
  const handleRemoveSuccess = () => {
    setSuccessMessage('Driver was successfully removed!');
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };





  //======================================================================================
  return (
    <>
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md z-50">
          {successMessage}
        </div>
      )}
      <Table
        key={tableKey}
        title="Drivers"
        endpoint="http://localhost:3001/api/admin/drivers/fetch"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />
      {showModel && (
        <AddDriver
          onClose={handleCloseModel}
          onSuccess={handleAddDriverSuccess}
        />
      )}
      {showRemoveModal && driverToRemove && (
        <RemoveDriver
          driverId={driverToRemove.id}
          driverName={driverToRemove.name}
          onClose={handleCloseRemoveModal}
          onSuccess={handleRemoveSuccess}
        />
      )}
    </>
  );
};

export default DriversPage;
