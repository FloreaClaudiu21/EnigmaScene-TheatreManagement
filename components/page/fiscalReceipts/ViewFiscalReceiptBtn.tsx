"use client";
import { useDictionary } from "@/components/dictionary-provider";
import { FiscalReceipt } from "@/lib/types";
import { useFiscalReceiptModal } from "@/services/StateProvider";
import { Button, Tooltip } from "@nextui-org/react";
import { StickyNoteIcon } from "lucide-react";

export default function ModalViewFiscalReceipt({
	receipt,
}: {
	receipt?: FiscalReceipt | null;
}) {
	const dict = useDictionary();
	const fisModal = useFiscalReceiptModal();
	const clickShow = () => {
		fisModal.setReceipt(receipt ?? null);
		fisModal.setVisible(true);
	};
	return (
		<div className="flex flex-row gap-2 justify-center">
			<Tooltip content={dict.buttons.viewfiscalReceipt} radius="md">
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
