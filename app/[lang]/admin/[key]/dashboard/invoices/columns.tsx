"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Button, Checkbox, Chip } from "@nextui-org/react";
import { Invoice, Payment } from "@/lib/types";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";

export const columns: ColumnDef<Invoice>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex flex-row items-center justify-center text-center">
				<Checkbox
					radius="none"
					onChange={(event) => {
						table.toggleAllPageRowsSelected(event.target.checked);
					}}
					isIndeterminate={table.getIsSomePageRowsSelected()}
					isSelected={table.getIsAllPageRowsSelected()}
					aria-label="Select all"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex flex-row items-center justify-center text-center">
				<Checkbox
					radius="none"
					onChange={(event) => {
						row.toggleSelected(event.target.checked);
					}}
					isSelected={row.getIsSelected()}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: true,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const invoice = row.original;
			return <ModalViewInvoice invoice={invoice} />;
		},
	},
	{
		accessorKey: "id",
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						ID
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(invoice.id.toString())}
					>
						{invoice.id}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "billingAddress",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Billing Address
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(invoice.billingAddress)
						}
					>
						{invoice.billingAddress}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "currency",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Currency
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(invoice.currency)}
					>
						{invoice.currency}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "currencyAmount",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Currency Amount
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(invoice.currencyAmount + "")
						}
					>
						{invoice.currencyAmount}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						User Email
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(invoice.email)}
					>
						{invoice.email}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "firstName",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						User Name
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			const name = invoice.firstName + " " + invoice.lastName;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(name)}
					>
						{name}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "invoiceNumber",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						radius="none"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Invoice Number
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(invoice.invoiceNumber)}
					>
						{invoice.invoiceNumber}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "invoiceSeries",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Invoice Series
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(invoice.invoiceSeries)}
					>
						{invoice.invoiceSeries}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "totalAmount",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Total Amount
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(invoice.totalAmount + "")
						}
					>
						{invoice.totalAmount}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "extraFees",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Extra Fees
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(invoice.extraFees + "")
						}
					>
						{invoice.extraFees}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "userId",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						User Id
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const payment = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(payment.userId)}
					>
						{payment.userId}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "paymentId",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Payment Id
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(invoice.paymentId ?? "")
						}
					>
						{invoice.paymentId ?? "Not associated with a payment"}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "rentId",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Rent Id
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const invoice = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(invoice.rentId ?? "")}
					>
						{invoice.rentId ?? "Not associated with a rent"}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "issueDate",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Issue Date
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const user = row.original;
			const theDate = user.issueDate.toUTCString();
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(theDate)}
					>
						{theDate}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Created At
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const user = row.original;
			const theDate = user.createdAt.toUTCString();
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(theDate)}
					>
						{theDate}
					</Button>
				</div>
			);
		},
	},
];
