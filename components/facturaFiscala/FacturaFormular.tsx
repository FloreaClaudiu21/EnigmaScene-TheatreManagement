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
import { formularFactura } from "@/services/general/FurnizorStare";
import FacturaHartie from "./FacturaHartie";

const FacturaFormular = () => {
	const factura = formularFactura();
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={factura.vizibil}
			placement={"bottom-center"}
			onOpenChange={() => {
				factura.setVizibil(false);
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
							Factura Fiscală #{factura.factura?.numarFactura}
							<Divider />
						</ModalHeader>
						<ModalBody className="max-w-full overflow-scroll">
							<div
								id={"content-invoice-id"}
								ref={componentRef}
								className="h-full"
							>
								<FacturaHartie data={factura.factura!} />
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

export default FacturaFormular;
