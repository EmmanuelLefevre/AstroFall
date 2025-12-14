"use client";
import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Header,
	RowData,
	SortingState,
	Table as TableType,
	useReactTable
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/data-table-all-component/data-table-pagination.component";
import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";


interface DataTableProps<TData extends RowData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}


export function DataTable<TData extends RowData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "Recovered weight", desc: true }
	]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

	// Focus input state
	const [isFocused, setIsFocused] = React.useState(false);

	// Get generic colors
	const { colorMeteoriteType  } = useGenericColorsHook();

	// Enrich column "Type" with colors
	const columnEnrichesWithColors = columns.map((column) => {
		if ('accessorKey' in column && column.accessorKey === "Type") {
			return {
				...column,
				meta: { colorMeteoriteType }
			};
		}
		return column;
	});

	const table = useReactTable<TData>({
		data,
		columns: columnEnrichesWithColors,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		state: {
			pagination,
			columnFilters,
			sorting
		}
	});

	const typedTable = table as unknown as TableType<TData>;

	const [, setForceRender] = React.useState(0);
	const handleSort = (header: Header<TData, unknown>) => {
		setSorting((prevSorting) => {
			const currentSort = prevSorting.find((s) => s.id === header.column.id);
			if (!currentSort) {
				return [{ id: header.column.id, desc: true }];
			}
			else {
				return [{ id: header.column.id, desc: !currentSort.desc }];
			}
		});
		setForceRender((prev) => prev + 1);
	};

	return (
		<div id="table-container">
			<div id="input-search">
				<Input
					placeholder={isFocused ? "" : "Filtrer par pays..."}
					value={ (table.getColumn("Country")?.getFilterValue() as string) ?? "" }
					onChange={ (event: React.ChangeEvent<HTMLInputElement> ) =>
						table.getColumn("Country")?.setFilterValue(event.target.value)
					}
					onFocus={ () => setIsFocused(true) }
          onBlur={ () => setIsFocused(false) }  />
			</div>
			<div id="table">
				<Table>
					<TableHeader>
						{typedTable.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}
														style={{width: header.column.getSize()}}
														onClick={() => handleSort(header)}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
										<span>
											{header.column.getIsSorted() === "desc" ? " ▼" : header.column.getIsSorted() === "asc" ? " ▲" : " ▽"}
										</span>
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{typedTable.getRowModel().rows?.length ? (
							typedTable.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => {
										const isTypeColumn = cell.column.id === "Type";
										const typeValue = cell.getValue<string>();
										const typeColor = isTypeColumn && typeValue ? colorMeteoriteType[typeValue] : undefined;
										const style = isTypeColumn ? {
											color: typeColor,
											fontWeight: 'bold',
											letterSpacing: '1px'
										} : {};
										return (
											<TableCell key={cell.id} style={style}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										);
									})}
								</TableRow>))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length}>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div id="pagination-wrapper">
				<DataTablePagination<TData> table={typedTable}/>
			</div>
		</div>
	);
}
