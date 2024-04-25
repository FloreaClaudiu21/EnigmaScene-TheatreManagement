"use client";
import { useAuth, useLoadingScreen } from "@/services/StateProvider";
import { useToast } from "../../ui/use-toast";
import {
	Button,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@nextui-org/react";
import { LanguageData } from "@/lib/types";
import { useRouter } from "next-nprogress-bar";
import { deleteCookie } from "cookies-next";
import { signIn, signOut } from "next-auth/react";
import { loginFormSchema } from "@/lib/schemas";
import { z } from "zod";
import { verifyAccountIsActivated } from "@/services/general/EmailProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";
import { getClientByEmail } from "@/services/general/AuthProvider";
import { useEffect, useState } from "react";
import { urlLink } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AdminSignInModal({
	langData,
}: {
	langData: LanguageData;
}) {
	const auth = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [showPassLogin, setShowPassLogin] = useState(false);
	const loginForm = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
	});
	useEffect(() => {
		if (!auth.isLogged && !pathname.endsWith("/dashboard")) {
			router.replace(urlLink(pathname));
		}
	}, [auth.isLogged]);
	async function onLoginProvider(prov: string) {
		deleteCookie("signInProviderLinkParams");
		await signIn(prov, {
			redirect: false,
		});
	}
	async function onSubmitLogin(values: z.infer<typeof loginFormSchema>) {
		loadingScreen.setLoading(true);
		const accountActive = await verifyAccountIsActivated("en", values.email);
		if (!accountActive.ok) {
			loadingScreen.setLoading(false);
			toast({
				variant: "destructive",
				title: "Account verfication",
				description: accountActive.message,
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
			const user = await getClientByEmail(values.email);
			if (!user?.adminUser) {
				router.push("/");
				toast({
					variant: "destructive",
					title: "Member Login: Access Your Account",
					description: `You must be admin in order to access the dashboard.`,
				});
				await signOut({
					redirect: false,
				});
				return;
			}
			document.body.style.overflowY = "auto";
			toast({
				title: "Member Login: Access Your Account",
				description: `Successfully logged in with the account associated with the email address: ${values.email}.`,
			});
		} else {
			toast({
				title: "Member Login: Access Your Account",
				variant: "destructive",
				description: data.error,
			});
		}
		loadingScreen.setLoading(false);
	}
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			isOpen={!auth.isLogged}
			placement={"bottom-center"}
			onOpenChange={() => {
				document.body.style.overflowY = "auto";
			}}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-center pb-1">
							<p>
								Sign In to{" "}
								<span className="text-red-500">Enigma Scene Theatre</span>
								<br /> Admin Panel
							</p>
						</ModalHeader>
						<ModalBody>
							<Form {...loginForm}>
								<form
									className="space-y-2 border-t-1 py-2"
									onSubmit={loginForm.handleSubmit(onSubmitLogin)}
								>
									<FormField
										control={loginForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email*</FormLabel>
												<FormControl>
													<Input
														type="email"
														radius="md"
														placeholder="youremail@gmail.com"
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
									<FormField
										control={loginForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password*</FormLabel>
												<FormControl>
													<Input
														required
														radius="md"
														placeholder="*******"
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
										<span className="flex-shrink mx-4 text-gray-400">or</span>
										<div className="flex-grow border-t border-gray-400"></div>
									</div>
									<div className="flex flex-col justify-center gap-2">
										<Button
											radius="md"
											variant="faded"
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
											Sign in with Google
										</Button>
									</div>
									<div className="flex flex-row justify-end gap-4 !mt-6">
										<Button
											radius="md"
											type="submit"
											className="bg-black font-bold text-white"
										>
											Sign In
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
