"use client";
import { LanguageData } from "@/lib/types";
import {
	useAuth,
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
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import { deleteBillingAddress } from "@/services/general/AuthProvider";
import { useRouter } from "next-nprogress-bar";

export default function DeleteAddressModal({
	langData,
}: {
	langData: LanguageData;
}) {
	const auth = useAuth();
	const router = useRouter();
	const { toast } = useToast();
	const { data, update } = useSession();
	const dict = langData.dictionary;
	const loadingScreen = useLoadingScreen();
	const useDeleteModal = useDeleteAddressModal();
	///////////////////////////////////////////////
	const removeAddress = async () => {
		loadingScreen.setLoading(true);
		const address = await deleteBillingAddress(useDeleteModal.addressId ?? 0);
		if (!address) {
			toast({
				variant: "destructive",
				title: dict.snackbar.titles.deleteAddress,
				description: dict.snackbar.desc.notokDeleteAddress,
			});
			return;
		}
		const newList =
			auth.user?.billingAddresses?.filter(
				(a) => a.id !== useDeleteModal.addressId
			) ?? [];
		const shipAddress =
			address.address + ", " + address.city + ", " + address.country;
		loadingScreen.setLoading(false);
		useDeleteModal.onToggle(null);
		router.refresh();
		await update({
			...data,
			user: {
				...auth.user,
				billingAddresses: newList,
			},
		});
		toast({
			title: dict.snackbar.titles.deleteAddress,
			description: dict.snackbar.desc.okDeleteAddress.replace(
				"{add}",
				shipAddress
			),
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
							{dict.modals.titles.deleteAddress}
						</ModalHeader>
						<ModalBody>
							{dict.modals.desc.confirmDeleteAddress.replace(
								"{addId}",
								useDeleteModal.addressId
							)}
						</ModalBody>
						<ModalFooter>
							<Button variant="light" radius="md" onPress={onClose}>
								{dict.buttons.no}
							</Button>
							<Button
								radius="md"
								className="bg-black text-red-400"
								onClick={() => removeAddress()}
							>
								{dict.buttons.yes}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
