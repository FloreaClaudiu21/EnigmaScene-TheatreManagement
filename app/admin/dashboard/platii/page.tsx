import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { columnsPayments } from "./columns";
import { Plata, TipuriTabel } from "@/lib/types";

export default async function AdminPayments() {
	const payments: Plata[] = await prisma.plata.findMany({
		orderBy: {
			platitPe: "desc",
		},
		include: {
			client: true,
			rataDeSchimbValutar: true,
			bonFiscal: {
				include: {
					spectacol: {
						include: {
							sezon: true,
							tipSpectacol: true,
							salaSpectacol: true,
						},
					},
					client: true,
					factura: true,
					plata: {
						include: {
							rataDeSchimbValutar: true,
						},
					},
					bileteSpectacol: {
						include: {
							salaSpectacol: true,
							locSalaSpectacol: true,
							spectacol: true,
						},
					},
				},
			},
			factura: {
				include: {
					bileteSpectacol: {
						include: {
							salaSpectacol: true,
							locSalaSpectacol: true,
							spectacol: true,
						},
					},
					bonFiscal: true,
					client: true,
					plata: {
						include: {
							rataDeSchimbValutar: true,
						},
					},
				},
			},
		},
	});
	return (
		<TabsPages
			defVal="all"
			tabs={[
				{
					name: "Toate Plățile",
					value: "all",
					content: (
						<DataTable
							title="Plăți efectuate"
							data={payments}
							showControlBtns={false}
							columns={columnsPayments}
							type={TipuriTabel.PLATA}
							create_link="payments/create"
							subtitle="Administrați plățile efectuate de către clienții și vizualizați starea lor."
							filters={[
								{ column: "codPlata", label: "Cod Plata" },
								{ column: "sumaPlatita", label: "Suma Platita" },
								{ column: "moneda", label: "Moneda" },
								{ column: "tipPlata", label: "Tip Plata" },
								{ column: "starePlata", label: "Stare Plata" },
								{ column: "platitPe", label: "Platit Pe" },
								{ column: "codClient", label: "Cod Client" },
								{ column: "numeClient", label: "Nume Client" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
