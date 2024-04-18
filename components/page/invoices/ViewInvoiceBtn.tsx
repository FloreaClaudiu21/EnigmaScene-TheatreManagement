"use client";
import { useDictionary } from "@/components/dictionary-provider";
import { Invoice } from "@/lib/types";
import { useInvoiceModal } from "@/services/StateProvider";
import { Button, Tooltip } from "@nextui-org/react";
import { EyeIcon } from "lucide-react";

export default function ModalViewInvoice({ invoice }: { invoice: Invoice }) {
	const dict = useDictionary();
	const invModal = useInvoiceModal();
	const clickShow = () => {
		invModal.setInvoice(invoice);
		invModal.setVisible(true);
	};
	return (
		<div className="flex flex-row gap-2 justify-center">
			<Tooltip content={dict.buttons.viewInvoice} radius="none">
				<Button
					isIconOnly
					radius="none"
					className="bg-black text-white"
					onClick={() => clickShow()}
				>
					<EyeIcon />
				</Button>
			</Tooltip>
		</div>
	);
}
