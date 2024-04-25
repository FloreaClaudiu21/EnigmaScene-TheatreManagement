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
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
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
	params,
	shows,
	clients,
	exchanges,
	ticket,
}: {
	params: any;
	ticket: TicketSold;
	shows: Show[];
	clients: Client[];
	exchanges: ExchangeRate[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const addAddress = useAddAddressModal();
	const loadingScreen = useLoadingScreen();
	const defExchange = exchanges.filter(
		(e) => e.currency === ticket.payment?.currency
	);
	const defShow = shows.filter((s) => s.id === ticket.showId);
	const defClient = clients.filter((c) => c.id === ticket.clientId);
	const generateInvoice = ticket.invoice != null && ticket.invoice != undefined;
	const [selectedClient, setSelectedClient] = useState<Client | null>(
		defClient.length > 0 ? defClient[0] : null
	);
	const [selectedShow, setSelectedShow] = useState<Show | null>(
		defShow.length > 0 ? defShow[0] : null
	);
	const seatsCall = useCallback(() => selectedShow?.showRoom?.seats ?? [], [
		selectedShow,
	]);
	const seats = seatsCall()
		.map((v) => {
			const tickets = v.ticketsSold;
			const foundTicket = tickets?.filter((t) => t.showId == selectedShow?.id);
			return foundTicket == undefined ||
				foundTicket.length === 0 ||
				v.id == ticket.seatId
				? v
				: undefined;
		})
		.filter((seat) => seat !== undefined) as ShowRoomSeat[];
	const defSeat = seats.filter((s) => s.id === ticket.seatId);
	const [selectedSeat, setSelectedSeat] = useState<ShowRoomSeat | null>(
		defSeat.length > 0 ? defSeat[0] : null
	);
	const billingAddreses = useCallback(
		() => selectedClient?.billingAddresses ?? [],
		[selectedClient]
	);
	const form = useForm<z.infer<typeof createTicketSold>>({
		resolver: zodResolver(createTicketSold),
		defaultValues: {
			number: ticket.number,
			generateInvoice: generateInvoice + "",
			paymentType: ticket.payment?.type,
			currency: ticket.payment?.currency,
			currencyAmount: ticket.payment?.currencyAmount + "",
			currencyDate: ticket.payment?.currencyDate.toISOString(),
			clientId: ticket.clientId + "",
			showId: ticket.showId + "",
			seatId: ticket.seatId + "",
			showRoomId: ticket.showRoomId + "",
			showRoomName: ticket.showRoom?.number,
			soldPrice: selectedSeat?.price + "" ?? undefined,
			billingAddress:
				ticket.invoice?.billingAddress ?? generateInvoice ? "" : "null",
			email: ticket.invoice?.email ?? generateInvoice ? "" : "null",
			firstName: ticket.invoice?.firstName ?? generateInvoice ? "" : "null",
			lastName: ticket.invoice?.lastName ?? generateInvoice ? "" : "null",
			phone:
				ticket.invoice?.phone.substring(3) ?? generateInvoice ? "" : "null",
			prefix:
				ticket.invoice?.phone.substring(3, 0) ?? generateInvoice ? "" : "null",
		},
	});
	async function onSubmit(values: z.infer<typeof createTicketSold>) {
		loadingScreen.setLoading(true);
		const data = await update(
			params.lang,
			TableTypes.TICKET_SOLD,
			values,
			ticket.id
		);
		toast({
			description: data.error,
			title: "Ticket Sold Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../tickets?tab=ticketsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../tickets?tab=ticketsAll"
			title={`Edit the sold ticket with ID #${ticket.id}`}
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
									defaultSelectedKey={ticket.payment?.type.toString()}
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
										defExchange.length > 0
											? JSON.stringify(defExchange[0])
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
												key={JSON.stringify(ex)}
												value={JSON.stringify(ex)}
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
										selectedClient != null
											? JSON.stringify(selectedClient)
											: undefined
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
										selectedShow != null
											? JSON.stringify(selectedShow)
											: undefined
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
										selectedSeat != null
											? JSON.stringify(selectedSeat)
											: undefined
									}
									onSelectionChange={(s) => {
										if (!s) return;
										const seat = JSON.parse(s.toString()) as ShowRoomSeat;
										setSelectedSeat(seat);
										field.onChange(seat.id);
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
											defaultSelectedKey={ticket.invoice?.billingAddress}
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
								radius="sm"
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
											defaultInputValue={ticket.invoice?.phone.substring(3, 0)}
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
