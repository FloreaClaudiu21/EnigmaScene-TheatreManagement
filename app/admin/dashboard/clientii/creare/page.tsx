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
import { schemaCreareClient } from "@/lib/schemas";
import { TipuriTabel, coduriTariRomanesti } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import {
	EyeIcon,
	EyeOffIcon,
	MailIcon,
	PhoneIcon,
	SquareUserIcon,
} from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminClientNew() {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof schemaCreareClient>>({
		resolver: zodResolver(schemaCreareClient),
		defaultValues: {
			termeni: true,
		},
	});
	const [showPassRegister, setShowPassRegister] = useState(false);
	const [showPassRegister2, setShowPassRegister2] = useState(false);
	async function onSubmit(values: z.infer<typeof schemaCreareClient>) {
		loadingScreen.setLoading(true);
		const data = await insert(TipuriTabel.CLIENT, {
			email: values.email,
			numeClient: values.numeClient,
			parola: values.parola,
			telefon: values.prefix + values.telefon,
			dataNasterii: values.dataNasterii,
		});
		toast({
			description: data.message,
			title: "Inregistrare client",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../clients");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../clients"
			title={"Adauga un client nou"}
			loading={loadingScreen.loading}
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
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					name="parola"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Parola*</FormLabel>
							<FormControl>
								<Input
									required
									radius="md"
									endContent={
										!showPassRegister ? (
											<EyeIcon
												onClick={() => {
													setShowPassRegister(true);
												}}
												className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
											/>
										) : (
											<EyeOffIcon
												onClick={() => {
													setShowPassRegister(false);
												}}
												className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
											/>
										)
									}
									type={showPassRegister ? "text" : "password"}
									variant="bordered"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="reParola"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Confirma Parola*</FormLabel>
							<FormControl>
								<Input
									required
									radius="md"
									endContent={
										!showPassRegister2 ? (
											<EyeIcon
												onClick={() => {
													setShowPassRegister2(true);
												}}
												className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
											/>
										) : (
											<EyeOffIcon
												onClick={() => {
													setShowPassRegister2(false);
												}}
												className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
											/>
										)
									}
									type={showPassRegister2 ? "text" : "password"}
									variant="bordered"
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
