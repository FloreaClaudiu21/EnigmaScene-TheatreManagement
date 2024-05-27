import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { prisma } from "@/lib/prismaClient";
import { BiletSpectacol, TipuriTabel } from "@/lib/types";
import { columnsTicketsSold } from "./columnsTicketsSold";

export default async function AdminTickets() {
	const ticketsSold: BiletSpectacol[] = await prisma.biletSpectacol.findMany({
		orderBy: {
			creatPe: "desc",
		},
		include: {
			bonFiscal: {
				include: {
					bileteSpectacol: {
						include: {
							spectacol: true,
							salaSpectacol: true,
							locSalaSpectacol: true,
						},
					},
					plata: {
						include: {
							rataDeSchimbValutar: true,
						},
					},
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
					plata: {
						include: {
							rataDeSchimbValutar: true,
						},
					},
				},
			},
			client: true,
			plata: {
				include: {
					rataDeSchimbValutar: true,
				},
			},
			locSalaSpectacol: true,
			salaSpectacol: true,
			spectacol: true,
		},
	});
	return (
		<TabsPages
			defVal="ticketsAll"
			tabs={[
				{
					name: "Toate Biletele Vandute",
					value: "ticketsAll",
					content: (
						<DataTable
							title="Biletele Vandute"
							data={ticketsSold}
							columns={columnsTicketsSold}
							showControlBtns={true}
							type={TipuriTabel.BILET}
							create_link="bilete/creare"
							subtitle="Administrați biletele și vizualizați cine le-a cumpărat."
							filters={[
								{ column: "codBiletSpectacol", label: "Cod Bilet Spectacol" },
								{ column: "numarBilet", label: "Numar Bilet" },
								{ column: "codPlata", label: "Cod Plata" },
								{ column: "pretVanzare", label: "Pret Bilet (RON)" },
								{ column: "codClient", label: "Cod Client" },
								{ column: "numeClient", label: "Nume Client" },
								{ column: "codSpectacol", label: "Cod Spectacol" },
								{ column: "titlu", label: "Nume Spectacol" },
								{ column: "codSalaSpectacol", label: "Cod Sala" },
								{ column: "numarSala", label: "Numar Sala" },
								{
									column: "codLocSalaSpectacol",
									label: "Cod Loc Sala",
								},
								{
									column: "numarLoc",
									label: "Numar Loc Sala",
								},
								{
									column: "rand",
									label: "Rand Loc Sala",
								},
								{
									column: "tipLoc",
									label: "Tip Loc Sala",
								},
								{ column: "creatPe", label: "Cumparat Pe" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
