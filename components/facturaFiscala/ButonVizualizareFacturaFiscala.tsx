"use client";
import { FacturaFiscala } from "@/lib/tipuri";
import { formularFactura } from "@/services/general/FurnizorStare";
import { Button, Tooltip } from "@nextui-org/react";
import { FileArchiveIcon } from "lucide-react";

export default function ModalViewInvoice({
	invoice,
}: {
	invoice?: FacturaFiscala | null;
}) {
	const inv = formularFactura();
	const clickShow = () => {
		inv.setFactura(invoice ?? null);
		inv.setVizibil(true);
	};
	return (
		<div className="flex flex-row gap-2 justify-center">
			<Tooltip content={"Vizualizare factură fiscală"} radius="md">
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
