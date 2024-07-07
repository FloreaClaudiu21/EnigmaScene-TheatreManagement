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
import { LocSalaSpectacol, SalaSpectacol, TipuriTabel } from "@/lib/tipuri";
import { actualizare } from "@/services/backend/GeneralController";
import { ecranIncarcare } from "@/services/general/FurnizorStare";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminShowRoomSeatEdit({
	showRooms,
	showRoomSeat,
}: {
	showRooms: SalaSpectacol[];
	showRoomSeat: LocSalaSpectacol;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const form = useForm<z.infer<typeof schemaCreareLocSalaSpectacol>>({
		resolver: zodResolver(schemaCreareLocSalaSpectacol),
		defaultValues: {
			tipLoc: showRoomSeat.tipLoc,
			numarLoc: showRoomSeat.numarLoc,
			pretLoc: showRoomSeat.pretLoc.toString(),
			rand: showRoomSeat.rand,
			codSalaSpectacol: showRoomSeat.codSalaSpectacol,
		},
	});
	async function onSubmit(
		values: z.infer<typeof schemaCreareLocSalaSpectacol>
	) {
		loadingScreen.setIncarcare(true);
		const data = await actualizare(
			TipuriTabel.SCAUN_CAMERA_SPECTACOL,
			{
				...values,
				pretLoc: parseFloat(values.pretLoc),
			},
			showRoomSeat.codLocSala
		);
		toast({
			description: data.mesaj,
			title: "Editare Locuri în Sală de Spectacole",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../camereSpectacol?tab=showsRoomSeats");
			form.reset();
			router.refresh();
		}
		loadingScreen.setIncarcare(false);
	}
	return (
		<NouEditareContinut
			form={form}
			onSubmit={onSubmit}
			back_link="../../camereSpectacol?tab=showsRoomSeats"
			titlu={`Editați locul din sala de spectacol cu codul de identificare #${showRoomSeat.codLocSala}`}
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
									defaultSelectedKey={showRoomSeat.codSalaSpectacol + ""}
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
