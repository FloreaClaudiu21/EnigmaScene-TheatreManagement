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
import { createShowSeason } from "@/lib/schemas";
import { Season } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { updateSeason } from "@/services/admin/ShowsProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminSeasonEdit({
	params,
	season,
}: {
	params: any;
	season: Season;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createShowSeason>>({
		resolver: zodResolver(createShowSeason),
		defaultValues: {
			name: season.name,
			name_en: season.name_en,
		},
	});
	async function onSubmit(values: z.infer<typeof createShowSeason>) {
		loadingScreen.setLoading(true);
		const data = await updateSeason(params.lang, season.id, values);
		toast({
			description: data.error,
			title: "Show Season Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok && data.client != undefined) {
			router.push("../../shows?tab=showsSeasons");
			form.reset();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../shows?tab=showsSeasons"
			title={`Edit the show season with ID #${season.id}`}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-row gap-2">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="w-1/2">
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
						<FormItem className="w-1/2">
							<FormLabel>Name English*</FormLabel>
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
