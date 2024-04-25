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
import { useFiscalReceiptModal } from "@/services/StateProvider";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import FiscalReceiptPaper from "./FiscalReceiptPaper";

const FiscalReceiptModal = ({ langData }: { langData: LanguageData }) => {
	const fiscalModal = useFiscalReceiptModal();
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	const dict = langData.dictionary;
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={fiscalModal.visible}
			placement={"bottom-center"}
			onOpenChange={() => {
				fiscalModal.setVisible(false);
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
							{dict.modals.titles.receiptId.replace(
								"{id}",
								fiscalModal.receipt?.id
							)}
							<Divider />
						</ModalHeader>
						<ModalBody className="max-w-full overflow-scroll">
							<div
								id={"content-receipt-id"}
								ref={componentRef}
								className="h-full"
							>
								<FiscalReceiptPaper
									data={fiscalModal.receipt!}
									langData={langData}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
								radius="md"
							>
								{dict.buttons.cancel}
							</Button>
							<Button color="primary" onPress={handlePrint} radius="md">
								{dict.buttons.print}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default FiscalReceiptModal;
