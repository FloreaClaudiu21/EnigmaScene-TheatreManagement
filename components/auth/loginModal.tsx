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
	Tab,
	Tabs,
} from "@nextui-org/react";
import {
	EyeIcon,
	EyeOffIcon,
	MailIcon,
	PhoneIcon,
	SquareUserIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
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
import { Checkbox } from "../ui/checkbox";
import { loginFormSchema, registerSchema } from "@/lib/schemas";
import {
	sendPasswordForgotEmail,
	verifyAccountIsActivated,
} from "@/services/general/EmailProvider";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { registerWithCredentialsorProvider } from "@/services/general/AuthProvider";
import {
	LanguageData,
	coduriTariRomanesti,
	countryCodesArray,
} from "@/lib/types";
import { deleteCookie } from "cookies-next";
import { useLoadingScreen, useLoginModal } from "@/services/StateProvider";

export default function LoginModal({ langData }: { langData: LanguageData }) {
	const { toast } = useToast();
	const pathname = usePathname();
	const loginModal = useLoginModal();
	const dict = langData.dictionary;
	const loadingScreen = useLoadingScreen();
	const [selectedTab, setSelectedTab] = useState("signin");
	const [showPassLogin, setShowPassLogin] = useState(false);
	const [showPassRegister, setShowPassRegister] = useState(false);
	const [showPassRegister1, setShowPassRegister1] = useState(false);
	const prefixesPhone =
		langData.language == "ro" ? coduriTariRomanesti : countryCodesArray;
	const title =
		selectedTab == "signin"
			? dict.forms.labels.signIn
			: dict.forms.labels.register;
	const loginForm = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
	});
	const registerForm = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
	});
	async function onLoginProvider(prov: string) {
		deleteCookie("signInProviderLinkParams");
		await signIn(prov, {
			redirect: false,
		});
	}
	async function sendResetMail() {
		const res = await sendPasswordForgotEmail(
			langData.language,
			loginForm.getValues().email,
			pathname
		);
		toast({
			description: res.message,
			title: dict.snackbar.titles.passResetEmail,
			variant: res.ok ? "default" : "destructive",
		});
	}
	async function onSubmitRegister(values: z.infer<typeof registerSchema>) {
		if (!values.terms) {
			toast({
				title: dict.snackbar.titles.accountRegistration,
				description: dict.snackbar.desc.acceptTerms,
			});
			return;
		}
		loadingScreen.setLoading(true);
		const data = await registerWithCredentialsorProvider(
			{
				email: values.email,
				lastName: values.lastName,
				password: values.password,
				firstName: values.firstName,
				phone: values.prefix + values.phone,
				birthDate: values.birthDate,
			},
			langData.language,
			pathname
		);
		if (data.ok && data.user != undefined) {
			registerForm.reset();
			setSelectedTab("signin");
		}
		toast({
			description: data.error,
			title: dict.snackbar.titles.accountRegistration,
			variant: data.ok ? "default" : "destructive",
		});
		loadingScreen.setLoading(false);
	}
	async function onSubmitLogin(values: z.infer<typeof loginFormSchema>) {
		loadingScreen.setLoading(true);
		const accountActive = await verifyAccountIsActivated(
			langData.language,
			values.email
		);
		if (!accountActive.ok) {
			loadingScreen.setLoading(false);
			toast({
				variant: "destructive",
				description: accountActive.message,
				title: dict.snackbar.titles.accountVerification,
			});
			return;
		}
		const data = await signIn("credentials", {
			redirect: false,
			email: values.email,
			password: values.password,
		});
		if (!data) {
			return;
		}
		if (data.ok) {
			loginForm.reset();
			loginModal.onToggle();
			document.body.style.overflowY = "auto";
			toast({
				title: dict.snackbar.titles.accountLogin,
				description: dict.snackbar.desc.accountLoginok.replace(
					"{email}",
					values.email
				),
			});
		} else {
			toast({
				variant: "destructive",
				description: data.error,
				title: dict.snackbar.titles.accountLogin,
			});
		}
		loadingScreen.setLoading(false);
	}
	return (
		<Modal
			isOpen={loginModal.visible}
			size="lg"
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				loginForm.reset();
				registerForm.reset();
				loginModal.onToggle();
				document.body.style.overflowY = "auto";
			}}
			classNames={{
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
			}}
		>
			<ModalContent className="overflow-y-auto !z-[99999] max-h-[90vh]">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-xl">
							{title}
						</ModalHeader>
						<ModalBody>
							<Tabs
								radius="md"
								selectedKey={selectedTab}
								onSelectionChange={(e) => {
									setSelectedTab(e.toString());
								}}
							>
								<Tab
									key="signin"
									title={
										<div className="flex items-center space-x-2">
											<span>{dict.forms.labels.signIn}</span>
										</div>
									}
								>
									<Form {...loginForm}>
										<form
											className="space-y-2"
											onSubmit={loginForm.handleSubmit(onSubmitLogin)}
										>
											<FormField
												control={loginForm.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{dict.forms.labels.email}</FormLabel>
														<FormControl>
															<Input
																type="email"
																radius="md"
																variant="bordered"
																placeholder="youremail@gmail.com"
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
											<FormField
												control={loginForm.control}
												name="password"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{dict.forms.labels.password}</FormLabel>
														<FormControl>
															<Input
																required
																radius="md"
																placeholder="********"
																endContent={
																	!showPassLogin ? (
																		<EyeIcon
																			onClick={() => {
																				setShowPassLogin(true);
																			}}
																			className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
																		/>
																	) : (
																		<EyeOffIcon
																			onClick={() => {
																				setShowPassLogin(false);
																			}}
																			className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
																		/>
																	)
																}
																type={showPassLogin ? "text" : "password"}
																variant="bordered"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<div className="relative flex py-3 items-center">
												<div className="flex-grow border-t border-gray-400"></div>
												<span className="flex-shrink mx-4 text-gray-400">
													or
												</span>
												<div className="flex-grow border-t border-gray-400"></div>
											</div>
											<div className="flex flex-col justify-center gap-2">
												<Button
													radius="md"
													color="primary"
													className="shadow-md"
													onClick={() => onLoginProvider("google")}
													startContent={
														<Image
															src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
															alt=""
															width={24}
															height={24}
														/>
													}
												>
													{dict.buttons.signInGoogle}
												</Button>
											</div>
											<div className="flex flex-row py-4 justify-end">
												<Button
													radius="md"
													disableRipple
													variant="ghost"
													onClick={sendResetMail}
													className="text-sm border-none p-1 hover:underline"
												>
													{dict.buttons.forgotPass}
												</Button>
											</div>
											<div className="flex flex-row justify-end gap-4">
												<Button
													radius="md"
													variant="light"
													onPress={onClose}
													className="text-red-400"
												>
													{dict.buttons.cancel}
												</Button>
												<Button
													radius="md"
													type="submit"
													variant="solid"
													className="bg-black text-white"
												>
													{dict.forms.labels.signIn}
												</Button>
											</div>
										</form>
									</Form>
								</Tab>
								<Tab
									key="register"
									title={
										<div className="flex items-center space-x-2">
											<span>{dict.forms.labels.register}</span>
										</div>
									}
								>
									<Form {...registerForm}>
										<form
											className="space-y-2"
											onSubmit={registerForm.handleSubmit(onSubmitRegister)}
										>
											<div className="flex flex-col md:flex-row gap-2">
												<FormField
													control={registerForm.control}
													name="firstName"
													render={({ field }) => (
														<FormItem className="w-full md:w-1/2">
															<FormLabel>
																{dict.forms.labels.firstName}
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
													control={registerForm.control}
													name="lastName"
													render={({ field }) => (
														<FormItem className="w-full md:w-1/2">
															<FormLabel>
																{dict.forms.labels.lastName}
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
												control={registerForm.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>{dict.forms.labels.email}</FormLabel>
														<FormControl>
															<Input
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
													control={registerForm.control}
													render={({ field }) => (
														<FormItem className="w-full md:w-1/2">
															<FormLabel>{dict.forms.labels.phone}</FormLabel>
															<FormControl>
																<Autocomplete
																	radius="md"
																	label="Prefix"
																	variant="bordered"
																	onSelectionChange={field.onChange}
																	{...field}
																>
																	{prefixesPhone.map((array) => {
																		return (
																			<AutocompleteItem
																				key={array[1]}
																				className="px-0"
																				value={array[1]}
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
													control={registerForm.control}
													render={({ field }) => (
														<FormItem className="w-full md:w-1/2 md:mt-8">
															<FormControl>
																<Input
																	type="phone"
																	radius="md"
																	placeholder="0723******"
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
												control={registerForm.control}
												render={({ field }) => (
													<FormItem>
														<FormLabel>{dict.forms.labels.birthDate}</FormLabel>
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
											<div className="flex flex-col md:flex-row gap-2">
												<FormField
													name="password"
													control={registerForm.control}
													render={({ field }) => (
														<FormItem className="w-full md:w-1/2">
															<FormLabel>
																{dict.forms.labels.password}
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
													control={registerForm.control}
													render={({ field }) => (
														<FormItem className="w-full md:w-1/2">
															<FormLabel>
																{dict.forms.labels.repassword}
															</FormLabel>
															<FormControl>
																<Input
																	required
																	radius="md"
																	variant="bordered"
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
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<div className="flex flex-row py-2 px-1 justify-between">
												<FormField
													name="terms"
													control={registerForm.control}
													render={({ field }) => (
														<FormItem className="flex flex-row items-start place-items-center space-x-3 m-0">
															<FormControl>
																<Checkbox
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
															<FormLabel className="!m-0 !ml-2">
																{dict.buttons.acceptTerms}
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
													{dict.forms.labels.cancel}
												</Button>
												<Button
													radius="md"
													type="submit"
													className="bg-black text-white"
												>
													{dict.forms.labels.register}
												</Button>
											</div>
										</form>
									</Form>
								</Tab>
							</Tabs>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
