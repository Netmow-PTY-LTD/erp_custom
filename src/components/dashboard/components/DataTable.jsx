"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Custom debounce function
function useDebounce(callback, delay) {
  const timer = useRef();
  return (...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function DataTable({
  columns,
  data,
  totalCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onGlobalFilterChange,
  globalFilterValue,
}) {
  const [globalFilter, setGlobalFilter] = useState(globalFilterValue || "");
  const debouncedFilter = useDebounce((value) => {
    onGlobalFilterChange && onGlobalFilterChange(value);
  }, 300);

  useEffect(() => {
    debouncedFilter(globalFilter);
  }, [globalFilter]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // max visible pages
    let startPage = Math.max(pageIndex - 2, 0);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 0);
    }

    if (startPage > 0) {
      pageNumbers.push(0);
      if (startPage > 1) pageNumbers.push("ellipsis-start");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) pageNumbers.push("ellipsis-end");
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers.map((p, idx) => {
      if (p === "ellipsis-start" || p === "ellipsis-end") {
        return <PaginationEllipsis key={idx} />;
      } else {
        return (
          <PaginationItem key={idx}>
            <PaginationLink
              className="cursor-pointer"
              isActive={p === pageIndex}
              onClick={() => onPageChange(p)}
            >
              {p + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    });
  };

  return (
    <div className="space-y-4">
      {onGlobalFilterChange && (
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => onPageSizeChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem disabled={pageIndex <= 0}>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {renderPagination()}

            {/* Next */}
            <PaginationItem disabled={pageIndex >= totalPages - 1}>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(pageIndex + 1, totalPages - 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="text-xs text-muted-foreground">
          Page {pageIndex + 1} of {totalPages}
        </div>
      </div>
    </div>
  );
}
