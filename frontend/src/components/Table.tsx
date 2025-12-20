import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../styles/colorPalette';
interface TableData {
  [key: string]: any; // Dynamic keys based on API response
}

interface ColumnConfig {
  key: string;
  label?: string;
  formatter?: (value: any, columnName: string, row: TableData) => React.ReactNode;
}

interface TableProps {
  title: string;
  subtitle: string;
  endpoint: string;
  onEdit?: (item: TableData) => void;
  onDelete?: (item: TableData) => void;
  onAddNew?: () => void;
  columnConfig?: ColumnConfig[];
  customActions?: (item: TableData) => React.ReactNode;
  showActions?: boolean;
  showAddButton?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: (error: string) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({
  title,
  subtitle,
  endpoint,
  onEdit,
  onDelete,
  onAddNew,
  columnConfig,
  customActions,
  showActions = true,
  showAddButton = true,
  loadingComponent,
  emptyComponent,
  errorComponent
}) => {
  const [data, setData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const result = await response.json();
      const tableData = result.data || [];
      
      console.log('API Response Data:', tableData); // debug log ----------------------------------
      
      setData(tableData);
      
      // Extract column names from the first item if no column config provided
      if (tableData.length > 0 && !columnConfig) {
        const columnNames = Object.keys(tableData[0]);
        setColumns(columnNames);
      } else if (columnConfig) {
        setColumns(columnConfig.map(col => col.key));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const formatColumnName = (columnName: string) => {
    // Check if column config provides a custom label
    if (columnConfig) {
      const config = columnConfig.find(col => col.key === columnName);
      if (config?.label) return config.label;
    }
    
    // Convert camelCase to readable format
    return columnName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatCellValue = (value: any, columnName: string, row: TableData) => {
    // Check if column config provides a custom formatter
    if (columnConfig) {
      const config = columnConfig.find(col => col.key === columnName);
      if (config?.formatter) return config.formatter(value, columnName, row);
    }

    // Default formatting logic - just return the value as-is
    if (value === null || value === undefined) return '-';
    
    return String(value);
  };
 
  const renderLoading = () => {
    if (loadingComponent) return loadingComponent;
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  };

  const renderError = () => {
    if (errorComponent) return errorComponent(error || 'Unknown error');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  };

  const renderEmpty = () => {
    if (emptyComponent) return emptyComponent;
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No data found</div>
      </div>
    );
  };

  if (loading) return renderLoading();
  if (error) return renderError();

 //==================================================================
//==================================================================

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-10 mt-10 ml-2">{title}</h1>
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">{  `${data.length} ${subtitle}`}</h2>
          {showAddButton && (
            <button
              onClick={onAddNew}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: COLORS.burgundy }}
            >
              <PlusIcon className="h-5 w-5" />
              Add New
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {formatColumnName(column)}
                  </th>
                ))}
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-12 text-center">
                    {renderEmpty()}
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {formatCellValue(row[column], column, row)}
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {customActions ? (
                          customActions(row)
                        ) : (
                          <div className="flex gap-2">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;