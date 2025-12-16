import React from "react";
import PageLoader from "./PageLoader";

type Column<T> = {
  key: keyof T | "action";
  label: string;
  render?: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onClickLigne?: (item: T) => void;
};

export const DataTable = <T extends { [key: string]: any }>({
  data,
  columns,
  page,
  totalPages,
  loading,
  onPageChange,
  onClickLigne
}: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? 
            (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  <PageLoader />
                </td>
              </tr>
            ):(
              <>{data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  Aucun résultat
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td 
                      key={col.key as string} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      onClick={()=>onClickLigne?.(item)}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}</>)
          }
          
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Précédent
        </button>
        <span className="px-3 py-1">
          {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};