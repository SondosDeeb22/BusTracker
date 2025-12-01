import Table from '../components/Table';

const DriversPage = () => {
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
    // TODO: Implement add new driver functionality
  };

  return (
    <Table
      title="Driver Management"
      endpoint="http://localhost:3001/api/admin/drivers/fetch"
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddNew={handleAddNew}
    />
  );
};

export default DriversPage;
