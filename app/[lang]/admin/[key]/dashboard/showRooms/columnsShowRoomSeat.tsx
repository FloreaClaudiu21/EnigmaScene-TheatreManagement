"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { ShowRoomSeat, TableTypes } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";

export const columnsShowRoomSeat: ColumnDef<ShowRoomSeat>[] = [
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
					type={TableTypes.SHOWROOM_SEAT}
					deleteId={row.original.id}
					link_edit={"showRooms/" + row.original.id + "/edit-seat"}
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
			return <ColumnHeader column={column} title="Seat Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.number} />;
		},
	},
	{
		accessorKey: "row",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seat Row" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.row} />;
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seat Price" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.price} />;
		},
	},
	{
		accessorKey: "type",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seat Type" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.type} />;
		},
	},
	{
		accessorKey: "showRoomId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Room Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showRoomId} />;
		},
	},
	{
		accessorKey: "showRoomName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Room Name" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showRoom?.number} />;
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
