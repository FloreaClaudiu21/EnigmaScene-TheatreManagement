import React, { useCallback, useMemo } from "react";
import NewOrEditContent from "../../newPage/NewEditContent";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Checkbox,
	Input,
	Tooltip,
} from "@nextui-org/react";
import { Client } from "next-auth";
import {
	AdresaFacturare,
	LocSalaSpectacol,
	RataDeSchimbValutar,
	Spectacol,
	coduriTariRomanesti,
} from "@/lib/types";
import {
	MailIcon,
	PenIcon,
	PhoneIcon,
	PlusIcon,
	SquareUserIcon,
} from "lucide-react";
import { useAddAddressModal, useLoadingScreen } from "@/services/StateProvider";

export default function TicketsCreateForm({
	form,
	onSubmit,
	clienti,
	spectacole,
	cursuriValutare,
	clientSelectat,
	setClientSelectat,
	locuriAlese,
	setLocuriAlese,
	spectacolSelectat,
	setSpectacolSelectat,
	cursValutarSelectat,
	setCursValutarSelectat,
	generareFactura,
	setGenerareFactura,
}: {
	form: any;
	onSubmit: any;
	cursuriValutare: RataDeSchimbValutar[];
	cursValutarSelectat: RataDeSchimbValutar | null;
	setCursValutarSelectat: any;
	generareFactura: boolean;
	setGenerareFactura: any;
	spectacolSelectat: Spectacol | null;
	setSpectacolSelectat: any;
	locuriAlese: LocSalaSpectacol[];
	setLocuriAlese: any;
	clienti: Client[];
	clientSelectat: Client | null;
	setClientSelectat: any;
	spectacole: Spectacol[];
}) {
	const loadingScreen = useLoadingScreen();
	const addAddress = useAddAddressModal();
	const adreseFacturare = useCallback(
		() => clientSelectat?.adreseFacturare ?? [],
		[clientSelectat]
	);
	const adresaDefault: AdresaFacturare | null =
		adreseFacturare().length > 0 ? adreseFacturare()[0] : null;
	const adresaDefaultString =
		adresaDefault?.adresa +
		", " +
		adresaDefault?.oras +
		", " +
		adresaDefault?.tara;
	const costTotalLocuriRON = useMemo(() => {
		return locuriAlese.reduce((prev, cur) => prev + cur.pretLoc, 0);
	}, [locuriAlese]);
	const costTotalLocuriCur = useMemo(() => {
		let costTotalRON = locuriAlese.reduce((prev, cur) => prev + cur.pretLoc, 0);
		const cur = cursValutarSelectat;
		if (cur ?? "RON" != "RON") {
			costTotalRON /= cursValutarSelectat?.valuare ?? 1;
		}
		return costTotalRON;
	}, [locuriAlese, cursValutarSelectat]);
	return (
		<div className="flex flex-col gap-2 w-full md:w-1/2 h-full border-1 p-4 !mb-2 justify-center bg-gray-100 rounded-md">
			<NewOrEditContent
				form={form}
				onSubmit={onSubmit}
				loading={loadingScreen.loading}
				title={"Adăugare bilete vandute"}
				back_link="../bilete?tab=ticketsAll"
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
										label="Clienti"
										variant="bordered"
										onSelectionChange={(key) => {
											if (!key) return;
											const client = JSON.parse(key.toString()) as Client;
											field.onChange(client.codClient);
											setClientSelectat(client);
											form.setValue("adresaFacturare", "");
											form.setValue("email", client.email ?? "");
											form.setValue("numeClient", client.numeClient ?? "");
											form.setValue(
												"telefon",
												client.telefon.substring(3) ?? ""
											);
											form.setValue(
												"prefix",
												client.telefon.substring(3, 0) ?? ""
											);
										}}
										defaultSelectedKey={
											clientSelectat != null
												? JSON.stringify(clientSelectat)
												: undefined
										}
										{...field}
									>
										{clienti.map((cl, index) => {
											return (
												<AutocompleteItem
													key={JSON.stringify(cl)}
													value={JSON.stringify(cl)}
												>
													{index + 1 + ". " + cl.numeClient + " | " + cl.email}
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
						name="codSpectacol"
						render={({ field }) => (
							<FormItem className="w-full md:w-1/2">
								<FormLabel>Spectacol*</FormLabel>
								<FormControl>
									<Autocomplete
										radius="md"
										label="Spectacol"
										variant="bordered"
										onSelectionChange={(key) => {
											if (!key) return;
											const spec = JSON.parse(key.toString()) as Spectacol;
											field.onChange(spec.codSpectacol);
											setSpectacolSelectat(spec);
											setLocuriAlese([]);
											form.setValue("codSalaSpectacol", spec.codSalaSpectacol);
										}}
										defaultSelectedKey={
											spectacolSelectat != null
												? JSON.stringify(spectacolSelectat)
												: undefined
										}
										{...field}
									>
										{spectacole.map((spec, index) => {
											return (
												<AutocompleteItem
													key={JSON.stringify(spec)}
													value={JSON.stringify(spec)}
												>
													{index + 1 + ". " + spec.titlu}
												</AutocompleteItem>
											);
										})}
									</Autocomplete>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-2">
					<FormField
						control={form.control}
						name="pretVanzare"
						render={({ field }) => (
							<FormItem className="w-full md:w-1/2">
								<FormLabel>Valoare Bilete (RON)*</FormLabel>
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
										value={costTotalLocuriRON + ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="pretVanzare"
						render={({ field }) => (
							<FormItem className="w-full md:w-1/2">
								<FormLabel>
									Valoare Bilete ({cursValutarSelectat?.moneda})*
								</FormLabel>
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
										value={costTotalLocuriCur.toFixed(2) + ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-2">
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
					<FormField
						control={form.control}
						name="codRataDeSchimbValutar"
						render={({ field }) => (
							<FormItem className="w-full md:w-1/2">
								<FormLabel>Moneda*</FormLabel>
								<FormControl>
									<Autocomplete
										radius="md"
										label="Moneda"
										variant="bordered"
										onSelectionChange={(key) => {
											if (!key) return;
											const curs = JSON.parse(
												key.toString()
											) as RataDeSchimbValutar;
											field.onChange(curs.codRataValutar);
											setCursValutarSelectat(curs);
											form.setValue(
												"codRataDeSchimbValutar",
												curs.codRataValutar
											);
										}}
										defaultSelectedKey={
											cursValutarSelectat != null
												? JSON.stringify(cursValutarSelectat)
												: undefined
										}
										{...field}
									>
										{cursuriValutare.map((val, index) => {
											return (
												<AutocompleteItem
													key={JSON.stringify(val)}
													value={JSON.stringify(val)}
												>
													{index +
														1 +
														". " +
														val.moneda +
														" - " +
														val.valuare.toFixed(2)}
												</AutocompleteItem>
											);
										})}
									</Autocomplete>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="genereazaFacturaFiscala"
					render={({ field }) => (
						<FormItem className="w-full mt-4">
							<FormControl>
								<Checkbox
									radius="md"
									required
									onValueChange={(e) => {
										field.onChange(e + "");
										setGenerareFactura(e);
										if (e) {
											form.setValue("adresaFacturare", adresaDefaultString);
											form.setValue("email", clientSelectat?.email ?? "");
											form.setValue(
												"numeClient",
												clientSelectat?.numeClient ?? ""
											);
											form.setValue(
												"telefon",
												clientSelectat?.telefon.substring(3) ?? ""
											);
											form.setValue(
												"prefix",
												clientSelectat?.telefon.substring(3, 0) ?? ""
											);
										} else {
											form.setValue("adresaFacturare", "null");
											form.setValue("email", "null");
											form.setValue("numeClient", "null");
											form.setValue("telefon", "null");
											form.setValue("prefix", "nullnull");
										}
									}}
									value={generareFactura + ""}
								>
									Crează factură fiscală?
								</Checkbox>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{generareFactura && (
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
												defaultSelectedKey={
													adresaDefault?.adresa +
													", " +
													adresaDefault?.oras +
													", " +
													adresaDefault?.tara
												}
												onSelectionChange={field.onChange}
												{...field}
											>
												{adreseFacturare().map(
													(bill: AdresaFacturare, index) => {
														const name =
															bill.adresa + ", " + bill.oras + ", " + bill.tara;
														return (
															<AutocompleteItem value={name} key={name}>
																{index + 1 + ". " + name}
															</AutocompleteItem>
														);
													}
												)}
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
									radius="md"
									variant="flat"
									className="!mt-8"
									onClick={() => {
										addAddress.setVisible(true);
										addAddress.setIsAdminPanel(clientSelectat?.codClient ?? 0);
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
												defaultSelectedKey={clientSelectat?.telefon.substring(
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
			</NewOrEditContent>
		</div>
	);
}
