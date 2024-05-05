"use client";
import { useDeleteModal, useLoadingScreen } from "@/services/StateProvider";
import { useToast } from "../../ui/use-toast";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { remove } from "@/services/admin/ControlProvider";

export default function DeleteModalGeneral() {
	const router = useRouter();
	const { toast } = useToast();
	const deleteModal = useDeleteModal();
	const loadingScreen = useLoadingScreen();
	const [loading, setLoading] = useState(false);
	//////////////////////////////////////////////
	const deleteAction = async (onClose: any) => {
		setLoading(true);
		let response = await remove(deleteModal.type, deleteModal.deleteId);
		if (!response) return;
		if (response.ok) {
			toast({
				title: "Ștergere înregistrare",
				description: response.message,
			});
			router.refresh();
		} else {
			toast({
				title: "Ștergere înregistrare",
				description: response.message,
				variant: "destructive",
			});
		}
		setLoading(false);
		onClose();
	};
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				deleteModal.setVisible(false);
				document.body.style.overflowY = "auto";
			}}
			isOpen={deleteModal.visible}
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
							identificare `{deleteModal.deleteId}`?
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
