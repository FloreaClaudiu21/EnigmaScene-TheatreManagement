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
import { createShowRoom } from "@/lib/schemas";
import { ShowRoom, TableTypes } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminShowRoomEdit({
	params,
	showRoom,
}: {
	params: any;
	showRoom: ShowRoom;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createShowRoom>>({
		resolver: zodResolver(createShowRoom),
		defaultValues: {
			number: showRoom.number,
			observations: showRoom.observations ?? undefined,
		},
	});
	async function onSubmit(values: z.infer<typeof createShowRoom>) {
		loadingScreen.setLoading(true);
		const data = await update(
			params.lang,
			TableTypes.SHOWROOM,
			values,
			showRoom.id
		);
		toast({
			description: data.error,
			title: "Show Room Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../showRooms?tab=roomsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../showRooms?tab=roomsAll"
			title={`Edit the show room with ID #${showRoom.id}`}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="number"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Room Number*</FormLabel>
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
					name="observations"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Observations</FormLabel>
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
		</NewOrEditContent>
	);
}
