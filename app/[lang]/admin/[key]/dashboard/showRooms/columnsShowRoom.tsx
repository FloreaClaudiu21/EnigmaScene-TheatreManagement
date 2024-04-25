"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { ShowRoom, TableTypes } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";

export const columnsShowRoom: ColumnDef<ShowRoom>[] = [
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
					type={TableTypes.SHOWROOM}
					deleteId={row.original.id}
					link_edit={"showRooms/" + row.original.id + "/edit"}
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
		accessorKey: "number",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Room Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.number} />;
		},
	},
	{
		accessorKey: "seats",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seats" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.seats?.length} />;
		},
	},
	{
		accessorKey: "observations",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Observations" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.observations ?? "None"} />;
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
