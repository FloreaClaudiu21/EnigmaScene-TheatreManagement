"use client";
import NewContent from "@/components/admin/newPage/NewEditContent";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { createCarBrandSchema } from "@/lib/schemas";
import {
	carCategoryList,
	carModels,
	fuelTypeList,
	getCarManufacturersKey,
	transmissionTypeList,
} from "@/lib/types";
import { createCarBrands } from "@/services/CarBrandsProvider";
import { useLoadingScreen } from "@/services/StateProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminCarBrandNew({ params }: { params: any }) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createCarBrandSchema>>({
		resolver: zodResolver(createCarBrandSchema),
	});
	const [manufacturer, setManufacturer] = useState<string>(
		getCarManufacturersKey().at(0) ?? ""
	);
	async function onSubmit(values: z.infer<typeof createCarBrandSchema>) {
		loadingScreen.setLoading(true);
		const data = await createCarBrands(params.lang, values);
		toast({
			description: data.error,
			title: "Car Brand creation",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../carBrands");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	const modelsList = carModels.get(manufacturer) ?? [];
	return (
		<NewContent
			form={form}
			edit={false}
			onSubmit={onSubmit}
			back_link="../carBrands"
			page_title="Create a new car brand"
			loading={loadingScreen.loading}
		>
			<div className="flex flex-row gap-2">
				<FormField
					control={form.control}
					name="manufacturer"
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Manufacturer</FormLabel>
							<FormControl>
								<Autocomplete
									radius="none"
									label="Manufacturer"
									variant="bordered"
									onInputChange={field.onChange}
									onSelectionChange={(e) => {
										field.onChange();
										setManufacturer(e.toString());
									}}
									{...field}
								>
									{getCarManufacturersKey().map((value) => {
										return (
											<AutocompleteItem
												className="px-0"
												value={value}
												key={value}
											>
												{value}
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
					name="model"
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Models*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="none"
									label="Car Model"
									variant="bordered"
									onInputChange={field.onChange}
									onSelectionChange={field.onChange}
									{...field}
								>
									{modelsList.map((value, index) => {
										return (
											<AutocompleteItem
												value={value}
												className="px-0"
												key={index.toString()}
											>
												{value}
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
			<div className="flex flex-row gap-2">
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Category*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="none"
									label="Car Category"
									variant="bordered"
									onInputChange={field.onChange}
									onSelectionChange={field.onChange}
									{...field}
								>
									{carCategoryList.map((value, index) => {
										return (
											<AutocompleteItem
												value={value}
												className="px-0"
												key={index.toString()}
											>
												{value}
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
					name="year"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Model Year*</FormLabel>
							<FormControl>
								<Input
									required
									type="text"
									radius="none"
									variant="bordered"
									placeholder="2022"
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
					name="engineType"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Engine Type*</FormLabel>
							<FormControl>
								<Input
									required
									type="text"
									radius="none"
									variant="bordered"
									placeholder="v6 Diesel"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="transmissionType"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Transmission Type*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="none"
									label="Transmission Type"
									variant="bordered"
									onInputChange={field.onChange}
									onSelectionChange={field.onChange}
									{...field}
								>
									{transmissionTypeList.map((value, index) => {
										return (
											<AutocompleteItem
												value={value}
												className="px-0"
												key={index.toString()}
											>
												{value}
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
			<div className="flex flex-row gap-2">
				<FormField
					control={form.control}
					name="fuelType"
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Fuel Type*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="none"
									label="Fuel Type"
									variant="bordered"
									onInputChange={field.onChange}
									onSelectionChange={field.onChange}
									{...field}
								>
									{fuelTypeList.map((value, index) => {
										return (
											<AutocompleteItem
												className="px-0"
												value={value}
												key={index.toString()}
											>
												{value}
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
					name="fuelCapacity"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Fuel Capacity*</FormLabel>
							<FormControl>
								<Input
									required
									type="text"
									radius="none"
									variant="bordered"
									placeholder="100"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</NewContent>
	);
}
