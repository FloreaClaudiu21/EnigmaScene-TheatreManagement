"use client";
import { useDictionary } from "@/components/dictionary-provider";
import { TicketSold } from "@/lib/types";
import { useTicketModal } from "@/services/StateProvider";
import { Button, Tooltip } from "@nextui-org/react";
import { TicketIcon } from "lucide-react";

export default function ModalViewTicket({
	ticket,
}: {
	ticket?: TicketSold | null;
}) {
	const dict = useDictionary();
	const ticketModal = useTicketModal();
	const clickShow = () => {
		ticketModal.setTicket(ticket ?? null);
		ticketModal.setVisible(true);
	};
	return (
		<div className="flex flex-row gap-2 justify-center">
			<Tooltip content={dict.buttons.viewTicket} radius="md">
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
