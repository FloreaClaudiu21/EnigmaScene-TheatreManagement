"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { ShowMaterialDecorationCategory, TableTypes } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";

export const columnsMaterialsCategory: ColumnDef<
	ShowMaterialDecorationCategory
>[] = [
	{
		id: "select",
		header: ({ table }) => {
			return <ColumnSelectHeader table={table} />;
		},
		cell: ({ row }) => {
			return <ColumnSelectCell row={row} />;
		},
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				<ColumnCellActions
					deleteId={row.original.id}
					type={TableTypes.MATERIAL_CATEGORY}
					link_edit={"materials/" + row.original.id + "/edit-category"}
				/>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "id",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Id" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.id} />;
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Name" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.name} />;
		},
	},
	{
		accessorKey: "name_en",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Name EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.name_en} />;
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Created At" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.createdAt.toUTCString();
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Updated At" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.updatedAt.toUTCString();
			return <ColumnCell data={theDate} />;
		},
	},
];
