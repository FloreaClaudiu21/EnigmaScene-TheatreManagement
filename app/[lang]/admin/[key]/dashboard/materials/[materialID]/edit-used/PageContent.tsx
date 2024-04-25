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
import { createMaterialUsed } from "@/lib/schemas";
import { Show, ShowMaterialDecorationUsed, TableTypes } from "@/lib/types";
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
	params,
	material,
}: {
	params: any;
	material: ShowMaterialDecorationUsed;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [usedDate, setUsedDate] = useState<DateValue>(
		parseDateTime(material.usedDate.split(".")[0])
	);
	const [leftQuantity, setLeftQuantity] = useState(
		material.material?.stock ?? 0
	);
	const form = useForm<z.infer<typeof createMaterialUsed>>({
		resolver: zodResolver(createMaterialUsed),
		defaultValues: {
			quantity: material.quantity + "",
			usedDate: material.usedDate,
			showId: material.showId + "",
			materialId: material.materialId + "",
			leftQuantity: material.material?.stock + "",
			observations: material.observations ?? undefined,
		},
	});
	async function onSubmit(values: z.infer<typeof createMaterialUsed>) {
		loadingScreen.setLoading(true);
		const data = await update(
			params.lang,
			TableTypes.MATERIAL_USED,
			values,
			material.id
		);
		toast({
			description: data.error,
			title: "Material Used Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../materials?tab=allMaterialsUsed");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	const stockMaterial = material.material?.stock ?? 0;
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../materials?tab=allMaterialsUsed"
			title={`Edit the material used with ID #${material.id}`}
			loading={loadingScreen.loading}
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
										const diff = number - material.quantity;
										setLeftQuantity(stockMaterial - diff);
										form.setValue("leftQuantity", stockMaterial - diff + "");
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
							<FormLabel>Material Id*</FormLabel>
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
								/>
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
							<FormLabel>Show Id*</FormLabel>
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
								/>
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
