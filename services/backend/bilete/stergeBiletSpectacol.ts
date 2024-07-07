"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

import { revalidatePath } from "next/cache";

export const stergeBiletSpectacol = async (id: number) => {
	const raspunsStergere = await prisma.biletSpectacol.delete({
		where: {
			codBiletSpectacol: id,
		},
	});
	console.log(raspunsStergere);
	if (raspunsStergere.codBonFiscal != null) {
		const bonFiscal = await prisma.bonFiscal.findFirst({
			where: {
				codBonFiscal: raspunsStergere.codBonFiscal,
			},
			include: {
				bileteSpectacol: true,
			},
		});
		if ((bonFiscal?.bileteSpectacol?.length ?? 0) <= 0) {
			await prisma.bonFiscal.delete({
				where: {
					codBonFiscal: bonFiscal?.codBonFiscal,
				},
			});
			if (raspunsStergere.codFacturaFiscala != null) {
				await prisma.facturaFiscala.delete({
					where: {
						codFactura: raspunsStergere.codFacturaFiscala,
					},
				});
			}
		}
	}
	revalidatePath("/");
	return {
		mesaj: `Bilet spectacol sters cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
