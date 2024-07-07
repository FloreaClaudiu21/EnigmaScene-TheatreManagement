import { TipuriTabel } from "@/lib/tipuri";
import { formularStergereInregistrari } from "@/services/general/FurnizorStare";
import { Button } from "@nextui-org/react";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CelulaColoanaActiuni({
	type,
	link_edit,
	deleteId,
}: {
	type: TipuriTabel;
	link_edit: string;
	deleteId: number;
}) {
	const deleteModal = formularStergereInregistrari();
	return (
		<div className="flex flex-row items-center justify-start text-center gap-2">
			<Button
				size="sm"
				isIconOnly
				radius="sm"
				variant="bordered"
				className="text-zinc-600 hover:text-red-600"
				onPress={() => {
					deleteModal.setTip(type);
					deleteModal.setCodStergere(deleteId);
					deleteModal.setVizibil(true);
				}}
			>
				<Trash2Icon size={18} />
			</Button>
			<Button
				size="sm"
				as={Link}
				radius="sm"
				isIconOnly
				variant="bordered"
				aria-label="Edit"
				className="text-zinc-600 font-medium hover:text-green-600"
				href={link_edit}
			>
				<Edit2Icon size={18} />
			</Button>
		</div>
	);
}
