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
import { createInvoiceSchema } from "@/lib/schemas";
import { TableTypes, TicketSold, countryCodesArray } from "@/lib/types";
import { useAddAddressModal, useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
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
import { useRouter } from "next-nprogress-bar";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateRandomString } from "@/lib/utils";

export default function AdminInvoiceNew({
	params,
	tickets,
}: {
	params: any;
	tickets: TicketSold[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const addAddress = useAddAddressModal();
	const loadingScreen = useLoadingScreen();
	const [selectedTicket, setSelectedTicket] = useState<TicketSold | null>(
		tickets.length > 0 ? tickets[0] : null
	);
	const selectedClient = useCallback(() => selectedTicket?.client, [
		selectedTicket,
	]);
	const client = selectedClient();
	const billingAddreses = useCallback(() => client?.billingAddresses ?? [], [
		client,
	]);
	const defAddress =
		billingAddreses().length > 0 ? billingAddreses()[0] : undefined;
	const form = useForm<z.infer<typeof createInvoiceSchema>>({
		resolver: zodResolver(createInvoiceSchema),
		defaultValues: {
			invoiceNumber: generateRandomString(6),
			ticketId: selectedTicket?.id + "",
			clientId: selectedTicket?.clientId + "",
			paymentId: selectedTicket?.payment?.id + "",
			fiscalReceiptId: selectedTicket?.fiscalReceipt?.id + "",
			totalAmount: selectedTicket?.payment?.amount + "" ?? "0",
			currency: selectedTicket?.payment?.currency,
			currencyAmount: selectedTicket?.payment?.currencyAmount + "",
			currencyDate: selectedTicket?.payment?.currencyDate.toISOString(),
			billingAddress:
				defAddress?.address +
				", " +
				defAddress?.city +
				", " +
				defAddress?.country,
			email: client?.email,
			firstName: client?.firstName,
			lastName: client?.lastName,
			phone: client?.phone.substring(3),
			prefix: client?.phone.substring(3, 0),
		},
	});
	async function onSubmit(values: z.infer<typeof createInvoiceSchema>) {
		loadingScreen.setLoading(true);
		const data = await insert(params.lang, TableTypes.INVOICE, values);
		toast({
			description: data.error,
			title: "Invoice Registration",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../invoices?tab=all");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../invoices?tab=all"
			title={"Add a new invoice"}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					name="invoiceNumber"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Invoice Number*</FormLabel>
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
					name="ticketId"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Tickets Sold*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									defaultSelectedKey={
										selectedTicket != null
											? JSON.stringify(selectedTicket)
											: undefined
									}
									onSelectionChange={(t) => {
										if (!t) return;
										const ticket = JSON.parse(t.toString()) as TicketSold;
										field.onChange(ticket.id);
										setSelectedTicket(ticket);
										form.setValue("clientId", ticket.clientId + "");
										form.setValue("paymentId", ticket.payment?.id + "" ?? "");
										form.setValue(
											"fiscalReceiptId",
											ticket.fiscalReceipt?.id + "" ?? ""
										);
										form.setValue("currency", ticket.payment?.currency ?? "");
										form.setValue(
											"currencyAmount",
											ticket.payment?.currencyAmount + "" ?? ""
										);
										form.setValue(
											"currencyDate",
											ticket.payment?.currencyDate.toISOString() ?? ""
										);
										form.setValue(
											"totalAmount",
											ticket.payment?.amount + "" ?? ""
										);
										form.setValue("email", ticket.client?.email ?? "");
										form.setValue("firstName", ticket.client?.firstName ?? "");
										form.setValue("lastName", ticket.client?.lastName ?? "");
										form.setValue(
											"phone",
											ticket.client?.phone.substring(3) ?? ""
										);
										form.setValue(
											"prefix",
											ticket.client?.phone.substring(3, 0) ?? ""
										);
									}}
									{...field}
								>
									{tickets.map((t, index) => {
										return (
											<AutocompleteItem
												key={JSON.stringify(t)}
												value={JSON.stringify(t)}
											>
												{index + 1 + ". " + t.number + " | " + t.client?.email}
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
					name="clientId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Client Id*</FormLabel>
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
					name="paymentId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Payment Id*</FormLabel>
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
					name="fiscalReceiptId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Fiscal Receipt Id*</FormLabel>
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
					name="totalAmount"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Total Amount (RON)*</FormLabel>
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
										defAddress?.address +
										", " +
										defAddress?.city +
										", " +
										defAddress?.country
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
							addAddress.setIsAdminPanel(client?.id ?? 0);
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
									defaultInputValue={client?.phone.substring(3, 0)}
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
		</NewOrEditContent>
	);
}
