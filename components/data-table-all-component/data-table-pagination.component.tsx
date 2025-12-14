import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from "@/components/ui/select";
import { RowData, Table } from "@tanstack/react-table";


interface DataTablePaginationProps<TData extends RowData> {
  table: Table<TData>;
}


export function DataTablePagination<TData extends RowData>({ table }: DataTablePaginationProps<TData>) {
	return (
		<div id="pagination-container">
			<div id="total-result">
				{ table.getPrePaginationRowModel().rows.length.toLocaleString("fr-FR") } résultats
			</div>
			<div id="pagination">
				<div id="rows">
					<Select
						value={`${ table.getState().pagination.pageSize }`}
						onValueChange={(value) => { table.setPageSize(Number(value)) }}>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={ table.getState().pagination.pageSize } />
						</SelectTrigger>
						<SelectContent id="number-page-dropdown" side="top">
							<>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem id="select-page-item" key={ pageSize } value={`${ pageSize }`}>
										{ pageSize }
									</SelectItem>
								))}
							</>
						</SelectContent>
					</Select>
				</div>
				<div id="page-count">
					Page { table.getState().pagination.pageIndex + 1 } of{" "} { table.getPageCount() }
				</div>
				<div id="page" className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="previous hidden h-8 w-8 p-0 lg:flex"
						onClick={ () => table.setPageIndex(0) }
						disabled={ !table.getCanPreviousPage() }>
						{ "<<" }
					</Button>
					<Button
						variant="outline"
						className="previous h-8 w-8 p-0"
						onClick={ () => table.previousPage() }
						disabled={ !table.getCanPreviousPage() }>
						{ "<" }
					</Button>
					<Button
						variant="outline"
						className="next h-8 w-8 p-0"
						onClick={ () => table.nextPage() }
						disabled={ !table.getCanNextPage() }>
						{ ">" }
					</Button>
					<Button
						variant="outline"
						className="next hidden h-8 w-8 p-0 lg:flex"
						onClick={ () => table.setPageIndex(table.getPageCount() - 1) }
						disabled={ !table.getCanNextPage() }>
						{ ">>" }
					</Button>
				</div>
			</div>
		</div>
	);
}
