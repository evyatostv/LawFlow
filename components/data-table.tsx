"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  filterPlaceholder?: string;
  initialSorting?: SortingState;
  onSortingPersist?: (sorting: SortingState) => void;
  mobileStacked?: boolean;
};

export function DataTable<TData>({
  data,
  columns,
  filterPlaceholder,
  initialSorting,
  onSortingPersist,
  mobileStacked = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting ?? []);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  React.useEffect(() => {
    if (initialSorting) {
      setSorting(initialSorting);
    }
  }, [initialSorting]);

  React.useEffect(() => {
    if (!onSortingPersist) return;
    const handle = window.setTimeout(() => {
      onSortingPersist(sorting);
    }, 400);
    return () => window.clearTimeout(handle);
  }, [sorting, onSortingPersist]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    enableRowSelection: true,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          label="סינון"
          placeholder={filterPlaceholder ?? "חיפוש לפי כל שדה"}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-steel">
            נבחרו {Object.keys(rowSelection).length} פריטים
          </span>
          <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
            נקה בחירה
          </Button>
        </div>
      </div>
      {mobileStacked ? (
        <div className="flex flex-col gap-3 md:hidden">
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-steel/10 bg-white/80 p-4">
              {row.getVisibleCells().map((cell) => {
                const header = cell.column.columnDef.header;
                const headerLabel =
                  typeof header === "string" ? header : cell.column.id === "select" ? "" : cell.column.id;
                if (cell.column.id === "select") {
                  return (
                    <div key={cell.id} className="mb-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );
                }
                return (
                  <div key={cell.id} className="flex items-center justify-between border-b border-steel/5 py-2 text-sm last:border-none">
                    <span className="text-xs text-steel/70">{headerLabel}</span>
                    <span className="text-right text-ink">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
      <div className={mobileStacked ? "hidden md:block" : ""}>
        <div className="rounded-2xl border border-steel/10 bg-white/80">
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHeader key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        className="flex items-center gap-2"
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? "▲" : header.column.getIsSorted() === "desc" ? "▼" : ""}
                      </button>
                    )}
                  </TableHeader>
                ))}
              </TableRow>
            ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
