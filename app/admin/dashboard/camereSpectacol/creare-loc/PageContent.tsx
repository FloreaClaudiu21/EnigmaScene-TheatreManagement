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
import { schemaCreareLocSalaSpectacol } from "@/lib/schemeFormulare";
import { SalaSpectacol, TipuriTabel } from "@/lib/tipuri";
import { inserare } from "@/services/backend/GeneralController";
import { ecranIncarcare } from "@/services/general/FurnizorStare";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminShowRoomSeatCreate({
	showRooms,
}: {
	showRooms: SalaSpectacol[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const form = useForm<z.infer<typeof schemaCreareLocSalaSpectacol>>({
		resolver: zodResolver(schemaCreareLocSalaSpectacol),
		defaultValues: {
			codSalaSpectacol:
				showRooms.length > 0 ? showRooms[0].codSalaSpectacol : undefined,
		},
	});
	async function onSubmit(
		values: z.infer<typeof schemaCreareLocSalaSpectacol>
	) {
		loadingScreen.setIncarcare(true);
		const data = await inserare(TipuriTabel.SCAUN_CAMERA_SPECTACOL, {
			...values,
			pretLoc: parseFloat(values.pretLoc),
		});
		toast({
			description: data.mesaj,
			title: "Înregistrare locuri în sala de spectacole",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../camereSpectacol?tab=showsRoomSeats");
			form.reset();
			router.refresh();
		}
		loadingScreen.setIncarcare(false);
	}
	return (
		<NouEditareContinut
			form={form}
			onSubmit={onSubmit}
			titlu={"Adăugare un nou loc în sala de spectacole"}
			back_link="../camereSpectacol?tab=showsRoomSeats"
			loading={loadingScreen.incarcare}
		>
			<div className="flex flex-col md:flex-row gap-2">
				<FormField
					control={form.control}
					name="numarLoc"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Numar Loc*</FormLabel>
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
					name="rand"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Rand Loc*</FormLabel>
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
				name="pretLoc"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Pret Loc (RON)*</FormLabel>
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
					name="tipLoc"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Tip Loc*</FormLabel>
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
					name="codSalaSpectacol"
					render={({ field }) => (
						<FormItem className="w-full md:w-1/2">
							<FormLabel>Camera Spectacol*</FormLabel>
							<FormControl>
								<Autocomplete
									radius="md"
									label="Rooms"
									variant="bordered"
									onSelectionChange={(key) => {
										field.onChange(
											key != null ? parseInt(key.toString()) : undefined
										);
									}}
									defaultSelectedKey={
										showRooms.length > 0
											? showRooms[0].codSalaSpectacol + ""
											: undefined
									}
									{...field}
								>
									{showRooms.map((room, index) => {
										return (
											<AutocompleteItem
												value={room.codSalaSpectacol}
												key={room.codSalaSpectacol}
											>
												{index + 1 + ". " + room.numarSala}
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
		</NouEditareContinut>
	);
}
