
// ======================================================================================
//? Importing
// ======================================================================================
import React from 'react';

interface SuccessToastProps {
  message: string;
}


// =============================================================================
//? function to display success toast
// ===============================================================================
const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
      {message}
    </div>
  );
};

export default SuccessToast;
