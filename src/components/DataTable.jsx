import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { CSVLink } from "react-csv";

const DataTable = ({ headColumn, data, loading }) => {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Initial page index
    pageSize: 10, // Default page size
  });

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const table = useReactTable({
    data,
    columns: headColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  if (loading)
    return (
      <div className="loading bg-white w-[95%] sm:w-[80%] mx-auto rounded-md overflow-hidden px-2 py-4 text-lg">
        Loading Data...
      </div>
    );

  return (
    <section className="bg-white w-[95%] sm:w-[85%] mx-auto rounded-md relative mt-20">
      <div className="page-count absolute right-0 -top-12 z-10 w-[250px] flex items-center">
        <p className="text-lg text-white">Books Count :</p>

        <button
          onClick={() => handlePageSizeChange(10)}
          className="bg-white rounded-full p-1 mx-1"
        >
          10
        </button>
        <button
          onClick={() => handlePageSizeChange(50)}
          className="bg-white rounded-full p-1 mx-1"
        >
          50
        </button>
        <button
          onClick={() => handlePageSizeChange(100)}
          className="bg-white rounded-full p-1 mx-1"
        >
          100
        </button>
      </div>
      <div className="page-count absolute left-0 -top-12 z-10 w-[100px] flex items-center">
        <CSVLink data={data} headers={headColumn.header}>
          <button className="bg-white rounded-md p-2 mx-1">Export</button>
        </CSVLink>
      </div>
      <div className="table-wrapper overflow-scroll md:overflow-hidden min-h-[500px]">
        <table className="w-full table-fixed">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-2 text-left p-1 text-sm"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: "⬆️",
                      desc: "⬇️",
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50 text-sm">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-btn w-[250px] mx-auto flex justify-center">
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className="px-4 py-2 m-2 font-semibold bg-blue-400 text-white rounded-md"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 m-2 font-semibold bg-blue-400 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default DataTable;
