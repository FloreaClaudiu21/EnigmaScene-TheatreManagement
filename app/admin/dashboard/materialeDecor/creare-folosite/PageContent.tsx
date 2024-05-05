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
import { MaterialDecorSpectacol, Spectacol, TipuriTabel } from "@/lib/types";
import { schemaCreareMaterialDecorSpectacolFolosit } from "@/lib/schemas";

export default function AdminMaterialUsedNew({
	shows,
	materials,
}: {
	shows: Spectacol[];
	materials: MaterialDecorSpectacol[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [usedDate, setUsedDate] = useState<DateValue>(now(getLocalTimeZone()));
	const [
		selectedMaterial,
		setSelectedMaterial,
	] = useState<MaterialDecorSpectacol | null>(
		materials.length > 0 ? materials[0] : null
	);
	const [leftQuantity, setLeftQuantity] = useState(
		selectedMaterial?.cantitateStoc ?? 0
	);
	const form = useForm<
		z.infer<typeof schemaCreareMaterialDecorSpectacolFolosit>
	>({
		resolver: zodResolver(schemaCreareMaterialDecorSpectacolFolosit),
		defaultValues: {
			cantitateaFolosita: 0,
			dataFolosirii: convertToLocalTime(now(getLocalTimeZone())),
			codSpectacol: shows.length > 0 ? shows[0].codSpectacol : undefined,
			codMaterialDecorSpectacol:
				materials.length > 0 ? materials[0].codMaterialDecor : undefined,
			cantitateaRamasaPeStoc:
				selectedMaterial != null ? selectedMaterial.cantitateStoc : 0,
		},
	});
	async function onSubmit(
		values: z.infer<typeof schemaCreareMaterialDecorSpectacolFolosit>
	) {
		loadingScreen.setLoading(true);
		const data = await insert(TipuriTabel.MATERIAL_DECOR_FOLOSIT, values);
		toast({
			description: data.message,
			title: "Înregistrare Utilizare Material de Decor",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../materialeDecor?tab=allMaterialsUsed");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	const stockMaterial = selectedMaterial?.cantitateStoc ?? 0;
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			loading={loadingScreen.loading}
			back_link="../materialeDecor?tab=allMaterialsUsed"
			title={"Adăugare nou material de decor utilizat"}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="cantitateaFolosita"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Cantitatea Folosită*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									required
									endContent={
										<PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
									}
									onValueChange={(v) => {
										field.onChange(v);
										const number = parseInt(v);
										setLeftQuantity(stockMaterial - number);
										form.setValue(
											"cantitateaRamasaPeStoc",
											stockMaterial - number
										);
									}}
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
					name="cantitateaRamasaPeStoc"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Cantitatea Rămasă pe stoc*</FormLabel>
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
									value={leftQuantity + ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				name="dataFolosirii"
				control={form.control}
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Data și timpul folosirii materialului*</FormLabel>
						<FormControl>
							<DatePicker
								fullWidth
								hideTimeZone
								radius="md"
								value={usedDate}
								variant="bordered"
								pageBehavior="single"
								onChange={(e) => {
									setUsedDate(e);
									field.onChange(convertToLocalTime(e));
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					name="codMaterialDecorSpectacol"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Material Decor*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									onSelectionChange={(e) => {
										const material = JSON.parse(
											e.toString()
										) as MaterialDecorSpectacol;
										field.onChange(material.codMaterialDecor);
										setSelectedMaterial(material);
									}}
									defaultSelectedKey={
										materials.length > 0
											? JSON.stringify(materials[0])
											: undefined
									}
									{...field}
								>
									{materials.map((m, index) => {
										return (
											<AutocompleteItem
												value={JSON.stringify(m)}
												key={JSON.stringify(m)}
											>
												{index +
													1 +
													". " +
													m.numeMaterial +
													" | " +
													m.cantitateStoc +
													" " +
													m.unitateMastura}
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
					name="codSpectacol"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Spectacol*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									onSelectionChange={(key) => {
										field.onChange(
											key != null ? parseInt(key.toString()) : undefined
										);
									}}
									defaultSelectedKey={
										shows.length > 0 ? shows[0].codSpectacol + "" : undefined
									}
									{...field}
								>
									{shows.map((show, index) => {
										return (
											<AutocompleteItem
												value={show.codSpectacol}
												key={show.codSpectacol}
											>
												{index + 1 + ". " + show.titlu}
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
				name="observatii"
				control={form.control}
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Observații</FormLabel>
						<FormControl>
							<Input
								type="text"
								radius="md"
								maxLength={200}
								variant="bordered"
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
		</NewOrEditContent>
	);
}
