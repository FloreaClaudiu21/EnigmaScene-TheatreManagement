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
import InvoicePrintPaper from "./InvoicePaper";
import { useInvoiceModal } from "@/services/StateProvider";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const InvoiceModal = () => {
	const invoiceModal = useInvoiceModal();
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={invoiceModal.visible}
			placement={"bottom-center"}
			onOpenChange={() => {
				invoiceModal.setVisible(false);
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
							Factura Fiscală #{invoiceModal.invoice?.numarFactura}
							<Divider />
						</ModalHeader>
						<ModalBody className="max-w-full overflow-scroll">
							<div
								id={"content-invoice-id"}
								ref={componentRef}
								className="h-full"
							>
								<InvoicePrintPaper data={invoiceModal.invoice!} />
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								radius="md"
								color="danger"
								variant="light"
								onPress={onClose}
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

export default InvoiceModal;
