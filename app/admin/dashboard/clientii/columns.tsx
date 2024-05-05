"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { Button, Chip, Link } from "@nextui-org/react";
import { User } from "next-auth";
import { useDeleteModal } from "@/services/StateProvider";
import { useState } from "react";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { TipuriTabel } from "@/lib/types";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";

function PasswordField({ user }: { user: User }) {
	const [visiblePass, setVisiblePass] = useState(false);
	return (
		<div className="flex flex-row items-center justify-center text-center">
			<Button
				radius="none"
				variant="light"
				onClick={() => {
					setVisiblePass((old) => !old);
					navigator.clipboard.writeText(user.parola);
				}}
			>
				{!visiblePass ? "*".repeat(user.parola.length) : user.parola}
			</Button>
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
				className="text-zinc-600 border-zinc-400 font-medium"
				href={"clientii/" + user.codClient + "/editare"}
			>
				Editare
			</Button>
			<Button
				size="sm"
				isIconOnly
				radius="sm"
				variant="light"
				className="text-zinc-600 hover:text-red-600"
				onPress={() => {
					deleteModal.setType(TipuriTabel.CLIENT);
					deleteModal.setDeleteId(user.codClient);
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
		enableSorting: false,
	},
	{
		accessorKey: "codClient",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Cod Client" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.codClient} />;
		},
	},
	{
		accessorKey: "numeClient",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Nume Client" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.numeClient} />;
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Email" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return (
				<ColumnCell
					data={user.email}
					className={`${user.utlizatorAdmin && "text-red-500"}`}
				/>
			);
		},
	},
	{
		accessorKey: "active",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Active" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			const color = user.emailVerificat != undefined ? "success" : "danger";
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Chip variant="flat" color={color}>
						{color == "danger" ? "Nu este activ" : "Activ"}
					</Chip>
				</div>
			);
		},
	},
	{
		accessorKey: "telefon",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Telefon" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.telefon} />;
		},
	},
	{
		accessorKey: "parola",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Parola" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <PasswordField user={user} />;
		},
	},
	{
		accessorKey: "creatPe",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Creat Pe" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			const theDate = formatDateFull(user.creatPe);
			return <ColumnCell data={theDate} />;
		},
	},
];
