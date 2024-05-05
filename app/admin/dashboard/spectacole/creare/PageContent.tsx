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
import { useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Autocomplete,
	AutocompleteItem,
	Input,
	Textarea,
} from "@nextui-org/react";
import { PenIcon, PictureInPicture } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, now } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { convertToLocalTime } from "@/lib/utils";
import { SalaSpectacol, Sezon, TipSpectacol, TipuriTabel } from "@/lib/types";
import { schemaCreareSpectacol } from "@/lib/schemas";
import { I18nProvider } from "@react-aria/i18n";

export default function AdminShowNew({
	params,
	showRooms,
	seasons,
	categories,
}: {
	params: any;
	seasons: Sezon[];
	showRooms: SalaSpectacol[];
	categories: TipSpectacol[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [valueEnd, setValueEnd] = useState<DateValue>(
		now(getLocalTimeZone()).add({ hours: 1 })
	);
	const [valueStart, setValueStart] = useState<DateValue>(
		now(getLocalTimeZone())
	);
	const form = useForm<z.infer<typeof schemaCreareSpectacol>>({
		resolver: zodResolver(schemaCreareSpectacol),
		defaultValues: {
			oraIncepere: convertToLocalTime(now(getLocalTimeZone())),
			oraTerminare: convertToLocalTime(
				now(getLocalTimeZone()).add({ hours: 1 })
			),
			codSezon: seasons.length > 0 ? seasons[0].codSezon : undefined,
			codSalaSpectacol:
				showRooms.length > 0 ? showRooms[0].codSalaSpectacol : undefined,
			codTipSpectacol:
				categories.length > 0 ? categories[0].codTipSpectacol : undefined,
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareSpectacol>) {
		loadingScreen.setLoading(true);
		const data = await insert(TipuriTabel.SPECTACOL, values);
		toast({
			description: data.message,
			title: "Înregistrare Spectacol",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../spectacole?tab=showsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../spectacole?tab=showsAll"
			title={"Adăugare un nou spectacol"}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="imagine"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Imagine Spectacol*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									required
									endContent={
										<PictureInPicture className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
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
					name="titlu"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Titlu*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									maxLength={100}
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
					name="descriereScurta"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Descriere Scurta*</FormLabel>
							<FormControl>
								<Textarea
									radius="md"
									variant="bordered"
									maxLength={150}
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
					name="continut"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Conținu*</FormLabel>
							<FormControl>
								<Textarea
									radius="md"
									variant="bordered"
									maxLength={500}
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
					name="actorii"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>
								Actorii (Folosește virgula să separi valorile)*
							</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									maxLength={200}
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
					name="director"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Regizor*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									maxLength={150}
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
					name="oraIncepere"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Ora & Data Inceperii*</FormLabel>
							<FormControl>
								<I18nProvider locale="ro-RO">
									<DatePicker
										fullWidth
										hideTimeZone
										radius="md"
										variant="bordered"
										value={valueStart}
										showMonthAndYearPickers
										pageBehavior="single"
										onChange={(e) => {
											setValueStart(e);
											field.onChange(convertToLocalTime(e));
										}}
										minValue={now(getLocalTimeZone()).subtract({ minutes: 1 })}
									/>
								</I18nProvider>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="oraTerminare"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Ora & Data Terminării*</FormLabel>
							<FormControl>
								<I18nProvider locale="ro-RO">
									<DatePicker
										fullWidth
										hideTimeZone
										radius="md"
										variant="bordered"
										value={valueEnd}
										showMonthAndYearPickers
										pageBehavior="single"
										onChange={(e) => {
											setValueEnd(e);
											field.onChange(convertToLocalTime(e));
										}}
										minValue={now(getLocalTimeZone()).subtract({ minutes: 1 })}
									/>
								</I18nProvider>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="codSalaSpectacol"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Sala Spectacol*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Camere"
									variant="bordered"
									onSelectionChange={(key) => {
										field.onChange(
											key != null ? parseInt(key.toString()) : undefined
										);
									}}
									defaultSelectedKey={
										showRooms.length > 0
											? showRooms[0].codSalaSpectacol + ""
											: undefined
									}
									{...field}
								>
									{showRooms.map((room, index) => {
										return (
											<AutocompleteItem
												value={room.codSalaSpectacol}
												key={room.codSalaSpectacol}
											>
												{index + 1 + ". " + room.numarSala}
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
					name="codSezon"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Sezon Spectacol*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Sezoane"
									variant="bordered"
									onSelectionChange={(key) => {
										field.onChange(
											key != null ? parseInt(key.toString()) : undefined
										);
									}}
									defaultSelectedKey={
										seasons.length > 0 ? seasons[0].codSezon + "" : undefined
									}
									{...field}
								>
									{seasons.map((season, index) => {
										return (
											<AutocompleteItem
												value={season.codSezon}
												key={season.codSezon}
											>
												{index + 1 + ". " + season.numeSezon}
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
				name="codTipSpectacol"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Categorie Spectacol*</FormLabel>
						<FormControl>
							<Autocomplete
								radius="md"
								label="Categorie"
								variant="bordered"
								onSelectionChange={(key) => {
									field.onChange(
										key != null ? parseInt(key.toString()) : undefined
									);
								}}
								defaultSelectedKey={
									categories.length > 0
										? categories[0].codTipSpectacol + ""
										: undefined
								}
								{...field}
							>
								{categories.map((cat, index) => {
									return (
										<AutocompleteItem
											value={cat.codTipSpectacol}
											key={cat.codTipSpectacol}
										>
											{index + 1 + ". " + cat.numeTip}
										</AutocompleteItem>
									);
								})}
							</Autocomplete>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</NewOrEditContent>
	);
}
