"use client";
import {
	ecranIncarcare,
	formularStergereInregistrari,
} from "@/services/general/FurnizorStare";
import { useToast } from "../../ui/use-toast";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { sterge } from "@/services/backend/GeneralController";

export default function StergereGeneralFormular() {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const deleteModal = formularStergereInregistrari();
	///////////////////////////////////////////////////
	const deleteAction = async (onClose: any) => {
		loadingScreen.setIncarcare(true);
		let response = await sterge(deleteModal.tip, deleteModal.codStergere);
		if (!response) return;
		if (response.ok) {
			toast({
				title: "Ștergere înregistrare",
				description: response.mesaj,
			});
			router.refresh();
		} else {
			toast({
				title: "Ștergere înregistrare",
				description: response.mesaj,
				variant: "destructive",
			});
		}
		loadingScreen.setIncarcare(false);
		onClose();
	};
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				deleteModal.setVizibil(false);
				document.body.style.overflowY = "auto";
			}}
			isOpen={deleteModal.vizibil}
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
							Ștergere înregistrare
						</ModalHeader>
						<ModalBody>
							Ești sigur că dorești să ștergi înregistrarea cu codul de
							identificare `{deleteModal.codStergere}`?
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" radius="md" onPress={onClose}>
								NU
							</Button>
							<Button
								radius="md"
								className="bg-red-500 text-white font-semibold"
								onClick={() => deleteAction(onClose)}
							>
								DA
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
