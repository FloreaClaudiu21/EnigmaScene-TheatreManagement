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
import { schemaCreareClient } from "@/lib/schemeFormulare";
import { coduriTariRomanesti, TipuriTabel } from "@/lib/tipuri";
import { actualizare } from "@/services/backend/GeneralController";
import { ecranIncarcare } from "@/services/general/FurnizorStare";

import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { MailIcon, PhoneIcon, SquareUserIcon } from "lucide-react";
import { Client } from "next-auth";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type ClientEditData = {
	email: string;
	numeClient: string;
	telefon: string;
	dataNasterii: string;
};

export default function AdminClientEdit({
	params,
	client,
}: {
	params: any;
	client: Client;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const form = useForm<z.infer<typeof schemaCreareClient>>({
		resolver: zodResolver(schemaCreareClient),
		defaultValues: {
			email: client.email,
			telefon: client.telefon.substring(3),
			prefix: client.telefon.substring(3, 0),
			dataNasterii: client.dataNasterii,
			numeClient: client.numeClient,
			termeni: true,
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareClient>) {
		loadingScreen.setIncarcare(true);
		const data = await actualizare(
			TipuriTabel.CLIENT,
			values,
			client.codClient
		);
		toast({
			description: data.mesaj,
			title: "Editare client",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../clientii");
			form.reset();
			router.refresh();
		}
		loadingScreen.setIncarcare(false);
	}
	return (
		<NouEditareContinut
			form={form}
			onSubmit={onSubmit}
			back_link="../../clientii"
			titlu={`Editare client cu codul de identificare #${params.clientID}`}
			loading={loadingScreen.incarcare}
		>
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
									defaultInputValue={client.telefon.substring(3, 0)}
									{...field}
								>
									{coduriTariRomanesti.map((array, index) => {
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
			<FormField
				name="dataNasterii"
				control={form.control}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Data Nasterii*</FormLabel>
						<FormControl>
							<Input
								radius="md"
								type="date"
								variant="bordered"
								required
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</NouEditareContinut>
	);
}
