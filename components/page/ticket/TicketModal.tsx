"use client";
import {
	Button,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useTicketModal } from "@/services/StateProvider";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import TicketPrintPaper from "./TicketPaper";

const TicketModal = () => {
	const ticketModal = useTicketModal();
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={ticketModal.visible}
			placement={"bottom-center"}
			onOpenChange={() => {
				ticketModal.setVisible(false);
				document.body.style.overflowY = "auto";
			}}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
			className="h-[98%] max-h-screen overflow-auto min-w-72 md:min-w-[230mm] !z-[99998]"
		>
			<ModalContent className="md:m-4 p-2">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Bilet Spectacol #{ticketModal.ticket?.numarBilet}
							<Divider />
						</ModalHeader>
						<ModalBody className="max-w-full overflow-scroll">
							<div
								id={"content-ticket-id"}
								ref={componentRef}
								className="h-full"
							>
								<TicketPrintPaper data={ticketModal.ticket!} />
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
								radius="md"
							>
								ANULARE
							</Button>
							<Button color="primary" onPress={handlePrint} radius="md">
								PRINTARE
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default TicketModal;
