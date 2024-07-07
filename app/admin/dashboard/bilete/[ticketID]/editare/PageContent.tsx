"use client";
import NouEditareContinut from "@/components/admin/NouEditareContinut";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { schemaCreareBiletSpectacol } from "@/lib/schemeFormulare";
import {
	AdresaFacturare,
	BiletSpectacol,
	coduriTariRomanesti,
	TipuriTabel,
} from "@/lib/tipuri";
import { actualizare } from "@/services/backend/GeneralController";
import {
	ecranIncarcare,
	formularCreareAdresa,
} from "@/services/general/FurnizorStare";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Checkbox,
	Input,
	Tooltip,
} from "@nextui-org/react";
import {
	MailIcon,
	PenIcon,
	PhoneIcon,
	PlusIcon,
	SquareUserIcon,
} from "lucide-react";
import { Client } from "next-auth";
import { useRouter } from "next-nprogress-bar";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminTicketSoldEdit({
	clients,
	ticket,
}: {
	clients: Client[];
	ticket: BiletSpectacol;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const addAddress = formularCreareAdresa();
	const loadingScreen = ecranIncarcare();
	const defClient = clients.filter((c) => c.codClient === ticket.codClient);
	const [generateInvoice, setGenerateInvoice] = useState(
		ticket.factura != null && ticket.factura != undefined
	);
	const [selectedClient, setSelectedClient] = useState<Client | null>(
		defClient.length > 0 ? defClient[0] : null
	);
	const billingAddreses = useCallback(
		() => selectedClient?.adreseFacturare ?? [],
		[selectedClient]
	);
	const form = useForm<z.infer<typeof schemaCreareBiletSpectacol>>({
		resolver: zodResolver(schemaCreareBiletSpectacol),
		defaultValues: {
			genereazaFacturaFiscala: generateInvoice + "",
			tipPlata: ticket.plata?.tipPlata,
			codClient: ticket.codClient,
			codSalaSpectacol: ticket.codSalaSpectacol,
			codSpectacol: ticket.codSpectacol,
			pretVanzare: ticket.pretVanzare + "",
			adresaFacturare:
				ticket.factura?.adresaFacturare == undefined
					? generateInvoice
						? ""
						: "null"
					: ticket.factura.adresaFacturare,
			numeClient:
				ticket.factura?.numeClient == undefined
					? generateInvoice
						? selectedClient?.numeClient ?? ""
						: "null"
					: ticket.factura.numeClient,
			email:
				ticket.factura?.email == undefined
					? generateInvoice
						? selectedClient?.email ?? ""
						: "null"
					: ticket.factura.email,
			telefon:
				ticket.factura?.telefon == undefined
					? generateInvoice
						? selectedClient?.telefon.substring(3) ?? ""
						: "nullnull"
					: ticket.factura?.telefon.substring(3),
			prefix:
				ticket.factura?.telefon == undefined
					? generateInvoice
						? selectedClient?.telefon.substring(3, 0) ?? ""
						: "null"
					: ticket.factura?.telefon.substring(3, 0),
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareBiletSpectacol>) {
		loadingScreen.setIncarcare(true);
		const data = await actualizare(
			TipuriTabel.BILET,
			values,
			ticket.codBiletSpectacol
		);
		toast({
			description: data.mesaj,
			title: "Editare Vânzare Bilet",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../bilete?tab=ticketsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setIncarcare(false);
	}
	return (
		<NouEditareContinut
			form={form}
			onSubmit={onSubmit}
			back_link="../../bilete?tab=ticketsAll"
			titlu={`Editați biletul vândut cu codul de identificare #${ticket.codBiletSpectacol}`}
			loading={loadingScreen.incarcare}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="codClient"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Client*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									defaultSelectedKey={
										selectedClient != null
											? JSON.stringify(selectedClient)
											: undefined
									}
									onSelectionChange={(c) => {
										if (!c) return;
										const client = JSON.parse(c.toString()) as Client;
										field.onChange(client.codClient);
										setSelectedClient(client);
									}}
									{...field}
								>
									{clients.map((c, index) => {
										return (
											<AutocompleteItem
												value={JSON.stringify(c)}
												key={JSON.stringify(c)}
											>
												{index + 1 + ". " + c.email + " | " + c.numeClient}
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
					control={form.control}
					name="tipPlata"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Tip Plata*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									required
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
			</div>

			<FormField
				control={form.control}
				name="pretVanzare"
				render={({ field }) => (
					<FormItem className="w-full md:w-1/2">
						<FormLabel>Pret Vanzare Bilet (RON)*</FormLabel>
						<FormControl>
							<Input
								radius="md"
								variant="bordered"
								isDisabled
								required
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
			<FormField
				control={form.control}
				name="genereazaFacturaFiscala"
				render={({ field }) => (
					<FormItem className="w-full mt-4">
						<FormControl>
							<Checkbox
								radius="md"
								required
								isSelected={generateInvoice}
								onValueChange={(e) => {
									field.onChange(e + "");
									setGenerateInvoice(e);
									if (e) {
										form.setValue(
											"adresaFacturare",
											ticket.factura != null
												? ticket.factura.adresaFacturare
												: ""
										);
										form.setValue(
											"email",
											ticket.factura != null
												? ticket.factura.email
												: selectedClient?.email ?? ""
										);
										form.setValue(
											"numeClient",
											ticket.factura != null
												? ticket.factura.numeClient
												: selectedClient?.numeClient ?? ""
										);
										form.setValue(
											"telefon",
											ticket.factura != null
												? ticket.factura.telefon.substring(3)
												: selectedClient?.telefon.substring(3) ?? ""
										);
										form.setValue(
											"prefix",
											ticket.factura != null
												? ticket.factura.telefon.substring(3, 0)
												: selectedClient?.telefon.substring(3, 0) ?? ""
										);
									} else {
										form.setValue("adresaFacturare", "null");
										form.setValue("email", "null");
										form.setValue("numeClient", "null");
										form.setValue("telefon", "nullnull");
										form.setValue("prefix", "nullnull");
									}
								}}
								value={generateInvoice + ""}
							>
								Actualizare factură fiscală?
							</Checkbox>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{generateInvoice && (
				<>
					<div className="flex flex-row gap-2 place-items-center">
						<FormField
							control={form.control}
							name="adresaFacturare"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Adresă facturare*</FormLabel>
									<FormControl>
										<Autocomplete
											radius="md"
											variant="bordered"
											defaultSelectedKey={ticket.factura?.adresaFacturare}
											onSelectionChange={field.onChange}
											{...field}
										>
											{billingAddreses().map((bill: AdresaFacturare, index) => {
												const name =
													bill.adresa + ", " + bill.oras + ", " + bill.tara;
												return (
													<AutocompleteItem value={name} key={name}>
														{index + 1 + ". " + name}
													</AutocompleteItem>
												);
											})}
										</Autocomplete>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Tooltip content="Adaugă adresă de facturare" radius="md">
							<Button
								size="sm"
								isIconOnly
								radius="sm"
								variant="flat"
								className="!mt-8"
								onClick={() => {
									addAddress.setVizibil(true);
									addAddress.setEstePanouAdmin(selectedClient?.codClient ?? 0);
								}}
							>
								<PlusIcon size={20} />
							</Button>
						</Tooltip>
					</div>
					<div className="flex flex-col md:flex-row gap-2">
						<FormField
							control={form.control}
							name="numeClient"
							render={({ field }) => (
								<FormItem className="w-full md:w-1/2">
									<FormLabel>Nume Client*</FormLabel>
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
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="w-full md:w-1/2">
									<FormLabel>Email*</FormLabel>
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
					</div>
					<div className="flex flex-row gap-2">
						<FormField
							name="prefix"
							control={form.control}
							render={({ field }) => (
								<FormItem className="min-w-[140px]">
									<FormLabel>Telefon*</FormLabel>
									<FormControl>
										<Autocomplete
											radius="md"
											label="Prefix"
											variant="bordered"
											onSelectionChange={field.onChange}
											defaultSelectedKey={selectedClient?.telefon.substring(
												3,
												0
											)}
											{...field}
										>
											{coduriTariRomanesti.map((array) => {
												return (
													<AutocompleteItem
														className="px-0"
														value={array[1]}
														key={array[1]}
													>
														{array[1]}
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
							name="telefon"
							control={form.control}
							render={({ field }) => (
								<FormItem className="w-full mt-8">
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
				</>
			)}
		</NouEditareContinut>
	);
}
