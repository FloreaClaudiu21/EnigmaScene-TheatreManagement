"use server";
import { prisma } from "@/lib/prismaClient";
import { RaspunsTrimitereEmail } from "@/lib/tipuri";

import { revalidatePath } from "next/cache";

export const stergeFacturaFiscala = async (id: number) => {
	await prisma.facturaFiscala.delete({
		where: {
			codFactura: id,
		},
	});
	revalidatePath("/");
	return {
		mesaj: `Factura fiscala spectacol stearsa cu succes.`,
		ok: true,
		status: 200,
	} as RaspunsTrimitereEmail;
};
