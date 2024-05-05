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
import { schemaCreareSezonSpectacol } from "@/lib/schemas";
import { Sezon, TipuriTabel } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminSeasonEdit({ season }: { season: Sezon }) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof schemaCreareSezonSpectacol>>({
		resolver: zodResolver(schemaCreareSezonSpectacol),
		defaultValues: {
			numeSezon: season.numeSezon,
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareSezonSpectacol>) {
		loadingScreen.setLoading(true);
		const data = await update(
			TipuriTabel.SPECTACOL_SEZON,
			values,
			season.codSezon
		);
		toast({
			description: data.message,
			title: "Editare Sezon Spectacol",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../spectacole?tab=showsSeasons");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../spectacole?tab=showsSeasons"
			title={`Editați sezonul spectacolului cu codul de identificare #${season.codSezon}`}
			loading={loadingScreen.loading}
		>
			<FormField
				control={form.control}
				name="numeSezon"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Nume Sezon*</FormLabel>
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
		</NewOrEditContent>
	);
}
