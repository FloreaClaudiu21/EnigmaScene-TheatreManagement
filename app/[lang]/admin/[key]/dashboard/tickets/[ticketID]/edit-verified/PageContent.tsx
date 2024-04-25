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
import { createTicketVerified } from "@/lib/schemas";
import { TableTypes, TicketSold, TicketVerified } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminTicketVerifyEdit({
	params,
	ticket,
	tickets,
}: {
	params: any;
	tickets: TicketSold[];
	ticket: TicketVerified;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createTicketVerified>>({
		resolver: zodResolver(createTicketVerified),
		defaultValues: {
			ticketSoldId: ticket.ticketSoldId + "",
		},
	});
	async function onSubmit(values: z.infer<typeof createTicketVerified>) {
		loadingScreen.setLoading(true);
		const data = await update(
			params.lang,
			TableTypes.TICKET_VERIFIED,
			values,
			ticket.id
		);
		toast({
			description: data.error,
			title: "Ticket Verified Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../tickets?tab=ticketsVerified");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../tickets?tab=ticketsVerified"
			title={`Edit the verified ticket with ID #${ticket.id}`}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="ticketSoldId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Ticket Sold*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Tickets"
									variant="bordered"
									onSelectionChange={field.onChange}
									defaultSelectedKey={ticket.ticketSoldId}
									{...field}
								>
									{tickets.map((t, index) => {
										return (
											<AutocompleteItem value={t.id} key={t.id}>
												{index +
													1 +
													". " +
													t.number +
													" | " +
													t.createdAt.toUTCString()}
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
		</NewOrEditContent>
	);
}
