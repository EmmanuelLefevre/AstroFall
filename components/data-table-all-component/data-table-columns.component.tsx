"use client"
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table"
import { emptyValuePipe } from "@/lib/utils/empty-value-pipe";
import { Meteorite } from "@/lib/interfaces/meteorite-interface";
import { transformStringValuePipe } from "@/lib/utils/transform-string-value-pipe";


const transformationMap = {
  "find": <div className="find-or-not">
						<Image src="/images/valid.png"
									alt="Météorite découverte"
									width={22}
									height={22} />
					</div>,
  "fall": <div className="find-or-not">
						<Image src="/images/invalid.png"
									alt="Météorite non découverte"
									width={22}
									height={22} />
					</div>
};

export const columns: ColumnDef<Meteorite>[] = [
	{
		accessorKey: "Name",
		header: "Nom",
    cell: ({ row }) => emptyValuePipe(row.getValue("Name")),
		enableResizing: false,
		size: 40
	},
	{
		accessorKey: "Year",
		header: "An",
    cell: ({ row }) => emptyValuePipe(row.getValue("Year")),
		enableResizing: false,
		size: 20
	},
	{
		accessorKey: "Country",
		header: "Pays",
    cell: ({ row }) => emptyValuePipe(row.getValue("Country")),
		enableResizing: false,
		size: 30
	},
	{
		accessorKey: "Locality",
		header: "Lieu",
    cell: ({ row }) => emptyValuePipe(row.getValue("Locality")),
		enableResizing: false,
		size: 35
	},
	{
		accessorKey: "Recovered weight",
		header: "Masse (kg)",
		cell: ({ row }) => {
			const value = row.getValue("Recovered weight");
			if (typeof value === "number") {
				return emptyValuePipe(value.toLocaleString("fr-FR"));
			}
			if (typeof value === "string") {
				const parsedValue = parseFloat(value);
				return emptyValuePipe(isNaN(parsedValue) ? value : parsedValue.toLocaleString("fr-FR"));
			}
			return emptyValuePipe(null);
		},
		enableResizing: false,
		size: 30
	},
	{
		accessorKey: "ff",
		header: "Découverte",
		cell: ({ row }) => transformStringValuePipe(row.getValue("ff"), transformationMap),
		enableResizing: false,
		size: 30
	},
	{
		accessorKey: "Type",
		header: "Type",
    cell: ({ row }) => emptyValuePipe(row.getValue("Type")),
		enableResizing: false,
		size: 25
	}
]
