import { TableTypes } from "@/lib/types";
import { useDeleteModal } from "@/services/StateProvider";
import { Button } from "@nextui-org/react";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ColumnCellActions({
	type,
	link_edit,
	deleteId,
}: {
	type: TableTypes;
	link_edit: string;
	deleteId: number;
}) {
	const deleteModal = useDeleteModal();
	return (
		<div className="flex flex-row items-center justify-center text-center gap-2">
			<Button
				size="sm"
				as={Link}
				radius="sm"
				variant="bordered"
				aria-label="Edit"
				className="text-zinc-600 font-medium hover:text-green-600"
				href={link_edit}
			>
				Edit
			</Button>
			<Button
				size="sm"
				isIconOnly
				radius="sm"
				variant="bordered"
				className="text-zinc-600 hover:text-red-600"
				onPress={() => {
					deleteModal.setType(type);
					deleteModal.setDeleteId(deleteId);
					deleteModal.setVisible(true);
				}}
			>
				<Trash2Icon size={18} />
			</Button>
		</div>
	);
}
