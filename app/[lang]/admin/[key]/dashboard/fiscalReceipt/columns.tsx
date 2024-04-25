"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import { FiscalReceipt } from "@/lib/types";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import ModalViewTicket from "@/components/page/ticket/ViewTicketBtn";

export const columnsReceipts: ColumnDef<FiscalReceipt>[] = [
	{
		id: "actions",
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2 place-items-center">
					<ModalViewInvoice invoice={original.invoice} />
					<ModalViewFiscalReceipt receipt={original} />
					<ModalViewTicket ticket={original.ticket} />
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
		accessorKey: "amount",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Amount Paid" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.amount} />;
		},
	},
	{
		accessorKey: "amountCur",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Amount Paid In Currency" />;
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={(original.currency != "RON"
						? original.amount / original.currencyAmount
						: original.amount
					).toFixed(2)}
				/>
			);
		},
	},
	{
		accessorKey: "paymentId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Payment Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.paymentId} />;
		},
	},
	{
		accessorKey: "currency",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Currency" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.currency} />;
		},
	},
	{
		accessorKey: "currencyAmount",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Currency Amount" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.currencyAmount} />;
		},
	},
	{
		accessorKey: "currencyDate",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Currency Date" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.currencyDate.toUTCString()} />;
		},
	},
	{
		accessorKey: "paidAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Paid At" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.paidAt.toUTCString()} />;
		},
	},
	{
		accessorKey: "ticketId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ticket Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.ticket?.id} />;
		},
	},
	{
		accessorKey: "ticketNumber",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Ticket Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.ticket?.number} />;
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
			return <ColumnCell data={original.clientId} />;
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
