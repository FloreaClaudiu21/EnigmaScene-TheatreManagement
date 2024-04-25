"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import { Payment } from "@/lib/types";
import { PaymentStatus } from "@prisma/client";
import { Chip } from "@nextui-org/react";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import ModalViewTicket from "@/components/page/ticket/ViewTicketBtn";

export const columnsPayments: ColumnDef<Payment>[] = [
	{
		id: "actions",
		cell: ({ row: { original } }) => {
			return (
				<div className="flex flex-row gap-2 place-items-center">
					<ModalViewInvoice invoice={original.invoice} />
					<ModalViewFiscalReceipt receipt={original.fiscalReceipt} />
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
			return <ColumnHeader column={column} title="Amount Paid (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.amount} />;
		},
	},
	{
		accessorKey: "amountPaid",
		header: ({ column }) => {
			return <ColumnHeader column={column} title={`Amount Paid In Currency`} />;
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
		accessorKey: "type",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Payment Method" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.type} />;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Status" />;
		},
		cell: ({ row }) => {
			const color =
				row.original.status == PaymentStatus.ACCEPTED ? "success" : "danger";
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Chip variant="flat" color={color}>
						{color != "danger" ? "Accepted" : "Rejected"}
					</Chip>
				</div>
			);
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
