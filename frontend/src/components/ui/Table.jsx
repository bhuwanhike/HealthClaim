import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Table = ({ columns, data, onRowClick }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && handleSort(column.key)}
                className={`px-6 py-4 text-left text-sm font-semibold text-slate-700 ${
                  column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <span className="text-primary-600">
                      {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {sortedData.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} transition-colors`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-slate-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default Table;
