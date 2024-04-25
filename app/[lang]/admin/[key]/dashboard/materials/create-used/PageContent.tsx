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
import { createMaterialSchema, createMaterialUsed } from "@/lib/schemas";
import { Show, ShowMaterialDecoration, TableTypes } from "@/lib/types";
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

export default function AdminMaterialUsedNew({
	params,
	shows,
	materials,
}: {
	params: any;
	shows: Show[];
	materials: ShowMaterialDecoration[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [usedDate, setUsedDate] = useState<DateValue>(now(getLocalTimeZone()));
	const [
		selectedMaterial,
		setSelectedMaterial,
	] = useState<ShowMaterialDecoration | null>(
		materials.length > 0 ? materials[0] : null
	);
	const [leftQuantity, setLeftQuantity] = useState(
		selectedMaterial?.stock ?? 0
	);
	const form = useForm<z.infer<typeof createMaterialUsed>>({
		resolver: zodResolver(createMaterialUsed),
		defaultValues: {
			quantity: "0",
			usedDate: convertToLocalTime(now(getLocalTimeZone())),
			showId: shows.length > 0 ? shows[0].id + "" : undefined,
			materialId: materials.length > 0 ? materials[0].id + "" : undefined,
			leftQuantity: selectedMaterial != null ? selectedMaterial.stock + "" : "",
		},
	});
	async function onSubmit(values: z.infer<typeof createMaterialSchema>) {
		loadingScreen.setLoading(true);
		const data = await insert(params.lang, TableTypes.MATERIAL_USED, values);
		toast({
			description: data.error,
			title: "Decoration Material Used Registration",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../materials?tab=allMaterialsUsed");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	const stockMaterial = selectedMaterial?.stock ?? 0;
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			loading={loadingScreen.loading}
			back_link="../materials?tab=allMaterialsUsed"
			title={"Add a new decoration material used"}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="quantity"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Quantity*</FormLabel>
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
										form.setValue("leftQuantity", stockMaterial - number + "");
									}}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="leftQuantity"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Left Quantity*</FormLabel>
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
				name="usedDate"
				control={form.control}
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Used Date & Time*</FormLabel>
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
					name="materialId"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Material Used*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									onSelectionChange={(e) => {
										const material = JSON.parse(
											e.toString()
										) as ShowMaterialDecoration;
										field.onChange(material.id);
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
													m.name +
													" | " +
													m.name_en +
													", " +
													m.stock +
													" " +
													m.unit}
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
					name="showId"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Show*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									variant="bordered"
									onSelectionChange={field.onChange}
									defaultSelectedKey={
										shows.length > 0 ? shows[0].id : undefined
									}
									{...field}
								>
									{shows.map((show, index) => {
										return (
											<AutocompleteItem value={show.id} key={show.id}>
												{index + 1 + ". " + show.title + " | " + show.title_en}
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
				name="observations"
				control={form.control}
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Observations</FormLabel>
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
