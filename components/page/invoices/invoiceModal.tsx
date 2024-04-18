"use client";
import { LanguageData } from "@/lib/types";
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

const InvoiceModal = ({ langData }: { langData: LanguageData }) => {
	const invoiceModal = useInvoiceModal();
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	const dict = langData.dictionary;
	return (
		<Modal
			backdrop="opaque"
			isOpen={invoiceModal.visible}
			placement={"bottom-center"}
			onOpenChange={() => {
				invoiceModal.setVisible(false);
				document.body.style.overflowY = "auto";
			}}
			classNames={{
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
			}}
			className="h-[98%] rounded-none max-h-screen overflow-auto min-w-72 md:min-w-[230mm] z-[99998]"
		>
			<ModalContent className="md:m-4 p-2">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{dict.modals.titles.invoiceId.replace(
								"{id}",
								invoiceModal.invoice?.id
							)}
							<Divider />
						</ModalHeader>
						<ModalBody className="max-w-full overflow-scroll">
							<div
								id={"content-invoice-id"}
								ref={componentRef}
								className="h-full"
							>
								<InvoicePrintPaper
									data={invoiceModal.invoice!}
									langData={langData}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
								radius="none"
							>
								{dict.buttons.cancel}
							</Button>
							<Button color="primary" onPress={handlePrint} radius="none">
								{dict.buttons.print}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default InvoiceModal;