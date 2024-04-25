"use client";
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
import { useEffect } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { MailIcon, PhoneIcon, SquareUserIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { firstTimeAccountSchema } from "@/lib/schemas";
import { useToast } from "../ui/use-toast";
import { registerWithCredentialsorProvider } from "@/services/general/AuthProvider";
import { usePathname } from "next/navigation";
import {
	useFirstTimeAccountModal,
	useLoadingScreen,
} from "@/services/StateProvider";
import { signIn } from "next-auth/react";
import {
	LanguageData,
	coduriTariRomanesti,
	countryCodesArray,
} from "@/lib/types";

export default function FirstTimeAccountModal({
	langData,
}: {
	langData: LanguageData;
}) {
	const { toast } = useToast();
	const pathname = usePathname();
	const dictionary = langData.dictionary;
	const loadingScreen = useLoadingScreen();
	const firstTimeModal = useFirstTimeAccountModal();
	const prefixesPhone =
		langData.language == "ro" ? coduriTariRomanesti : countryCodesArray;
	const firstTimeForm = useForm<z.infer<typeof firstTimeAccountSchema>>({
		resolver: zodResolver(firstTimeAccountSchema),
		defaultValues: {
			email: firstTimeModal.user?.email,
			lastName: firstTimeModal.user?.lastName,
			firstName: firstTimeModal.user?.firstName,
		},
	});
	async function onSubmitRegister(
		values: z.infer<typeof firstTimeAccountSchema>
	) {
		if (!values.terms) {
			toast({
				title: dictionary.snackbar.titles.accountRegistration,
				description: dictionary.snackbar.desc.acceptTerms,
			});
			return;
		}
		loadingScreen.setLoading(true);
		const data = await registerWithCredentialsorProvider(
			{
				phone: values.prefix + values.phone,
				birthDate: values.birthDate,
				email: values.email,
				firstName: values.firstName,
				lastName: values.lastName,
				password: "",
			},
			langData.language,
			pathname,
			firstTimeModal.user
		);
		if (!data.ok) {
			firstTimeModal.onToggle();
			loadingScreen.setLoading(false);
			toast({
				variant: "destructive",
				description: data.error,
				title: dictionary.snackbar.titles.accountRegistration,
			});
			return;
		}
		const signInRes = await signIn("credentials", {
			redirect: false,
			email: firstTimeModal.user?.email,
			provider: firstTimeModal.user?.provider,
		});
		if (!signInRes?.ok) {
			firstTimeModal.onToggle();
			loadingScreen.setLoading(false);
			toast({
				variant: "destructive",
				description: signInRes?.error,
				title: dictionary.snackbar.titles.accountRegistration,
			});
			return;
		}
		firstTimeModal.onToggle();
		loadingScreen.setLoading(false);
		toast({
			description: data.error,
			title: "Account registration",
			variant: signInRes.ok ? "default" : "destructive",
		});
	}
	useEffect(() => {
		firstTimeForm.reset({
			email: firstTimeModal.user?.email,
			lastName: firstTimeModal.user?.lastName,
			firstName: firstTimeModal.user?.firstName,
		});
	}, [firstTimeModal, firstTimeForm]);
	return (
		<Modal
			size="lg"
			radius="md"
			backdrop="opaque"
			isOpen={firstTimeModal.visible}
			placement={"bottom-center"}
			onOpenChange={() => {
				firstTimeForm.reset();
				firstTimeModal.onToggle();
				document.body.style.overflowY = "auto";
			}}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			<ModalContent className="overflow-y-auto max-h-[90vh]">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-xl">
							{dictionary.modals.titles.createAccount}
						</ModalHeader>
						<ModalBody>
							<Form {...firstTimeForm}>
								<form
									className="space-y-2"
									onSubmit={firstTimeForm.handleSubmit(onSubmitRegister)}
								>
									<div className="flex flex-col md:flex-row gap-2">
										<FormField
											control={firstTimeForm.control}
											name="firstName"
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2">
													<FormLabel>
														{dictionary.forms.labels.firstName}
													</FormLabel>
													<FormControl>
														<Input
															radius="md"
															variant="bordered"
															required
															endContent={
																<SquareUserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
															}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={firstTimeForm.control}
											name="lastName"
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2">
													<FormLabel>
														{dictionary.forms.labels.lastName}
													</FormLabel>
													<FormControl>
														<Input
															radius="md"
															variant="bordered"
															required
															endContent={
																<SquareUserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
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
										name="email"
										control={firstTimeForm.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>{dictionary.forms.labels.email}</FormLabel>
												<FormControl>
													<Input
														isDisabled
														type="email"
														radius="md"
														variant="bordered"
														required
														endContent={
															<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex flex-col md:flex-row gap-2">
										<FormField
											name="prefix"
											control={firstTimeForm.control}
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2">
													<FormLabel>{dictionary.forms.labels.phone}</FormLabel>
													<FormControl>
														<Autocomplete
															radius="md"
															label="Prefix"
															variant="bordered"
															onSelectionChange={field.onChange}
															{...field}
														>
															{prefixesPhone.map((array, index) => {
																return (
																	<AutocompleteItem
																		className="px-0"
																		value={array[1]}
																		key={array[1]}
																		title={array[1] + " (" + array[0] + ")"}
																	>
																		{array[1] + " (" + array[0] + ")"}
																	</AutocompleteItem>
																);
															})}
														</Autocomplete>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											name="phone"
											control={firstTimeForm.control}
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2 md:mt-8">
													<FormControl>
														<Input
															type="phone"
															radius="md"
															variant="bordered"
															required
															endContent={
																<PhoneIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
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
										name="birthDate"
										control={firstTimeForm.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{dictionary.forms.labels.birthDate}
												</FormLabel>
												<FormControl>
													<Input
														radius="md"
														type="date"
														variant="bordered"
														required
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex flex-row py-2 px-1 justify-between">
										<FormField
											name="terms"
											control={firstTimeForm.control}
											render={({ field }) => (
												<FormItem className="flex flex-row items-start place-items-center space-x-3 m-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="!m-0 !ml-2">
														{dictionary.buttons.acceptTerms}
													</FormLabel>
												</FormItem>
											)}
										/>
									</div>
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
											className="bg-black text-white"
										>
											{dictionary.buttons.register}
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
