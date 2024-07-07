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
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import TicketPrintPaper from "./BiletHartie";
import { formularBilet } from "@/services/general/FurnizorStare";

const ModalBilet = () => {
	const biletModal = formularBilet();
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={biletModal.vizibil}
			placement={"bottom-center"}
			onOpenChange={() => {
				biletModal.setVizibil(false);
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
							Bilet Spectacol #{biletModal.bilet?.numarBilet}
							<Divider />
						</ModalHeader>
						<ModalBody className="max-w-full overflow-scroll">
							<div
								id={"content-ticket-id"}
								ref={componentRef}
								className="h-full"
							>
								<TicketPrintPaper data={biletModal.bilet!} />
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

export default ModalBilet;
