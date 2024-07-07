"use server";
import { prisma } from "@/lib/prismaClient";
import { schemaCreareSpectacol } from "@/lib/schemeFormulare";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const creareSpectacol = async (data: any) => {
	const val = data as z.infer<typeof schemaCreareSpectacol>;
	await prisma.spectacol.create({
		data: {
			...val,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Spectacol creat cu succes.`,
		ok: true,
		status: 200,
	};
};
