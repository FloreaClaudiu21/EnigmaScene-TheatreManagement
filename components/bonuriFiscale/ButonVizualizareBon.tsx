"use client";
import { BonFiscal } from "@/lib/tipuri";
import { formularBonFiscal } from "@/services/general/FurnizorStare";
import { Button, Tooltip } from "@nextui-org/react";
import { StickyNoteIcon } from "lucide-react";

export default function ModalViewFiscalReceipt({
	receipt,
}: {
	receipt?: BonFiscal | null;
}) {
	const fisModal = formularBonFiscal();
	const clickShow = () => {
		fisModal.setBon(receipt ?? null);
		fisModal.setVizibil(true);
	};
	return (
		<div className="flex flex-row gap-2 justify-center">
			<Tooltip content={"Vizualizare bon fiscal"} radius="md">
				<Button
					size="sm"
					isIconOnly
					radius="sm"
					variant="bordered"
					onClick={() => clickShow()}
					isDisabled={receipt == null || receipt == undefined}
					className="hover:bg-yellow-100 disabled:bg-gray-300"
				>
					<StickyNoteIcon size={18} />
				</Button>
			</Tooltip>
		</div>
	);
}
