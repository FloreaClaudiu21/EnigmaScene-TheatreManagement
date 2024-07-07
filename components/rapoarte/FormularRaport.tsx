"use client";
import {
	Button,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@nextui-org/react";
import { useMemo, useRef, useState } from "react";
import { formularRaport } from "@/services/general/FurnizorStare";
import { BlobProvider } from "@react-pdf/renderer";
import { FileTextIcon, RotateCcwIcon } from "lucide-react";
import CSVRaport from "./CSVRaport";
import { RaportHartie } from "./RaportHartie";

const FormularRaport = () => {
	const inputRef = useRef<any>();
	const formular = formularRaport();
	const [pdfTitle, setPdfTitle] = useState("Raport evidenta");
	const rapDoc = useMemo(() => {
		return <RaportHartie titlu={pdfTitle} raportModal={formular} />;
	}, [pdfTitle, formular]);
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={formular.vizibil}
			placement={"bottom-center"}
			onOpenChange={() => {
				formular.setVizibil(false);
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
			<ModalContent className="md:m-4 p-2">
				{() => (
					<BlobProvider document={rapDoc}>
						{({ url, loading, error }) => {
							if (error)
								return (
									<div className="text-red-500">
										Eroare la generarea pdf-ului
									</div>
								);
							return (
								<div className="flex h-full flex-col">
									<ModalHeader className="flex flex-col gap-1 px-2 mt-2">
										<div className="flex flex-row gap-2 flex-1 place-items-center justify-center">
											<Input
												size="sm"
												ref={inputRef}
												className="p-0"
												variant="bordered"
												isDisabled={loading}
												defaultValue="Raport evidenta"
												classNames={{ inputWrapper: "h-10" }}
											/>
											<Button
												isIconOnly
												size="sm"
												radius="full"
												color="primary"
												title="Actualizare"
												variant="bordered"
												isDisabled={loading}
												onClick={() => {
													setPdfTitle(inputRef.current.value);
												}}
											>
												<RotateCcwIcon className="h-4 w-4" />
											</Button>
										</div>
										<Divider />
									</ModalHeader>
									<ModalBody className="flex-1 max-w-full p-0 px-2">
										<div className="flex w-full h-full justify-center place-content-center">
											{loading ? (
												<Spinner size="md" />
											) : (
												<iframe
													src={url ?? ""}
													title={pdfTitle}
													className="w-full h-full"
												></iframe>
											)}
										</div>
									</ModalBody>
									<ModalFooter className="px-2">
										<CSVRaport
											title={pdfTitle}
											loadingRaport={loading}
											raportModal={formular}
										/>
										<Button
											as="a"
											size="sm"
											radius="md"
											color="primary"
											isDisabled={loading}
											href={url ?? ""}
											download={`${pdfTitle}"-${
												new Date().toISOString().split("T")[0]
											}.pdf`}
										>
											<FileTextIcon size={18} />
											Salvare PDF
										</Button>
									</ModalFooter>
								</div>
							);
						}}
					</BlobProvider>
				)}
			</ModalContent>
		</Modal>
	);
};

export default FormularRaport;
