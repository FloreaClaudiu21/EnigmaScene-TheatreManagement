"use client";
import { useDeleteModal } from "@/services/StateProvider";
import { useToast } from "../../ui/use-toast";
import {
	Button,
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { LanguageData, TableTypes } from "@/lib/types";
import { useRouter } from "next-nprogress-bar";
import { deleteClient } from "@/services/admin/ClientsProvider";
import {
	deleteCategory,
	deleteDistribution,
	deleteSeason,
} from "@/services/admin/ShowsProvider";

export default function DeleteModalGeneral({
	langData,
}: {
	langData: LanguageData;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const deleteModal = useDeleteModal();
	const [loading, setLoading] = useState(false);
	//////////////////////////////////////////////
	const deleteAction = async (onClose: any) => {
		setLoading(true);
		let response = null;
		switch (deleteModal.type) {
			case TableTypes.CLIENTS: {
				response = await deleteClient(langData.language, deleteModal.deleteId);
				break;
			}
			case TableTypes.SHOWS_SEASON: {
				response = await deleteSeason(langData.language, deleteModal.deleteId);
				break;
			}
			case TableTypes.SHOWS_CATEGORY: {
				response = await deleteCategory(
					langData.language,
					deleteModal.deleteId
				);
				break;
			}
			case TableTypes.SHOWS_DISTRIBUTION: {
				response = await deleteDistribution(
					langData.language,
					deleteModal.deleteId
				);
				break;
			}
		}
		if (!response) return;
		if (response.ok) {
			toast({
				title: "Record Delete",
				description: response.message,
			});
			router.refresh();
		} else {
			toast({
				title: "Record Delete",
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
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
			}}
		>
			{loading && (
				<div className="absolute flex flex-col gap-4 justify-center place-items-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)] z-[999999]">
					<CircularProgress color="primary" />
					<p className="text-base text-white font-bold">Loading...</p>
				</div>
			)}
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Delete the record with ID #{deleteModal.deleteId}
						</ModalHeader>
						<ModalBody>
							<hr />
							Are you sure you want to delete this record, this action can`t be
							undone!
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" radius="md" onPress={onClose}>
								No
							</Button>
							<Button
								radius="md"
								className="bg-red-500 text-white font-semibold"
								onClick={() => deleteAction(onClose)}
							>
								Yes
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
