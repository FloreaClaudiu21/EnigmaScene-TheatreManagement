import {
	Button,
	Divider,
	Input,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@nextui-org/react";
import React, { useContext, useMemo, useRef } from "react";
import { FileTextIcon, RotateCcwIcon } from "lucide-react";
import CSVRaport from "./CSVRaport";
import dynamic from "next/dynamic";
import { RaportHartie } from "./RaportHartie";

const BlobProvider = dynamic(
	() => import("@react-pdf/renderer").then((mod) => mod.BlobProvider),
	{ ssr: false }
);

function FormularRaportContinut({
	rapModal,
	raportTitle,
	setRaportTitle,
}: {
	rapModal: any;
	raportTitle: string;
	setRaportTitle: any;
}) {
	const inputRef = useRef<any>();
	const rapDoc = useMemo(() => {
		return <RaportHartie titlu={raportTitle} raportModal={rapModal} />;
	}, [raportTitle, rapModal]);
	return (
		<ModalContent className="md:m-4 p-2">
			{() => (
				<BlobProvider document={rapDoc}>
					{({ url, loading, error }) => {
						if (error)
							return (
								<div className="text-red-500">Eroare la generarea pdf-ului</div>
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
												setRaportTitle(inputRef.current.value);
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
												title={raportTitle}
												className="w-full h-full"
											></iframe>
										)}
									</div>
								</ModalBody>
								<ModalFooter className="px-2">
									<CSVRaport
										title={raportTitle}
										loadingRaport={loading}
										raportModal={rapModal}
									/>
									<Button
										as="a"
										size="sm"
										radius="md"
										color="primary"
										isDisabled={loading}
										href={url ?? ""}
										download={`${raportTitle}"-${
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
	);
}

export default FormularRaportContinut;
