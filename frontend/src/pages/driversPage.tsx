import { useState } from 'react';
import Table from '../components/Table';
import AddDriver from '../components/ui/addDriver';

const DriversPage = () => {
  const [showAddDriver, setShowAddDriver] = useState(false);

  const handleEdit = (driver: any) => {
    console.log('Edit driver:', driver);
    // TODO: Implement edit functionality
  };

  const handleDelete = (driver: any) => {
    console.log('Delete driver:', driver);
    // TODO: Implement delete functionality
  };

  const handleAddNew = () => {
    console.log('Add new driver');
    setShowAddDriver(true);
  };

  const handleCloseAddDriver = () => {
    setShowAddDriver(false);
  };

  const handleAddDriverSuccess = () => {
    setShowAddDriver(false);
    // TODO: Refresh the drivers table
  };

  return (
    <>
      <Table
        title="Drivers"
        endpoint="http://localhost:3001/api/admin/drivers/fetch"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />
      {showAddDriver && (
        <AddDriver
          onClose={handleCloseAddDriver}
          onSuccess={handleAddDriverSuccess}
        />
      )}
    </>
  );
};

export default DriversPage;
