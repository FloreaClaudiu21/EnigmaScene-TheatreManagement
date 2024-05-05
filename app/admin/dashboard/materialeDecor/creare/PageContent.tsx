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
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, now } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { convertToLocalTime } from "@/lib/utils";
import { CategorieMaterialDecor, TipuriTabel } from "@/lib/types";
import { schemaCreareMaterialDecorSpectacol } from "@/lib/schemas";

export default function AdminMaterialNew({
	categories,
}: {
	categories: CategorieMaterialDecor[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [buyDate, setBuyDate] = useState<DateValue>(now(getLocalTimeZone()));
	const form = useForm<z.infer<typeof schemaCreareMaterialDecorSpectacol>>({
		resolver: zodResolver(schemaCreareMaterialDecorSpectacol),
		defaultValues: {
			dataAchizitie: convertToLocalTime(now(getLocalTimeZone())),
			codCategorieMaterialDecor:
				categories.length > 0
					? categories[0].codCategorieMaterialDecor
					: undefined,
		},
	});
	async function onSubmit(
		values: z.infer<typeof schemaCreareMaterialDecorSpectacol>
	) {
		loadingScreen.setLoading(true);
		const data = await insert(TipuriTabel.MATERIAL_DECOR, values);
		toast({
			description: data.message,
			title: "Înregistrare Material Decorativ",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../materialeDecor?tab=allMaterials");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			loading={loadingScreen.loading}
			back_link="../materialeDecor?tab=allMaterials"
			title={"Adăugare un material decorativ nou"}
		>
			<FormField
				control={form.control}
				name="numeMaterial"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Nume Material*</FormLabel>
						<FormControl>
							<Input
								radius="md"
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
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					name="dataAchizitie"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Data Achiziției*</FormLabel>
							<FormControl>
								<DatePicker
									fullWidth
									hideTimeZone
									radius="md"
									value={buyDate}
									variant="bordered"
									pageBehavior="single"
									onChange={(e) => {
										setBuyDate(e);
										field.onChange(convertToLocalTime(e));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="pretAchizitie"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Preț Achiziție (RON)*</FormLabel>
							<FormControl>
								<Input
									radius="md"
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
			</div>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					name="cantitateStoc"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Cantitate Stoc (Număr)*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									required
									endContent={
										<PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
									}
									{...field}
									value={field.value + ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="unitateMastura"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Unitate Măsură*</FormLabel>
							<FormControl>
								<Input
									radius="md"
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
			</div>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="producator"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Producător*</FormLabel>
							<FormControl>
								<Input
									radius="md"
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
					name="codCategorieMaterialDecor"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Categorie Material Decor*</FormLabel>
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
											? categories[0].codCategorieMaterialDecor + ""
											: undefined
									}
									{...field}
								>
									{categories.map((cat, index) => {
										return (
											<AutocompleteItem
												value={cat.codCategorieMaterialDecor}
												key={cat.codCategorieMaterialDecor}
											>
												{index + 1 + ". " + cat.numeCategorie}
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
