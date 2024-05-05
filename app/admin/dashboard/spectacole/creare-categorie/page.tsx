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
import { schemaCreareTipSpectacol } from "@/lib/schemas";
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

export default function AdminCategoryNew() {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof schemaCreareTipSpectacol>>({
		resolver: zodResolver(schemaCreareTipSpectacol),
	});
	async function onSubmit(values: z.infer<typeof schemaCreareTipSpectacol>) {
		loadingScreen.setLoading(true);
		const data = await insert(TipuriTabel.SPECTACOL_CATEGORIE, values);
		toast({
			description: data.message,
			title: "Înregistrare Categorie Spectacol",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../spectacole?tab=showsCategory");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../spectacole?tab=showsCategory"
			title={"Adăugare o nouă categorie de spectacol"}
			loading={loadingScreen.loading}
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
		</NewOrEditContent>
	);
}
