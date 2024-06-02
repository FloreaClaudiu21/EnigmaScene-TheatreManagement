"use client";
import { Modal } from "@nextui-org/react";
import { useRaportModal } from "@/services/StateProvider";
import { useState } from "react";
import RaportModalContent from "./RaportModalContent";

const RaportModal = () => {
	const rapModal = useRaportModal();
	const [pdfTitle, setPdfTitle] = useState("Raport evidenta");
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={rapModal.visible}
			placement={"bottom-center"}
			onOpenChange={() => {
				rapModal.setVisible(false);
				setPdfTitle("Raport evidenta");
				document.body.style.overflowY = "auto";
			}}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
			className="h-[98%] max-h-screen overflow-auto min-w-72 md:min-w-[230mm] !z-[99998]"
		>
			<RaportModalContent
				rapModal={rapModal}
				raportTitle={pdfTitle}
				setRaportTitle={setPdfTitle}
			/>
		</Modal>
	);
};

export default RaportModal;
