"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Button, Checkbox, Chip } from "@nextui-org/react";
import { Payment } from "@/lib/types";
import ModalViewInvoice from "@/components/page/invoices/ViewInvoiceBtn";

export const columns: ColumnDef<Payment>[] = [
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
			const invoice = row.original.invoice;
			if (!invoice || row.original.status == "REJECTED")
				return <>Invoice not found.</>;
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
			const user = row.original;
			return (
				<div className="text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(user.id.toString())}
					>
						{user.id}
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
			const payment = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(payment.currency)}
					>
						{payment.currency}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "amount",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Amount
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
						onClick={() => navigator.clipboard.writeText(payment.amount + "")}
					>
						{payment.amount}
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
		accessorKey: "user",
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
			const payment = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(payment.user?.email ?? "")
						}
					>
						{payment.user?.email ?? ""}
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
			const payment = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(payment.rentId ?? "")}
					>
						{payment.rentId ?? "Not associated with a rent"}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						radius="none"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Status
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
			const color = payment.status != "REJECTED" ? "success" : "danger";
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Chip variant="flat" color={color}>
						{color == "danger" ? "Rejected" : "Accepted"}
					</Chip>
				</div>
			);
		},
	},
	{
		accessorKey: "paidAt",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Paid At
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
			const theDate = user.paidAt.toUTCString();
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
