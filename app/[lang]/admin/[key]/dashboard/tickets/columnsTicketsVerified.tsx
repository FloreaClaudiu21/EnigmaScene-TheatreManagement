"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { TableTypes, TicketVerified } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";

export const columnsTicketsVerified: ColumnDef<TicketVerified>[] = [
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
					type={TableTypes.TICKET_VERIFIED}
					link_edit={"tickets/" + row.original.id + "/edit-verified"}
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
		accessorKey: "ticketSoldId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ticket Sold Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.ticketSoldId} />;
		},
	},
	{
		accessorKey: "ticketSoldNumber",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ticket Sold Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.ticketSold?.number} />;
		},
	},
	{
		accessorKey: "verifiedAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Verified At" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.verifiedAt.toUTCString();
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
