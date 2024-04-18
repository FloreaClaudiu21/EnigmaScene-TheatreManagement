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
import { Distribution } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { updateDistribution } from "@/services/admin/ShowsProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminDistributionEdit({
	params,
	distribution,
}: {
	params: any;
	distribution: Distribution;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof createShowDistribution>>({
		resolver: zodResolver(createShowDistribution),
		defaultValues: {
			name: distribution.name,
			name_en: distribution.name_en,
		},
	});
	async function onSubmit(values: z.infer<typeof createShowDistribution>) {
		loadingScreen.setLoading(true);
		const data = await updateDistribution(params.lang, values, distribution.id);
		toast({
			description: data.error,
			title: "Show Distribution Editing",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok && data.client != undefined) {
			router.push("../../shows?tab=showsDistribution");
			form.reset();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../shows?tab=showsDistribution"
			title={`Edit the show distribution with ID #${distribution.id}`}
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
