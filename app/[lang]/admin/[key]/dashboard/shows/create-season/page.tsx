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
import { TableTypes } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminSeasonNew({ params }: { params: any }) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createShowSeason>>({
		resolver: zodResolver(createShowSeason),
	});
	async function onSubmit(values: z.infer<typeof createShowSeason>) {
		loadingScreen.setLoading(true);
		const data = await insert(params.lang, TableTypes.SHOW_SEASON, values);
		toast({
			description: data.error,
			title: "Show Season Registration",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../shows?tab=showsSeasons");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../shows?tab=showsSeasons"
			title={"Add a new show season"}
			loading={loadingScreen.loading}
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
									maxLength={100}
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
							<FormLabel>Name English*</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									maxLength={100}
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
