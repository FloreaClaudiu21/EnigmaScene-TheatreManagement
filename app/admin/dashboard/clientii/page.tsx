"use server";
import { prisma } from "@/lib/prismaClient";
import { Client, User } from "next-auth";
import { decryptPassword } from "@/services/general/AuthProvider";
import { columns } from "./columns";
import DataTable from "@/components/admin/table/Table";
import TabsPages from "@/components/admin/table/TabsPages";
import { TipuriTabel } from "@/lib/types";

export default async function AdminClients() {
	const clients: Client[] = await prisma.client.findMany({
		orderBy: {
			creatPe: "desc",
		},
		include: {
			adreseFacturare: true,
			bileteCumparate: true,
			platiiEfectuate: true,
			providerii: true,
		},
	});
	const decClients = clients.map((v) => {
		return { ...v, parola: decryptPassword(v.parola) } as User;
	});
	return (
		<TabsPages
			defVal="all"
			tabs={[
				{
					name: "Toți Clienți",
					value: "all",
					content: (
						<DataTable
							title="Clienți"
							data={decClients}
							columns={columns}
							showControlBtns={true}
							type={TipuriTabel.CLIENT}
							create_link="clientii/creare"
							subtitle="Gestionează-ți clienții și vezi adresele lor de facturare."
							filters={[
								{ column: "codClient", label: "Cod Client" },
								{ column: "numeClient", label: "Nume Client" },
								{ column: "email", label: "Email" },
								{ column: "telefon", label: "Telefon" },
								{ column: "phone", label: "Phone" },
								{ column: "creatPe", label: "Creat Pe" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
