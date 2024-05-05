import { useGeneralChartModal } from "@/services/StateProvider";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import React from "react";

export default function GeneralChartModal() {
	const generalChartModal = useGeneralChartModal();
	const closeModal = () => {
		generalChartModal.setVisible(false);
	};
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			isOpen={generalChartModal.visible}
			onOpenChange={() => {
				generalChartModal.setVisible(false);
				document.body.style.overflowY = "auto";
			}}
			scrollBehavior="inside"
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{generalChartModal.title}
						</ModalHeader>
						<ModalBody>{generalChartModal.body}</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={() => {
									closeModal();
									onClose();
								}}
							>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
