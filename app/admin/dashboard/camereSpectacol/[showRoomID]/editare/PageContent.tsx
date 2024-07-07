"use client";

import NouEditareContinut from "@/components/admin/NouEditareContinut";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { schemaCreareSalaSpectacol } from "@/lib/schemeFormulare";
import { SalaSpectacol, TipuriTabel } from "@/lib/tipuri";
import { actualizare } from "@/services/backend/GeneralController";
import { ecranIncarcare } from "@/services/general/FurnizorStare";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminShowRoomEdit({
	showRoom,
}: {
	showRoom: SalaSpectacol;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const form = useForm<z.infer<typeof schemaCreareSalaSpectacol>>({
		resolver: zodResolver(schemaCreareSalaSpectacol),
		defaultValues: {
			numarSala: showRoom.numarSala,
			observatii: showRoom.observatii ?? undefined,
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareSalaSpectacol>) {
		loadingScreen.setIncarcare(true);
		const data = await actualizare(
			TipuriTabel.CAMERA_SPECTACOL,
			values,
			showRoom.codSalaSpectacol
		);
		toast({
			description: data.mesaj,
			title: "Editare Sală de Spectacole",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../camereSpectacol?tab=roomsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setIncarcare(false);
	}
	return (
		<NouEditareContinut
			form={form}
			onSubmit={onSubmit}
			back_link="../../camereSpectacol?tab=roomsAll"
			titlu={`Editați sala de spectacole cu codul de identificare #${showRoom.codSalaSpectacol}`}
			loading={loadingScreen.incarcare}
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
		</NouEditareContinut>
	);
}
