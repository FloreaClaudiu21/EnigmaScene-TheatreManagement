import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { FacturaFiscala, TipuriTabel } from "@/lib/types";
import { columnsInvoice } from "./columns";

export default async function AdminInvoices() {
	const invoices: FacturaFiscala[] = await prisma.facturaFiscala.findMany({
		include: {
			client: {
				include: {
					adreseFacturare: true,
				},
			},
			plata: {
				include: {
					rataDeSchimbValutar: true,
				},
			},
			bileteSpectacol: {
				include: {
					locSalaSpectacol: true,
					salaSpectacol: true,
					spectacol: true,
				},
			},
			bonFiscal: {
				include: {
					bileteSpectacol: {
						include: {
							locSalaSpectacol: true,
							salaSpectacol: true,
							spectacol: true,
						},
					},
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
					name: "Toate Facturile",
					value: "all",
					content: (
						<DataTable
							data={invoices}
							title="Facturi Fiscale Emise"
							showControlBtns={true}
							columns={columnsInvoice}
							type={TipuriTabel.FACTURA_FISCALA}
							create_link="facturi/creare"
							subtitle="Administrați facturile fiscale și vizualizați datele de plată."
							filters={[
								{ column: "codFactura", label: "Cod Factura" },
								{ column: "numarFactura", label: "Numar Factura" },
								{ column: "adresaFacturare", label: "Adresa Facturare" },
								{ column: "codClient", label: "Cod Client" },
								{ column: "codPlata", label: "Cod Plata" },
								{ column: "codBonFiscal", label: "Cod Bon Fiscal" },
								{ column: "dataIntocmiri", label: "Data Intocmiri" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
