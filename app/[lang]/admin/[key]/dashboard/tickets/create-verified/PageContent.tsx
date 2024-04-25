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
import { TableTypes, TicketSold } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function TicketCreateVerifiedAdmin({
	params,
	tickets,
}: {
	params: any;
	tickets: TicketSold[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createTicketVerified>>({
		resolver: zodResolver(createTicketVerified),
		defaultValues: {
			ticketSoldId: tickets.length > 0 ? tickets[0].id + "" : undefined,
		},
	});
	async function onSubmit(values: z.infer<typeof createTicketVerified>) {
		loadingScreen.setLoading(true);
		const data = await insert(params.lang, TableTypes.TICKET_VERIFIED, values);
		toast({
			description: data.error,
			title: "Ticket Verified Registration",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../tickets?tab=ticketsVerified");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../tickets?tab=ticketsVerified"
			title={"Add a new verified ticket"}
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
									defaultSelectedKey={
										tickets.length > 0 ? tickets[0].id : undefined
									}
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
