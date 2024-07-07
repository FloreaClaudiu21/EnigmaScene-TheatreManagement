import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import React from "react";
import { GeneralStatBody } from "./stats/GeneralStatCard";
import { formularGrafic } from "@/services/general/FurnizorStare";

export default function GeneralChartFormular() {
	const generalChartModal = formularGrafic();
	const closeModal = () => {
		generalChartModal.setVizibil(false);
	};
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			isOpen={generalChartModal.vizibil}
			onOpenChange={() => {
				generalChartModal.setVizibil(false);
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
							{generalChartModal.titlu}
						</ModalHeader>
						<ModalBody>
							<GeneralStatBody body={generalChartModal.continut} />
						</ModalBody>
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
