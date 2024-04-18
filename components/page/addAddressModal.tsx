"use client";
import {
	useAddAddressModal,
	useAuth,
	useLoadingScreen,
} from "@/services/StateProvider";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { CodeIcon, FlagIcon, PenIcon, PinIcon } from "lucide-react";
import { addAddressFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { LanguageData, countries } from "@/lib/types";
import { addBillingAddress } from "@/services/general/AuthProvider";
import { useRouter } from "next-nprogress-bar";

export default function AddAdressModal({
	langData,
}: {
	langData: LanguageData;
}) {
	const auth = useAuth();
	const router = useRouter();
	const { toast } = useToast();
	const { data, update } = useSession();
	const loadingScreen = useLoadingScreen();
	const addAddressModal = useAddAddressModal();
	const addForm = useForm<z.infer<typeof addAddressFormSchema>>({
		resolver: zodResolver(addAddressFormSchema),
	});
	const dict = langData.dictionary;
	async function onSubmitAdd(values: z.infer<typeof addAddressFormSchema>) {
		const userId =
			addAddressModal.userId.length > 2
				? addAddressModal.userId
				: auth.user?.id ?? "";
		loadingScreen.setLoading(true);
		const address = await addBillingAddress(userId, values);
		if (!address) {
			toast({
				variant: "destructive",
				title: dict.snackbar.titles.addAddress,
				description: dict.snackbar.desc.notokAddAddress,
			});
			return;
		}
		const shipAddress =
			address.address + ", " + address.city + ", " + address.country;
		const newList = [...(auth.user?.billingAddresses ?? []), address];
		loadingScreen.setLoading(false);
		addForm.reset();
		router.refresh();
		addAddressModal.onToggle();
		await update({
			...data,
			user: {
				...auth.user,
				billingAddresses: newList,
			},
		});
		toast({
			title: dict.snackbar.titles.addAddress,
			description: dict.snackbar.desc.okAddAddress.replace(
				"{add}",
				shipAddress
			),
		});
	}
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				addAddressModal.onToggle();
				document.body.style.overflowY = "auto";
			}}
			isOpen={addAddressModal.visible}
			classNames={{
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
			}}
		>
			<ModalContent className="overflow-y-auto !z-[99999] max-h-[90vh]">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-xl">
							{dict.snackbar.titles.addAddress}
						</ModalHeader>
						<ModalBody>
							<Form {...addForm}>
								<form
									className="space-y-4"
									onSubmit={addForm.handleSubmit(onSubmitAdd)}
								>
									<FormField
										control={addForm.control}
										name="address"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{dict.forms.labels.address}</FormLabel>
												<FormControl>
													<Input
														radius="md"
														variant="bordered"
														required
														endContent={
															<PinIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={addForm.control}
										name="country"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{dict.forms.labels.country}</FormLabel>
												<FormControl>
													<Autocomplete
														variant="bordered"
														radius="md"
														onSelectionChange={(k) => field.onChange(k)}
													>
														{countries.map((country) => (
															<AutocompleteItem key={country} value={country}>
																{country}
															</AutocompleteItem>
														))}
													</Autocomplete>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex flex-col md:flex-row gap-2">
										<FormField
											control={addForm.control}
											name="city"
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2">
													<FormLabel>{dict.forms.labels.city}</FormLabel>
													<FormControl>
														<Input
															radius="md"
															variant="bordered"
															required
															endContent={
																<FlagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
															}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											name="zipCode"
											control={addForm.control}
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2">
													<FormLabel>{dict.forms.labels.zipCode}</FormLabel>
													<FormControl>
														<Input
															type="text"
															radius="md"
															variant="bordered"
															required
															endContent={
																<CodeIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
															}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										name="observations"
										control={addForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>{dict.forms.labels.observations}</FormLabel>
												<FormControl>
													<Input
														type="text"
														radius="md"
														maxLength={200}
														variant="bordered"
														endContent={
															<PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex flex-row justify-end gap-4">
										<Button radius="md" variant="light" onPress={onClose}>
											{dict.buttons.close}
										</Button>
										<Button
											radius="md"
											type="submit"
											className="text-white bg-black"
										>
											{dict.buttons.save}
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
