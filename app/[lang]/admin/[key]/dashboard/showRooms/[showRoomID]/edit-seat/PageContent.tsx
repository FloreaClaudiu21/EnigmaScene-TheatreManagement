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
import { createShowRoomSeat } from "@/lib/schemas";
import {
	ShowRoom,
	ShowRoomSeat,
	TableTypes,
	seatCategories,
} from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminShowRoomSeatEdit({
	params,
	showRooms,
	showRoomSeat,
}: {
	params: any;
	showRooms: ShowRoom[];
	showRoomSeat: ShowRoomSeat;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createShowRoomSeat>>({
		resolver: zodResolver(createShowRoomSeat),
		defaultValues: {
			type: showRoomSeat.type,
			number: showRoomSeat.number,
			price: showRoomSeat.price.toString(),
			row: showRoomSeat.row,
			showRoomId: showRoomSeat.showRoomId + "",
		},
	});
	async function onSubmit(values: z.infer<typeof createShowRoomSeat>) {
		loadingScreen.setLoading(true);
		const data = await update(
			params.lang,
			TableTypes.SHOWROOM_SEAT,
			{
				...values,
				price: parseFloat(values.price),
			},
			showRoomSeat.id
		);
		toast({
			description: data.error,
			title: "Show Room Seat Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../showRooms?tab=showsRoomSeats");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../showRooms?tab=showsRoomSeats"
			title={`Edit the show room seat with ID #${showRoomSeat.id}`}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="number"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Seat Number*</FormLabel>
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
					name="row"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Seat Row*</FormLabel>
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
			<FormField
				control={form.control}
				name="price"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Price*</FormLabel>
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
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Seat Category*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Seat Type"
									variant="bordered"
									defaultSelectedKey={showRoomSeat.type}
									onSelectionChange={field.onChange}
									{...field}
								>
									{seatCategories.map((cat) => {
										return (
											<AutocompleteItem value={cat} key={cat}>
												{cat}
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
									defaultSelectedKey={showRoomSeat.showRoomId}
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
			</div>
		</NewOrEditContent>
	);
}