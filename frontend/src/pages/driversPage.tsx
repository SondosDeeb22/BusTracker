//======================================================================================
//? Importing
//======================================================================================
import { useState } from 'react';
import Table from '../components/Table';
import AddDriver from '../components/ui/addDriver';


//======================================================================================
const DriversPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tableKey, setTableKey] = useState(0);

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
    // TODO: Implement delete functionality
  };

  // Open Model window------------------------------------------------
  const handleAddNew = () => {
    console.log('Add new driver');
    setShowModel(true);
  };


  //  close the adding model and refreash tabel ------------------------------------------------
  const handleAddDriverSuccess = () => {
    setShowModel(false);
    setSuccessMessage('Driver was successfully added!');
    setTableKey(prev => prev + 1); // Force table refresh
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // 10 seconds
  };

  //======================================================================================
  return (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md z-50">
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
    </>
  );
};

export default DriversPage;
