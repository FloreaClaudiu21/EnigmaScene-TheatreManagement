"use client";
import {
	useDeleteAddressModal,
	useLoadingScreen,
} from "@/services/StateProvider";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useToast } from "../../ui/use-toast";
import { deleteBillingAddress } from "@/services/general/AuthProvider";
import { useRouter } from "next-nprogress-bar";

export default function DeleteAddressModal() {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const useDeleteModal = useDeleteAddressModal();
	///////////////////////////////////////////////
	const removeAddress = async () => {
		loadingScreen.setLoading(true);
		const address = await deleteBillingAddress(useDeleteModal.addressId ?? 0);
		if (!address) {
			toast({
				variant: "destructive",
				title: "Ștergere adresă de facturare",
				description: `Adresa de facturare nu a fost ștearsă.`,
			});
			return;
		}
		const addressString =
			address.adresa + ", " + address.oras + ", " + address.tara;
		loadingScreen.setLoading(false);
		useDeleteModal.onToggle(null);
		router.refresh();
		toast({
			title: "Ștergere adresă de facturare",
			description: `Adresa de facturare '${addressString}' a fost ștearsă cu sucess.`,
		});
	};
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				useDeleteModal.onToggle(null);
				document.body.style.overflowY = "auto";
			}}
			isOpen={useDeleteModal.addressId != null}
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
							Șterge adresă de facturare
						</ModalHeader>
						<ModalBody>
							Ești sigur că dorești să ștergi adresa de facturare cu codul de
							identificare `{useDeleteModal.addressId}`?
						</ModalBody>
						<ModalFooter>
							<Button variant="light" radius="md" onPress={onClose}>
								NU
							</Button>
							<Button
								radius="md"
								className="bg-black text-red-400"
								onClick={() => removeAddress()}
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
