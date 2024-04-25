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
import { createMaterialSchema } from "@/lib/schemas";

import {
	ShowMaterialDecoration,
	ShowMaterialDecorationCategory,
	TableTypes,
} from "@/lib/types";
import { convertToLocalTime } from "@/lib/utils";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDateTime } from "@internationalized/date";
import { DateValue } from "@nextui-org/calendar";
import { DatePicker } from "@nextui-org/date-picker";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminMaterialDecorationEdit({
	params,
	material,
	categories,
}: {
	params: any;
	material: ShowMaterialDecoration;
	categories: ShowMaterialDecorationCategory[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [buyDate, setBuyDate] = useState<DateValue>(
		parseDateTime(material.buyDate.split(".")[0])
	);
	const form = useForm<z.infer<typeof createMaterialSchema>>({
		resolver: zodResolver(createMaterialSchema),
		defaultValues: {
			producer: material.producer,
			buyDate: material.buyDate,
			buyPrice: material.buyPrice + "" ?? "0",
			name: material.name,
			name_en: material.name_en,
			stock: material.stock + "" ?? "0",
			categoryId: material.categoryId + "",
			unit: material.unit,
		},
	});
	async function onSubmit(values: z.infer<typeof createMaterialSchema>) {
		loadingScreen.setLoading(true);
		const data = await update(
			params.lang,
			TableTypes.MATERIAL,
			values,
			material.id
		);
		toast({
			description: data.error,
			title: "Material Decoration Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../materials?tab=allMaterials");
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
			back_link="../../materials?tab=allMaterials"
			title={`Edit the material decoration with ID #${material.id}`}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Name*</FormLabel>
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
					name="name_en"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Name EN*</FormLabel>
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
					name="buyDate"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Buy Date & Time*</FormLabel>
							<FormControl>
								<DatePicker
									fullWidth
									hideTimeZone
									radius="md"
									value={buyDate}
									variant="bordered"
									showMonthAndYearPickers
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
					name="buyPrice"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Buy Price (RON)*</FormLabel>
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
					name="stock"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Stock (Number)*</FormLabel>
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
					name="unit"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Unit*</FormLabel>
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
					name="producer"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Producer*</FormLabel>
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
					name="categoryId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Material Category*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Category"
									variant="bordered"
									onSelectionChange={field.onChange}
									defaultSelectedKey={material.categoryId}
									{...field}
								>
									{categories.map((cat, index) => {
										return (
											<AutocompleteItem value={cat.id} key={cat.id}>
												{index + 1 + ". " + cat.name + "|" + cat.name_en}
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
