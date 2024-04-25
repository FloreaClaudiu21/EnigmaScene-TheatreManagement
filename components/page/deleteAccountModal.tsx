import { User } from "next-auth";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { signOut } from "next-auth/react";
import {
	Button,
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { LanguageData } from "@/lib/types";
import { deleteAccountClient } from "@/services/general/AuthProvider";

export default function DeleteAccountModal({
	user,
	visible,
	setVisible,
	langData,
}: {
	user: User;
	langData: LanguageData;
	visible: boolean;
	setVisible: any;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const deleteAccount = async () => {
		setLoading(true);
		const response = await deleteAccountClient(langData.language, user.id);
		if (response.ok) {
			await signOut({
				redirect: false,
			});
			router.refresh();
		}
		toast({
			description: response.error,
			title: langData.dictionary.snackbar.titles.deleteAccount,
			variant: response.ok ? "default" : "destructive",
		});
		setVisible(false);
		setLoading(false);
	};
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				setVisible(false);
				document.body.style.overflowY = "auto";
			}}
			isOpen={visible}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			{loading && (
				<div className="absolute flex flex-col gap-4 justify-center place-items-center top-0 left-0 w-full h-full min-h-screen bg-[rgba(0,0,0,0.8)] z-[999999]">
					<CircularProgress color="primary" />
					<p className="text-base text-white font-bold">
						{langData.dictionary.sections.title.loading}
					</p>
				</div>
			)}
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{langData.dictionary.modals.titles.deleteAccount} `{user.email}`
						</ModalHeader>
						<ModalBody>
							<hr />
							{langData.dictionary.modals.desc.confirmDeleteAccount}
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" radius="md" onPress={onClose}>
								{langData.dictionary.buttons.no}
							</Button>
							<Button
								radius="md"
								onClick={() => deleteAccount()}
								className="bg-red-500 text-white font-semibold"
							>
								{langData.dictionary.buttons.yes}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
