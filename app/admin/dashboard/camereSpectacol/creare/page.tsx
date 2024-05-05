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
import { schemaCreareSalaSpectacol } from "@/lib/schemas";
import { TipuriTabel } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminShowRoomCreate() {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof schemaCreareSalaSpectacol>>({
		resolver: zodResolver(schemaCreareSalaSpectacol),
	});
	async function onSubmit(values: z.infer<typeof schemaCreareSalaSpectacol>) {
		loadingScreen.setLoading(true);
		const data = await insert(TipuriTabel.CAMERA_SPECTACOL, values);
		toast({
			description: data.message,
			title: "Înregistrare Sală de Spectacole",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../camereSpectacol?tab=roomsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../camereSpectacol?tab=roomsAll"
			title={"Adăugare sală de spectacole nouă"}
			loading={loadingScreen.loading}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="numarSala"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Număr Sală*</FormLabel>
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
					name="observatii"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Observații Sală</FormLabel>
							<FormControl>
								<Input
									radius="md"
									variant="bordered"
									maxLength={255}
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
