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
import { createShowSchema } from "@/lib/schemas";
import { Season, Show, ShowRoom, ShowType, TableTypes } from "@/lib/types";
import { convertToLocalTime } from "@/lib/utils";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
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
	params,
	show,
	seasons,
	showRooms,
	categories,
}: {
	params: any;
	show: Show;
	seasons: Season[];
	showRooms: ShowRoom[];
	categories: ShowType[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [valueEnd, setValueEnd] = useState<DateValue>(
		parseDateTime(show.endTime.split(".")[0])
	);
	const [valueStart, setValueStart] = useState<DateValue>(
		parseDateTime(show.startTime.split(".")[0])
	);
	const form = useForm<z.infer<typeof createShowSchema>>({
		resolver: zodResolver(createShowSchema),
		defaultValues: {
			actors: show.actors,
			description: show.description,
			description_en: show.description_en,
			content: show.content,
			content_en: show.content_en,
			director: show.director,
			showRoomId: show.showRoomId + "",
			showTypeId: show.showTypeId + "",
			seasonId: show.seasonId + "",
			endTime: show.endTime,
			startTime: show.startTime,
			title: show.title,
			title_en: show.title_en,
			image: show.image,
		},
	});
	async function onSubmit(values: z.infer<typeof createShowSchema>) {
		loadingScreen.setLoading(true);
		const data = await update(params.lang, TableTypes.SHOW, values, show.id);
		toast({
			description: data.error,
			title: "Show Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../shows?tab=showsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../shows?tab=showsAll"
			title={`Edit the show with ID #${show.id}`}
			loading={loadingScreen.loading}
		>
			<FormField
				control={form.control}
				name="image"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Show Image*</FormLabel>
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
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Title*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									maxLength={100}
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
					name="title_en"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Title EN*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									maxLength={100}
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
					name="description"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Description*</FormLabel>
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
					name="description_en"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Description EN*</FormLabel>
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
			</div>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Content*</FormLabel>
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
				<FormField
					control={form.control}
					name="content_en"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Content EN*</FormLabel>
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
					name="actors"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Actors (Use comma to separate values)*</FormLabel>
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
							<FormLabel>Director*</FormLabel>
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
					name="startTime"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Start Date & Time*</FormLabel>
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
										field.onChange(convertToLocalTime(e));
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
					name="endTime"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>End Date & Time*</FormLabel>
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
										field.onChange(convertToLocalTime(e));
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
					name="showRoomId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Show Room*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Rooms"
									variant="bordered"
									onSelectionChange={field.onChange}
									defaultSelectedKey={show.showRoomId}
									{...field}
								>
									{showRooms.map((room, index) => {
										return (
											<AutocompleteItem value={room.id} key={room.id}>
												{index + 1 + ". " + room.number}
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
					name="seasonId"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Show Season*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Seasons"
									variant="bordered"
									onSelectionChange={field.onChange}
									defaultSelectedKey={show.seasonId}
									{...field}
								>
									{seasons.map((season, index) => {
										return (
											<AutocompleteItem value={season.id} key={season.id}>
												{index + 1 + ". " + season.name + "|" + season.name_en}
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
				name="showTypeId"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Show Category*</FormLabel>
						<FormControl>
							<Autocomplete
								radius="md"
								label="Category"
								variant="bordered"
								onSelectionChange={field.onChange}
								defaultSelectedKey={show.showTypeId}
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
		</NewOrEditContent>
	);
}
