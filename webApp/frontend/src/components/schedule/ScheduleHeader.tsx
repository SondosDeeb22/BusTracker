//======================================================================================
//? Importing
//======================================================================================

import React from 'react';

import { COLORS } from '../../styles/colorPalette';

//======================================================================================
//? Types
//======================================================================================

type ScheduleHeaderProps = {
  title: string;
  selectedDate: string;
  onSelectedDateChange: (nextDate: string) => void;
  filterByDateLabel: string;
  clearLabel: string;
  addNewLabel: string;
  onAddNew: () => void;
};

//======================================================================================
//? Component
//======================================================================================

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  title,
  selectedDate,
  onSelectedDateChange,
  filterByDateLabel,
  clearLabel,
  addNewLabel,
  onAddNew,
}) => {
  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-800 mt-10 ml-2">{title}</h1>

      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div />

        <div className="flex items-end gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">{filterByDateLabel}</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectedDateChange(e.target.value)}
              className="border rounded-md px-3 py-2 h-10"
            />
          </div>

          {selectedDate ? (
            <button
              type="button"
              onClick={() => onSelectedDateChange('')}
              className="border rounded-md px-3 py-2 hover:bg-gray-50 h-10"
            >
              {clearLabel}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onAddNew}
            className="px-4 py-2 text-white rounded-md hover:bg-red-900 h-10"
            style={{ background: COLORS.burgundy }}
          >
            {addNewLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default ScheduleHeader;
