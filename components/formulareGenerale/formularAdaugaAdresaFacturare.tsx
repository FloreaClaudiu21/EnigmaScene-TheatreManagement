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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next-nprogress-bar";
import { schemaCreareAdresaFacturareClient } from "@/lib/schemeFormulare";
import {
	ecranIncarcare,
	formularCreareAdresa,
} from "@/services/general/FurnizorStare";
import { coduriTariRomanesti } from "@/lib/tipuri";
import { adaugaAdresaFacturare } from "@/services/backend/adreseFacturare/adreseFacturare";

export default function FormularAdaugaAdresaFacturare() {
	const router = useRouter();
	const { toast } = useToast();
	const ecranIncarcareV = ecranIncarcare();
	const formularAdaugareAdresa = formularCreareAdresa();
	const formularAdaugare = useForm<
		z.infer<typeof schemaCreareAdresaFacturareClient>
	>({
		resolver: zodResolver(schemaCreareAdresaFacturareClient),
		defaultValues: {
			codClient: formularAdaugareAdresa.codUtilizator,
		},
	});

	async function onSubmitAdauga(
		values: z.infer<typeof schemaCreareAdresaFacturareClient>
	) {
		const userId = formularAdaugareAdresa.codUtilizator;
		ecranIncarcareV.setIncarcare(true);
		const adresa = await adaugaAdresaFacturare(userId, values);
		if (!adresa) {
			toast({
				variant: "destructive",
				title: "Adăugare adresă de facturare",
				description: `Adresa de facturare nu a fost adăugată.`,
			});
			return;
		}
		const adresaString =
			adresa.adresa + ", " + adresa.oras + ", " + adresa.tara;
		ecranIncarcareV.setIncarcare(false);
		formularAdaugare.reset();
		router.refresh();
		formularAdaugareAdresa.onToggle();
		toast({
			title: "Adăugare adresă de facturare",
			description: `Adresa de facturare '${adresaString}' a fost adăugată cu succes.`,
		});
	}

	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				formularAdaugareAdresa.onToggle();
				document.body.style.overflowY = "auto";
			}}
			isOpen={formularAdaugareAdresa.vizibil}
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
							<Form {...formularAdaugare}>
								<form
									className="space-y-4"
									onSubmit={formularAdaugare.handleSubmit(onSubmitAdauga)}
								>
									<FormField
										control={formularAdaugare.control}
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
										control={formularAdaugare.control}
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
														{coduriTariRomanesti.map((tara) => (
															<AutocompleteItem key={tara[0]} value={tara[0]}>
																{tara[0] + " " + tara[1]}
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
											control={formularAdaugare.control}
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
											control={formularAdaugare.control}
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
										control={formularAdaugare.control}
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
											Închide
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
