"use client";
import { useAddAddressModal, useLoadingScreen } from "@/services/StateProvider";
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
import React from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../ui/form";
import { CodeIcon, FlagIcon, PenIcon, PinIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../../ui/use-toast";
import { addBillingAddress } from "@/services/general/AuthProvider";
import { useRouter } from "next-nprogress-bar";
import { schemaCreareAdresaFacturareClient } from "@/lib/schemas";
import { coduriTariRomanesti } from "@/lib/types";

export default function AddAdressModal() {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const addAddressModal = useAddAddressModal();
	const addForm = useForm<z.infer<typeof schemaCreareAdresaFacturareClient>>({
		resolver: zodResolver(schemaCreareAdresaFacturareClient),
		defaultValues: {
			codClient: addAddressModal.userId,
		},
	});
	async function onSubmitAdd(
		values: z.infer<typeof schemaCreareAdresaFacturareClient>
	) {
		const userId = addAddressModal.userId;
		loadingScreen.setLoading(true);
		const address = await addBillingAddress(userId, values);
		if (!address) {
			toast({
				variant: "destructive",
				title: "Adăugare adresă de facturare",
				description: `Adresa de facturare nu a fost adaugată.`,
			});
			return;
		}
		const addressString =
			address.adresa + ", " + address.oras + ", " + address.tara;
		loadingScreen.setLoading(false);
		addForm.reset();
		router.refresh();
		addAddressModal.onToggle();
		toast({
			title: "Adăugare adresă de facturare",
			description: `Adresa de facturare '${addressString}' a fost adaugată cu sucess.`,
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
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			<ModalContent className="overflow-y-auto max-h-[90vh]">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-xl">
							Adaugă adresă de facturare
						</ModalHeader>
						<ModalBody>
							<Form {...addForm}>
								<form
									className="space-y-4"
									onSubmit={addForm.handleSubmit(onSubmitAdd)}
								>
									<FormField
										control={addForm.control}
										name="adresa"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Adresa*</FormLabel>
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
										name="tara"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Țară*</FormLabel>
												<FormControl>
													<Autocomplete
														radius="md"
														variant="bordered"
														defaultSelectedKey={coduriTariRomanesti[0][0]}
														onSelectionChange={(k) => field.onChange(k)}
													>
														{coduriTariRomanesti.map((country) => (
															<AutocompleteItem
																key={country[0]}
																value={country[0]}
															>
																{country[0] + " " + country[1]}
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
											name="oras"
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2">
													<FormLabel>Oraș*</FormLabel>
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
											name="codPostal"
											control={addForm.control}
											render={({ field }) => (
												<FormItem className="w-full md:w-1/2">
													<FormLabel>Cod Poștal*</FormLabel>
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
										name="observatii"
										control={addForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Observații</FormLabel>
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
											Inchide
										</Button>
										<Button
											radius="md"
											type="submit"
											className="text-white bg-black"
										>
											Salvare
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
