"use client";
import { BiletSpectacol } from "@/lib/types";
import { useTicketModal } from "@/services/StateProvider";
import { Button, Tooltip } from "@nextui-org/react";
import { TicketIcon } from "lucide-react";

export default function ModalViewTicket({
	ticket,
}: {
	ticket?: BiletSpectacol | null;
}) {
	const ticketModal = useTicketModal();
	const clickShow = () => {
		ticketModal.setTicket(ticket ?? null);
		ticketModal.setVisible(true);
	};
	return (
		<div className="flex flex-row gap-2 justify-center">
			<Tooltip content="Vizualizare bilet spectacol" radius="md">
				<Button
					size="sm"
					isIconOnly
					radius="sm"
					variant="bordered"
					onClick={() => clickShow()}
					isDisabled={ticket == null || ticket == undefined}
					className="hover:bg-yellow-100 disabled:bg-gray-300"
				>
					<TicketIcon size={18} />
				</Button>
			</Tooltip>
		</div>
	);
}
