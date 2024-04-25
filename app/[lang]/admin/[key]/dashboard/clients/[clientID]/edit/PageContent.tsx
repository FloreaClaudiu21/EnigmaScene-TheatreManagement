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
import { registerSchema } from "@/lib/schemas";
import { TableTypes, countryCodesArray } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import {
	EyeIcon,
	EyeOffIcon,
	MailIcon,
	PhoneIcon,
	SquareUserIcon,
} from "lucide-react";
import { Client } from "next-auth";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminClientEdit({
	params,
	client,
}: {
	params: any;
	client: Client;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [showPassRegister, setShowPassRegister] = useState(false);
	const [showPassRegister2, setShowPassRegister2] = useState(false);
	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: client.firstName,
			lastName: client.lastName,
			password: client.password,
			rePassword: client.password,
			email: client.email,
			phone: client.phone.substring(3),
			prefix: client.phone.substring(3, 0),
			birthDate: client.birthDate,
			terms: true,
		},
	});
	async function onSubmit(values: z.infer<typeof registerSchema>) {
		loadingScreen.setLoading(true);
		const data = await update(
			params.lang,
			TableTypes.CLIENT,
			{
				email: values.email,
				lastName: values.lastName,
				password: values.password,
				firstName: values.firstName,
				phone: values.prefix + values.phone,
				birthDate: values.birthDate,
			},
			client.id
		);
		toast({
			description: data.error,
			title: "Account Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../clients");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../clients"
			title={`Edit the user with ID #${params.clientID}`}
			loading={loadingScreen.loading}
		>
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
									defaultInputValue={client.phone.substring(3, 0)}
									{...field}
								>
									{countryCodesArray.map((array, index) => {
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
			<FormField
				name="birthDate"
				control={form.control}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Birth Date*</FormLabel>
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
					name="password"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Password*</FormLabel>
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
					name="rePassword"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Confirm Password*</FormLabel>
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
