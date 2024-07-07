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
import { schemaCreareTipSpectacol } from "@/lib/schemeFormulare";
import { TipSpectacol, TipuriTabel } from "@/lib/tipuri";
import { actualizare } from "@/services/backend/GeneralController";
import { ecranIncarcare } from "@/services/general/FurnizorStare";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminCategoryEdit({
	category,
}: {
	category: TipSpectacol;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const form = useForm<z.infer<typeof schemaCreareTipSpectacol>>({
		resolver: zodResolver(schemaCreareTipSpectacol),
		defaultValues: {
			numeTip: category.numeTip,
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareTipSpectacol>) {
		loadingScreen.setIncarcare(true);
		const data = await actualizare(
			TipuriTabel.CATEGORIE_SPECTACOL,
			values,
			category.codTipSpectacol
		);
		toast({
			description: data.mesaj,
			title: "Editare Categorie Spectacol",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../spectacole?tab=showsCategory");
			form.reset();
			router.refresh();
		}
		loadingScreen.setIncarcare(false);
	}
	return (
		<NouEditareContinut
			form={form}
			onSubmit={onSubmit}
			back_link="../../spectacole?tab=showsCategory"
			titlu={`Editați categoria spectacolului cu codul de identificare #${category.codTipSpectacol}`}
			loading={loadingScreen.incarcare}
		>
			<FormField
				control={form.control}
				name="numeTip"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Nume Categorie Spectacol*</FormLabel>
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
		</NouEditareContinut>
	);
}
