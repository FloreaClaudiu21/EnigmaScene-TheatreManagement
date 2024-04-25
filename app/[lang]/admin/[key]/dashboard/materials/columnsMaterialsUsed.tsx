"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { ShowMaterialDecorationUsed, TableTypes } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";

export const columnsMaterialsUsed: ColumnDef<ShowMaterialDecorationUsed>[] = [
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
					type={TableTypes.MATERIAL_USED}
					link_edit={"materials/" + row.original.id + "/edit-used"}
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
		accessorKey: "showId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showId} />;
		},
	},
	{
		accessorKey: "showName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Title" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.show?.title} />;
		},
	},
	{
		accessorKey: "showNameEN",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Title EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.show?.title_en} />;
		},
	},
	{
		accessorKey: "materialId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Material Id" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.id} />;
		},
	},
	{
		accessorKey: "materialName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Material Name" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.material?.name} />;
		},
	},
	{
		accessorKey: "materialNameEN",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Material Name EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.material?.name_en} />;
		},
	},
	{
		accessorKey: "quantity",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Quantity Used" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.quantity} />;
		},
	},
	{
		accessorKey: "leftQuantity",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Left Stock" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.leftQuantity} />;
		},
	},
	{
		accessorKey: "unit",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Unit" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.material?.unit} />;
		},
	},
	{
		accessorKey: "usedDate",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Used Date" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell data={original.usedDate.replace("T", " ").split(".")[0]} />
			);
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
