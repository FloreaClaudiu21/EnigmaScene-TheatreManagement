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
import { schemaCreareMaterialDecorSpectacolFolosit } from "@/lib/schemas";
import { MaterialDecorSpectacolFolosit, TipuriTabel } from "@/lib/types";
import { convertToLocalTime } from "@/lib/utils";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDateTime } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminMaterialUsedEdit({
	material,
}: {
	material: MaterialDecorSpectacolFolosit;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [usedDate, setUsedDate] = useState<DateValue>(
		parseDateTime(material.dataFolosirii.split(".")[0])
	);
	const [leftQuantity, setLeftQuantity] = useState(
		material.materialDecorSpectacol?.cantitateStoc ?? 0
	);
	const form = useForm<
		z.infer<typeof schemaCreareMaterialDecorSpectacolFolosit>
	>({
		resolver: zodResolver(schemaCreareMaterialDecorSpectacolFolosit),
		defaultValues: {
			...material,
			observatii: material.observatii ?? undefined,
		},
	});
	async function onSubmit(
		values: z.infer<typeof schemaCreareMaterialDecorSpectacolFolosit>
	) {
		loadingScreen.setLoading(true);
		const data = await update(
			TipuriTabel.MATERIAL_DECOR_FOLOSIT,
			values,
			material.codMaterialDecorSpectacolFolosit
		);
		toast({
			description: data.message,
			title: "Editare Utilizare Material",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../materialeDecor?tab=allMaterialsUsed");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	const stockMaterial = material.materialDecorSpectacol?.cantitateStoc ?? 0;
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../materialeDecor?tab=allMaterialsUsed"
			title={`Editați materialul utilizat cu codul de identificare #${material.codMaterialDecorSpectacolFolosit}`}
			loading={loadingScreen.loading}
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
										const diff = number - material.cantitateaFolosita;
										setLeftQuantity(stockMaterial - diff);
										form.setValue(
											"cantitateaRamasaPeStoc",
											stockMaterial - diff
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
							<FormLabel>Cod Material Decor*</FormLabel>
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
									value={field.value + ""}
								/>
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
							<FormLabel>Cod Spectacol*</FormLabel>
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
									value={field.value + ""}
								/>
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
