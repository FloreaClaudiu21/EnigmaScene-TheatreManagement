"use client";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@nextui-org/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { resetPassSchema } from "@/lib/schemas";
import { useLoadingScreen, useResetPassModal } from "@/services/StateProvider";
import { useToast } from "../ui/use-toast";
import { LanguageData } from "@/lib/types";
import { resetPasswordClient } from "@/services/general/AuthProvider";

export default function ResetPassModal({
	langData,
}: {
	langData: LanguageData;
}) {
	const { toast } = useToast();
	const dictionary = langData.dictionary;
	const loadingScreen = useLoadingScreen();
	const resetPassModal = useResetPassModal();
	const [showPassRegister, setShowPassRegister] = useState(false);
	const [showPassRegister1, setShowPassRegister1] = useState(false);
	const resetPassForm = useForm<z.infer<typeof resetPassSchema>>({
		resolver: zodResolver(resetPassSchema),
	});
	async function onSubmit(values: z.infer<typeof resetPassSchema>) {
		loadingScreen.setLoading(true);
		const res = await resetPasswordClient(
			langData.language,
			resetPassModal.user,
			values.password
		);
		if (res.ok && res.status == 200) {
			resetPassModal.setUser("");
			resetPassModal.setVisible(false);
		}
		toast({
			description: res.error,
			title: dictionary.snackbar.titles.passReset,
			variant: res.ok ? "default" : "destructive",
		});
		loadingScreen.setLoading(false);
	}
	return (
		<Modal
			size="lg"
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				resetPassModal.onToggle();
				resetPassModal.setUser("");
				document.body.style.overflowY = "auto";
			}}
			isOpen={resetPassModal.visible}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-lg">
							{dictionary.modals.titles.resetPass.replace(
								"{user}",
								resetPassModal.user
							)}
						</ModalHeader>
						<ModalBody>
							<Form {...resetPassForm}>
								<form
									className="space-y-2"
									onSubmit={resetPassForm.handleSubmit(onSubmit)}
								>
									<FormField
										control={resetPassForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{dictionary.forms.labels.password}
												</FormLabel>
												<FormControl>
													<Input
														required
														radius="md"
														endContent={
															!showPassRegister ? (
																<EyeIcon
																	onClick={() => {
																		setShowPassRegister(true);
																	}}
																	className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
																/>
															) : (
																<EyeOffIcon
																	onClick={() => {
																		setShowPassRegister(false);
																	}}
																	className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
																/>
															)
														}
														type={showPassRegister ? "text" : "password"}
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="rePassword"
										control={resetPassForm.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{dictionary.forms.labels.repassword}
												</FormLabel>
												<FormControl>
													<Input
														required
														radius="md"
														endContent={
															!showPassRegister1 ? (
																<EyeIcon
																	onClick={() => {
																		setShowPassRegister1(true);
																	}}
																	className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
																/>
															) : (
																<EyeOffIcon
																	onClick={() => {
																		setShowPassRegister1(false);
																	}}
																	className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
																/>
															)
														}
														type={showPassRegister1 ? "text" : "password"}
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex flex-row justify-end gap-4">
										<Button
											radius="md"
											variant="light"
											onPress={onClose}
											className="text-red-400"
										>
											{dictionary.buttons.cancel}
										</Button>
										<Button
											radius="md"
											type="submit"
											variant="solid"
											className="bg-black text-white"
										>
											{dictionary.buttons.reset}
										</Button>
									</div>
								</form>
							</Form>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
