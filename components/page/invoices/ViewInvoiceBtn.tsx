"use client";
import { useDictionary } from "@/components/dictionary-provider";
import { Invoice } from "@/lib/types";
import { useInvoiceModal } from "@/services/StateProvider";
import { Button, Tooltip } from "@nextui-org/react";
import { FileArchiveIcon } from "lucide-react";

export default function ModalViewInvoice({
	invoice,
}: {
	invoice?: Invoice | null;
}) {
	const dict = useDictionary();
	const invModal = useInvoiceModal();
	const clickShow = () => {
		invModal.setInvoice(invoice ?? null);
		invModal.setVisible(true);
	};
	return (
		<div className="flex flex-row gap-2 justify-center">
			<Tooltip content={dict.buttons.viewInvoice} radius="md">
				<Button
					size="sm"
					isIconOnly
					radius="sm"
					variant="bordered"
					onClick={() => clickShow()}
					className="hover:bg-yellow-100 disabled:bg-gray-300"
					isDisabled={invoice == null || invoice == undefined}
				>
					<FileArchiveIcon size={18} />
				</Button>
			</Tooltip>
		</div>
	);
}
