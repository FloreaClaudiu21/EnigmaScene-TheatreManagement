"use client";
import {
	Button,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
} from "@nextui-org/react";
import { useRaportModal } from "@/services/StateProvider";
import { RaportDocument } from "./RaportDocument";
import { useEffect, useState } from "react";
import { FileTextIcon, RotateCcwIcon } from "lucide-react";
import CSVRaport from "./CSVRaport";
import { usePDF } from "@react-pdf/renderer";

const RaportModal = () => {
	const rapModal = useRaportModal();
	const [title, setTitle] = useState("Raport evidenta");
	const [instance, update] = usePDF({
		document: <RaportDocument title={title} raportModal={rapModal} />,
	});
	const loadingRaport = instance.loading;
	useEffect(() => {
		if (rapModal.raport == null) return;
		update(<RaportDocument title={title} raportModal={rapModal} />);
	}, [rapModal, rapModal.raport]);
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={rapModal.visible}
			placement={"bottom-center"}
			onOpenChange={() => {
				rapModal.setVisible(false);
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
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1 px-2">
							<div className="flex flex-row gap-2 flex-1 place-items-center justify-center">
								<Input
									size="sm"
									value={title}
									className="p-0"
									variant="bordered"
									isDisabled={loadingRaport}
									endContent={
										<Button
											isIconOnly
											size="sm"
											radius="full"
											color="primary"
											title="Actualizare"
											variant="bordered"
											isDisabled={loadingRaport}
											onClick={() =>
												update(
													<RaportDocument
														title={title}
														raportModal={rapModal}
													/>
												)
											}
										>
											<RotateCcwIcon className="h-4 w-4" />
										</Button>
									}
									onChange={(e) => {
										setTitle(e.target.value);
									}}
								/>
								<CSVRaport
									loadingRaport={loadingRaport}
									raportModal={rapModal}
									title={title}
								/>
								<Button
									as="a"
									size="md"
									radius="md"
									color="primary"
									isDisabled={loadingRaport}
									href={instance.url ?? ""}
									download={`${title}"-${
										new Date().toISOString().split("T")[0]
									}.pdf`}
								>
									<FileTextIcon className="h-10 w-10" />
									Salvare PDF
								</Button>
							</div>
							<Divider />
						</ModalHeader>
						<ModalBody className="max-w-full p-0 px-2">
							<div className="flex w-full h-full justify-center place-content-center">
								{loadingRaport ? (
									<Spinner size="md" />
								) : (
									<iframe
										title={title}
										src={instance.url ?? ""}
										className="w-full h-full"
									></iframe>
								)}
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default RaportModal;
