"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { TableTypes, TicketSold } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewTicket from "@/components/page/ticket/ViewTicketBtn";

export const columnsTicketsSold: ColumnDef<TicketSold>[] = [
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
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2">
					<div className="flex flex-row gap-2 place-items-center">
						<ModalViewInvoice invoice={original.invoice} />
						<ModalViewFiscalReceipt receipt={original.fiscalReceipt} />
						<ModalViewTicket ticket={original} />
					</div>
					<ColumnCellActions
						deleteId={original.id}
						type={TableTypes.TICKET_SOLD}
						link_edit={"tickets/" + original.id + "/edit"}
					/>
				</div>
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
			return <ColumnHeader column={column} title="Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.number} />;
		},
	},
	{
		accessorKey: "soldPrice",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Sold Price (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.soldPrice} />;
		},
	},
	{
		accessorKey: "soldPriceCur",
		header: ({ column }) => {
			return <ColumnHeader column={column} title={`Sold Price In Currency`} />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={(original.payment?.currency != "RON"
						? original.soldPrice / (original.payment?.currencyAmount ?? 0)
						: original.soldPrice
					).toFixed(2)}
				/>
			);
		},
	},
	{
		accessorKey: "currency",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Currency" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.payment?.currency} />;
		},
	},
	{
		accessorKey: "paymentId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Payment Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.payment?.id} />;
		},
	},
	{
		accessorKey: "clientId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Client Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.clientId} />;
		},
	},
	{
		accessorKey: "clientEmail",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Client Email" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.client?.email} />;
		},
	},
	{
		accessorKey: "showId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showRoomId} />;
		},
	},
	{
		accessorKey: "showName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Name" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.show?.title} />;
		},
	},
	{
		accessorKey: "showNameEN",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Name EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.show?.title_en} />;
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
			return <ColumnHeader column={column} title="Show Room Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showRoom?.number} />;
		},
	},
	{
		accessorKey: "seatId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seat Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.seatId} />;
		},
	},
	{
		accessorKey: "seatNumber",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seat Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.seat?.number} />;
		},
	},
	{
		accessorKey: "seatPrice",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seat Price (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.seat?.price} />;
		},
	},
	{
		accessorKey: "seatPriceCur",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Seat Price In Currency" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={
						original.seat?.price ?? 0 / (original.payment?.currencyAmount ?? 0)
					}
				/>
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
