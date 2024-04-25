"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import { Invoice, TableTypes } from "@/lib/types";
import { Chip } from "@nextui-org/react";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";
import ModalViewFiscalReceipt from "@/components/page/fiscalReceipts/ViewFiscalReceiptBtn";
import ModalViewTicket from "@/components/page/ticket/ViewTicketBtn";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";

export const columnsInvoice: ColumnDef<Invoice>[] = [
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
						<ModalViewInvoice invoice={original} />
						<ModalViewFiscalReceipt receipt={original.fiscalReceipt} />
						<ModalViewTicket ticket={original.ticket} />
					</div>
					<ColumnCellActions
						deleteId={original.id}
						type={TableTypes.INVOICE}
						link_edit={"invoices/" + original.id + "/edit"}
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
		accessorKey: "invoiceNumber",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Invoice Number" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.invoiceNumber} />;
		},
	},
	{
		accessorKey: "invoiceSeries",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Invoice Series" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.invoiceSeries} />;
		},
	},
	{
		accessorKey: "paymentId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Payment Id" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.paymentId} />;
		},
	},
	{
		accessorKey: "fiscalReceiptId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Fiscal Receipt Id" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.fiscalReceiptId} />;
		},
	},
	{
		accessorKey: "fiscalReceiptNumber",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Fiscal Receipt Number" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.fiscalReceipt?.receiptNumber} />;
		},
	},
	{
		accessorKey: "extraFees",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Extra Fees (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.extraFees} />;
		},
	},
	{
		accessorKey: "totalAmount",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Total Amount Paid (RON)" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.totalAmount + original.extraFees} />;
		},
	},
	{
		accessorKey: "totalAmountPaid",
		header: ({ column }) => {
			return (
				<ColumnHeader column={column} title={`Total Amount Paid In Currency`} />
			);
		},
		cell: ({ row: { original } }) => {
			return (
				<ColumnCell
					data={(original.currency != "RON"
						? (original.totalAmount + original.extraFees) /
						  original.currencyAmount
						: original.totalAmount + original.extraFees
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
		accessorKey: "issueDate",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Paid At" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.issueDate.toUTCString()} />;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Status" />;
		},
		cell: ({ row }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Chip variant="flat" color={"success"}>
						Paid
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
		accessorKey: "billingAddress",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Billing Address" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.billingAddress} />;
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Email" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.email} />;
		},
	},
	{
		accessorKey: "firstName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="First Name" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.firstName} />;
		},
	},
	{
		accessorKey: "lastName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Last Name" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.firstName} />;
		},
	},
	{
		accessorKey: "phone",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Phone Number" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.phone} />;
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
