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
import { createShowDistribution } from "@/lib/schemas";
import { useLoadingScreen } from "@/services/StateProvider";
import { createDistribution } from "@/services/admin/ShowsProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminDistibutionNew({ params }: { params: any }) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createShowDistribution>>({
		resolver: zodResolver(createShowDistribution),
	});
	async function onSubmit(values: z.infer<typeof createShowDistribution>) {
		loadingScreen.setLoading(true);
		const data = await createDistribution(params.lang, values);
		toast({
			description: data.error,
			title: "Show Distribution Registration",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../shows?tab=showsDistribution");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../shows?tab=showsDistribution"
			title={"Add a new show distribution"}
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
