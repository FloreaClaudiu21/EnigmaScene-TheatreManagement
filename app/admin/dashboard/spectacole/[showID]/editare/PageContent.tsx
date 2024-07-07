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
import { convertesteInTimpLocal } from "@/lib/metodeUtile";
import { schemaCreareSpectacol } from "@/lib/schemeFormulare";
import {
	SalaSpectacol,
	Sezon,
	Spectacol,
	TipSpectacol,
	TipuriTabel,
} from "@/lib/tipuri";
import { actualizare } from "@/services/backend/GeneralController";
import { ecranIncarcare } from "@/services/general/FurnizorStare";

import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, now, parseDateTime } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { DatePicker } from "@nextui-org/date-picker";
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

export default function AdminShowEditPage({
	show,
	seasons,
	showRooms,
	categories,
}: {
	show: Spectacol;
	seasons: Sezon[];
	showRooms: SalaSpectacol[];
	categories: TipSpectacol[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const [valueEnd, setValueEnd] = useState<DateValue>(
		parseDateTime(show.oraTerminare.split(".")[0])
	);
	const [valueStart, setValueStart] = useState<DateValue>(
		parseDateTime(show.oraIncepere.split(".")[0])
	);
	const form = useForm<z.infer<typeof schemaCreareSpectacol>>({
		resolver: zodResolver(schemaCreareSpectacol),
		defaultValues: {
			...show,
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareSpectacol>) {
		loadingScreen.setIncarcare(true);
		const data = await actualizare(
			TipuriTabel.SPECTACOL,
			values,
			show.codSpectacol
		);
		toast({
			description: data.mesaj,
			title: "Editare Spectacol",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../spectacole?tab=showsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setIncarcare(false);
	}
	return (
		<NouEditareContinut
			form={form}
			onSubmit={onSubmit}
			back_link="../../spectacole?tab=showsAll"
			titlu={`Editați spectacolul cu codul de identificare #${show.codSpectacol}`}
			loading={loadingScreen.incarcare}
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
										field.onChange(convertesteInTimpLocal(e));
									}}
									minValue={now(getLocalTimeZone()).subtract({ minutes: 1 })}
								/>
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
										field.onChange(convertesteInTimpLocal(e));
									}}
									minValue={now(getLocalTimeZone()).subtract({ minutes: 1 })}
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
									defaultSelectedKey={show.codSalaSpectacol + ""}
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
									defaultSelectedKey={show.codSezon + ""}
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
								defaultSelectedKey={show.codTipSpectacol + ""}
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
		</NouEditareContinut>
	);
}
