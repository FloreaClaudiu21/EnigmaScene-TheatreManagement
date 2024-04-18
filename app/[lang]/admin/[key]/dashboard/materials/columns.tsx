"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	PlusIcon,
	Trash2Icon,
	TrashIcon,
} from "lucide-react";
import {
	Button,
	Checkbox,
	Chip,
	Link,
	Select,
	SelectItem,
	Tooltip,
} from "@nextui-org/react";
import { User } from "next-auth";
import {
	useAddAddressModal,
	useDeleteAddressModal,
	useDeleteModal,
} from "@/services/StateProvider";
import { useEffect, useState } from "react";
import { TableTypes } from "@/lib/types";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";

function PasswordField({ user }: { user: User }) {
	const [visiblePass, setVisiblePass] = useState(false);
	return (
		<div className="flex flex-row items-center justify-center text-center">
			<Button
				radius="none"
				variant="light"
				onClick={() => {
					setVisiblePass((old) => !old);
					navigator.clipboard.writeText(user.password);
				}}
			>
				{!visiblePass ? "*".repeat(user.password.length) : user.password}
			</Button>
		</div>
	);
}

function BillAddreses({ user }: { user: User }) {
	const addAddress = useAddAddressModal();
	const deleteAddressModal = useDeleteAddressModal();
	const billAddress = user.billingAddresses ?? [];
	const [selectedValue, setSelectedValue] = useState<string | null>(null);
	useEffect(() => {
		if (billAddress.length > 0) {
			setSelectedValue(billAddress[0].id);
		}
	}, []);
	return (
		<div className="flex flex-row gap-2 place-items-center">
			<Select
				radius="sm"
				multiple={false}
				className="min-w-64 disabled:!bg-slate-500"
				selectedKeys={selectedValue ? [selectedValue] : undefined}
				value={selectedValue ?? ""}
				onChange={(e) => {
					setSelectedValue(e.target.value);
				}}
				disabled={billAddress.length <= 0}
				isDisabled={billAddress.length <= 0}
			>
				{billAddress.map((address) => {
					const val =
						address.address! +
						", " +
						address.zipCode +
						", " +
						address.city +
						", " +
						address.country;
					return (
						<SelectItem
							title={val}
							key={address.id}
							value={address.id}
							className="rounded-sm text-xs"
						>
							{val}
						</SelectItem>
					);
				})}
			</Select>
			<Tooltip content="Add address" radius="sm">
				<Button
					size="sm"
					isIconOnly
					radius="sm"
					variant="flat"
					onClick={() => {
						addAddress.setVisible(true);
						addAddress.setIsAdminPanel(user.id);
					}}
				>
					<PlusIcon size={14} />
				</Button>
			</Tooltip>
			<Tooltip content="Delete address" radius="sm">
				<Button
					radius="sm"
					variant="bordered"
					size="sm"
					isIconOnly
					className="z-30 border-black hover:bg-red-400"
					onClick={() => {
						deleteAddressModal.onToggle(
							selectedValue != null && selectedValue.length > 3
								? selectedValue
								: null
						);
					}}
				>
					<TrashIcon size={14} />
				</Button>
			</Tooltip>
		</div>
	);
}

function ActionButtons({ user }: { user: User }) {
	const deleteModal = useDeleteModal();
	return (
		<div className="flex flex-row items-center justify-center text-center gap-2">
			<Button
				size="sm"
				as={Link}
				radius="sm"
				variant="faded"
				aria-label="Edit"
				className="text-zinc-600 border-zinc-400 font-medium"
				href={"clients/" + user.id + "/edit"}
			>
				Edit
			</Button>
			<Button
				size="sm"
				isIconOnly
				radius="sm"
				variant="light"
				className="text-zinc-600 hover:text-red-600"
				onPress={() => {
					deleteModal.setType(TableTypes.CLIENTS);
					deleteModal.setDeleteId(user.id);
					deleteModal.setVisible(true);
				}}
			>
				<Trash2Icon size={18} />
			</Button>
		</div>
	);
}

export const columns: ColumnDef<User>[] = [
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
			const user = row.original;
			return <ActionButtons user={user} />;
		},
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
		accessorKey: "firstName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="First Name" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.firstName} />;
		},
	},
	{
		accessorKey: "lastName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Last Name" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.lastName} />;
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Email" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.email} />;
		},
	},
	{
		accessorKey: "active",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Active" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			const color = user.emailVerified != undefined ? "success" : "danger";
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Chip variant="flat" color={color}>
						{color == "danger" ? "Not active" : "Active"}
					</Chip>
				</div>
			);
		},
	},
	{
		accessorKey: "phone",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Phone" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.phone} />;
		},
	},
	{
		accessorKey: "password",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Password" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <PasswordField user={user} />;
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Created At" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			const theDate = user.createdAt.toUTCString();
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "shipping",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Billing Addresses" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <BillAddreses user={user} />;
		},
	},
];
