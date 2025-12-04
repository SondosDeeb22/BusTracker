//======================================================================================
//? Importing
//======================================================================================
import React from 'react';
import { getStatusConfig, type StatusType } from '../styles/colorPalette';

interface StatusBadgeProps {
  status: string;
  type: StatusType;
  className?: string;
}

//======================================================================================
//? StatusBadge
//======================================================================================
const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type, 
  className = '' 
}) => {
  const config = getStatusConfig(type, status);
  
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color} ${className}`}
      title={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
};

//======================================================================================
export default StatusBadge;
