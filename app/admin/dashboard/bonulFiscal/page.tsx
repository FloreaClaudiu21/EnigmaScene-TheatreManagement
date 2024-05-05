import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { BonFiscal, TipuriTabel } from "@/lib/types";
import { columnsReceipts } from "./columns";

export default async function AdminFiscalReceipts() {
	const receipts: BonFiscal[] = await prisma.bonFiscal.findMany({
		include: {
			client: true,
			plata: {
				include: {
					rataDeSchimbValutar: true,
				},
			},
			spectacol: {
				include: {
					bileteVandute: true,
					salaSpectacol: true,
					tipSpectacol: true,
					sezon: true,
				},
			},
			bileteSpectacol: {
				include: {
					salaSpectacol: true,
					locSalaSpectacol: true,
					spectacol: true,
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
					plata: true,
				},
			},
		},
	});
	return (
		<TabsPages
			defVal="all"
			tabs={[
				{
					name: "Toate Bonurile Fiscale",
					value: "all",
					content: (
						<DataTable
							data={receipts}
							title="Bonuri Fiscale Emise"
							showControlBtns={false}
							columns={columnsReceipts}
							type={TipuriTabel.BON_FISCAL}
							create_link="fiscalReceipt/create"
							subtitle="Administrați chitanțele fiscale și vizualizați datele clienților acestora."
							filters={[
								{ column: "codBonFiscal", label: "Cod Bon Fiscal" },
								{ column: "numarBonFiscal", label: "Numar Bon" },
								{ column: "serieBonFiscal", label: "Serie Bon" },
								{ column: "codClient", label: "Cod Client" },
								{ column: "codPlata", label: "Cod Plata" },
								{ column: "codSpectacol", label: "Cod Spectacol" },
								{ column: "creatPe", label: "Emis Pe" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
