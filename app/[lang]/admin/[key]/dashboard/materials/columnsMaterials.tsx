"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { ShowMaterialDecoration, TableTypes } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";

export const columnsMaterials: ColumnDef<ShowMaterialDecoration>[] = [
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
					type={TableTypes.MATERIAL}
					deleteId={row.original.id}
					link_edit={"materials/" + row.original.id + "/edit"}
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
			return <ColumnHeader column={column} title="Material Name" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.name} />;
		},
	},
	{
		accessorKey: "name_en",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Material Name EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.name_en} />;
		},
	},
	{
		accessorKey: "categoryId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Category Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.categoryId} />;
		},
	},
	{
		accessorKey: "categoryName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Category Name" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.category?.name} />;
		},
	},
	{
		accessorKey: "categoryNameEN",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Category Name EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.category?.name_en} />;
		},
	},
	{
		accessorKey: "stock",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Current Stock" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.stock} />;
		},
	},
	{
		accessorKey: "producer",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Producer" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.producer} />;
		},
	},
	{
		accessorKey: "buyDate",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Buy Date" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell data={original.buyDate.replace("T", " ").split(".")[0]} />
			);
		},
	},
	{
		accessorKey: "buyPrice",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Buy Price (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.buyPrice + ""} />;
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
