"use client";
import NewOrEditContent from "@/components/admin/newPage/NewEditContent";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { createTicketSold } from "@/lib/schemas";
import {
	ExchangeRate,
	Show,
	ShowRoomSeat,
	TableTypes,
	TicketSold,
	countryCodesArray,
	paymentTypesList,
} from "@/lib/types";
import { useAddAddressModal, useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
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
import { useRouter } from "next-nprogress-bar";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Client } from "next-auth";
import { generateRandomString } from "@/lib/utils";

export default function AdminTicketNew({
	params,
	shows,
	clients,
	exchanges,
	tickets,
}: {
	tickets: TicketSold[];
	params: any;
	shows: Show[];
	clients: Client[];
	exchanges: ExchangeRate[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const addAddress = useAddAddressModal();
	const loadingScreen = useLoadingScreen();
	const [generateInvoice, setGenerateInvoice] = useState(false);
	const [selectedClient, setSelectedClient] = useState<Client | null>(
		clients.length > 0 ? clients[0] : null
	);
	const [selectedShow, setSelectedShow] = useState<Show | null>(
		shows.length > 0 ? shows[0] : null
	);
	const seatsCall = useCallback(() => selectedShow?.showRoom?.seats ?? [], [
		selectedShow,
	]);
	const seats = seatsCall()
		.map((v) => {
			const tickets = v.ticketsSold;
			const foundTicket = tickets?.filter((t) => t.showId == selectedShow?.id);
			return foundTicket == undefined || foundTicket.length === 0
				? v
				: undefined;
		})
		.filter((seat) => seat !== undefined) as ShowRoomSeat[];
	const [selectedSeat, setSelectedSeat] = useState<ShowRoomSeat | null>(
		seats.length > 0 ? seats[0] : null
	);
	const billingAddreses = useCallback(
		() => selectedClient?.billingAddresses ?? [],
		[selectedClient]
	);
	const defAddress =
		billingAddreses().length > 0 ? billingAddreses()[0] : undefined;
	const form = useForm<z.infer<typeof createTicketSold>>({
		resolver: zodResolver(createTicketSold),
		defaultValues: {
			generateInvoice: "false",
			number: "#E" + tickets.length + "-" + generateRandomString(6),
			paymentType: "CASH",
			currency: exchanges.length > 0 ? exchanges[0].currency : undefined,
			currencyAmount:
				exchanges.length > 0 ? exchanges[0].value + "" : undefined,
			currencyDate:
				exchanges.length > 0 ? exchanges[0].date.toISOString() : undefined,
			clientId: selectedClient?.id + "",
			showId: shows.length > 0 ? shows[0].id + "" : undefined,
			seatId: selectedSeat?.id + "",
			showRoomId: selectedShow?.showRoomId + "",
			showRoomName: shows.length > 0 ? shows[0].showRoom?.number : undefined,
			soldPrice: selectedSeat?.price + "",
			billingAddress:
				defAddress?.address +
				", " +
				defAddress?.city +
				", " +
				defAddress?.country,
			email: selectedClient?.email,
			firstName: selectedClient?.firstName,
			lastName: selectedClient?.lastName,
			phone: selectedClient?.phone.substring(3),
			prefix: selectedClient?.phone.substring(3, 0),
		},
	});
	async function onSubmit(values: z.infer<typeof createTicketSold>) {
		loadingScreen.setLoading(true);
		const data = await insert(params.lang, TableTypes.TICKET_SOLD, values);
		toast({
			description: data.error,
			title: "Ticket Sold Registration",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../tickets?tab=ticketsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../tickets?tab=ticketsAll"
			title={"Add a new ticket sold"}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="number"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Ticket Number*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									isDisabled
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
					name="paymentType"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Payment Type*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									onSelectionChange={field.onChange}
									defaultSelectedKey={paymentTypesList[0]}
									{...field}
								>
									{paymentTypesList.map((pay) => {
										return (
											<AutocompleteItem value={pay} key={pay}>
												{pay}
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
					name="currency"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Currency*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									defaultSelectedKey={
										exchanges.length > 0
											? JSON.stringify(exchanges[0])
											: undefined
									}
									onSelectionChange={(ex) => {
										if (!ex) return;
										const exchange = JSON.parse(ex.toString()) as ExchangeRate;
										field.onChange(exchange.currency);
										form.setValue("currencyAmount", exchange.value + "");
										form.setValue("currencyDate", exchange.date.toISOString());
									}}
									{...field}
								>
									{exchanges.map((ex, index) => {
										return (
											<AutocompleteItem
												value={JSON.stringify(ex)}
												key={JSON.stringify(ex)}
											>
												{index + 1 + ". " + ex.currency}
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
					name="currencyAmount"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Currency Amount*</FormLabel>
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
			</div>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="clientId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Client*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									defaultSelectedKey={
										clients.length > 0 ? JSON.stringify(clients[0]) : undefined
									}
									onSelectionChange={(c) => {
										if (!c) return;
										const client = JSON.parse(c.toString()) as Client;
										field.onChange(client.id);
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
												{index +
													1 +
													". " +
													c.email +
													" | " +
													c.firstName +
													" " +
													c.lastName}
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
					name="showId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Show*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									defaultSelectedKey={
										shows.length > 0 ? JSON.stringify(shows[0]) : undefined
									}
									onSelectionChange={(s) => {
										if (!s) return;
										const show = JSON.parse(s.toString()) as Show;
										setSelectedShow(show);
										field.onChange(show.id);
										form.setValue("showRoomId", show.showRoomId + "");
										form.setValue("showRoomName", show.showRoom?.number ?? "");
									}}
									{...field}
								>
									{shows.map((s, index) => {
										return (
											<AutocompleteItem
												value={JSON.stringify(s)}
												key={JSON.stringify(s)}
											>
												{index + 1 + ". " + s.title + " | " + s.title_en}
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
					name="showRoomId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Show Room Id*</FormLabel>
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
					name="showRoomName"
					render={(field) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Show Room Name</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									isDisabled
									required
									endContent={
										<PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
									}
									value={selectedShow?.showRoom?.number}
									{...field}
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
					name="seatId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Room Seat*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									defaultSelectedKey={
										seats.length > 0 ? JSON.stringify(seats[0]) : undefined
									}
									onSelectionChange={(s) => {
										if (!s) return;
										const seat = JSON.parse(s.toString()) as ShowRoomSeat;
										setSelectedSeat(seat);
										field.onChange(seat.id + "");
										form.setValue("soldPrice", seat.price + "");
									}}
									{...field}
								>
									{seats.map((s, index) => {
										return (
											<AutocompleteItem
												value={JSON.stringify(s)}
												key={JSON.stringify(s)}
											>
												{index +
													1 +
													". " +
													s.number +
													" | " +
													s.type +
													", " +
													s.price +
													" RON"}
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
					name="soldPrice"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Sell Price*</FormLabel>
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
			</div>
			<FormField
				control={form.control}
				name="generateInvoice"
				render={({ field }) => (
					<FormItem className="w-full mt-4">
						<FormControl>
							<Checkbox
								radius="md"
								required
								onValueChange={(e) => {
									field.onChange(e + "");
									setGenerateInvoice(e);
								}}
								value={generateInvoice + ""}
							>
								Generate Invoice?
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
							name="billingAddress"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Billing Address*</FormLabel>
									<FormControl>
										<Autocomplete
											radius="md"
											variant="bordered"
											defaultSelectedKey={
												defAddress?.address ??
												"" + ", " + defAddress?.city ??
												"" + ", " + defAddress?.country ??
												""
											}
											onSelectionChange={field.onChange}
											{...field}
										>
											{billingAddreses().map((bill, index) => {
												const name =
													bill.address + ", " + bill.city + ", " + bill.country;
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
						<Tooltip content="Add address" radius="md">
							<Button
								size="sm"
								isIconOnly
								radius="md"
								variant="flat"
								className="!mt-8"
								onClick={() => {
									addAddress.setVisible(true);
									addAddress.setIsAdminPanel(selectedClient?.id ?? 0);
								}}
							>
								<PlusIcon size={20} />
							</Button>
						</Tooltip>
					</div>
					<div className="flex flex-col md:flex-row gap-2">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="w-full md:w-1/2">
									<FormLabel>First Name*</FormLabel>
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
							name="lastName"
							render={({ field }) => (
								<FormItem className="w-full md:w-1/2">
									<FormLabel>Last Name*</FormLabel>
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
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
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
					<div className="flex flex-row gap-2">
						<FormField
							name="prefix"
							control={form.control}
							render={({ field }) => (
								<FormItem className="min-w-[140px]">
									<FormLabel>Phone*</FormLabel>
									<FormControl>
										<Autocomplete
											radius="md"
											label="Prefix"
											variant="bordered"
											onSelectionChange={field.onChange}
											defaultInputValue={selectedClient?.phone.substring(3, 0)}
											{...field}
										>
											{countryCodesArray.map((array) => {
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
							name="phone"
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
	);
}
