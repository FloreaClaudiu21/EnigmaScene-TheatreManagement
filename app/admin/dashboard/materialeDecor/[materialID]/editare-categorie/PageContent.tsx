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
import { schemaCreareCategorieMaterialDecor } from "@/lib/schemas";
import { CategorieMaterialDecor, TipuriTabel } from "@/lib/types";
import { useLoadingScreen } from "@/services/StateProvider";
import { update } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { PenIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminMaterialCategoryEdit({
	category,
}: {
	category: CategorieMaterialDecor;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const form = useForm<z.infer<typeof schemaCreareCategorieMaterialDecor>>({
		resolver: zodResolver(schemaCreareCategorieMaterialDecor),
		defaultValues: {
			numeCategorie: category.numeCategorie,
		},
	});
	async function onSubmit(
		values: z.infer<typeof schemaCreareCategorieMaterialDecor>
	) {
		loadingScreen.setLoading(true);
		const data = await update(
			TipuriTabel.MATERIAL_DECOR_CATEGORIE,
			values,
			category.codCategorieMaterialDecor
		);
		toast({
			description: data.message,
			title: "Editare Categorie Material Decorativ",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../../materialeDecor?tab=materialsCategory");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<NewOrEditContent
			form={form}
			onSubmit={onSubmit}
			back_link="../../materialeDecor?tab=materialsCategory"
			title={`Editați categoria de material cu codul de identificare #${category.codCategorieMaterialDecor}`}
			loading={loadingScreen.loading}
		>
			<FormField
				control={form.control}
				name="numeCategorie"
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Nume Categorie*</FormLabel>
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
		</NewOrEditContent>
	);
}
