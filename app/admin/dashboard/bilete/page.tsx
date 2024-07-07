import { prisma } from "@/lib/prismaClient";
import { columnsTicketsSold } from "./columnsTicketsSold";
import { BiletSpectacol, TipuriTabel } from "@/lib/tipuri";
import PaginiTab from "@/components/admin/table/PaginiTab";
import GeneralTabel from "@/components/admin/table/GeneralTabel";

export default async function AdminTickets() {
	const ticketsSold: BiletSpectacol[] = await prisma.biletSpectacol.findMany({
		orderBy: {
			creatPe: "desc",
		},
		include: {
			bonFiscal: {
				include: {
					plata: true,
					bileteSpectacol: {
						include: {
							spectacol: true,
							salaSpectacol: true,
							locSalaSpectacol: true,
							plata: true,
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
				},
			},
			client: true,
			plata: {
				include: {
					bileteAsociate: true,
					bonFiscal: true,
					client: true,
				},
			},
			locSalaSpectacol: true,
			salaSpectacol: true,
			spectacol: true,
		},
	});
	return (
		<PaginiTab
			valoareDef="ticketsAll"
			taburi={[
				{
					nume: "Toate Biletele Vandute",
					valoare: "ticketsAll",
					continut: (
						<GeneralTabel
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
