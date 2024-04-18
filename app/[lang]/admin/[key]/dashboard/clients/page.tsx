"use server";
import { prisma } from "@/lib/prismaClient";
import { Client, User } from "next-auth";
import { decryptPassword } from "@/services/general/AuthProvider";
import { columns } from "./columns";
import DataTable from "@/components/admin/table/Table";
import { TableTypes } from "@/lib/types";
import TabsPages from "@/components/admin/table/TabsPages";

export default async function AdminClients({ params }: { params: any }) {
	const clients: Client[] = await prisma.client.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			favorites: true,
			invoices: true,
			payments: true,
			providers: true,
			billingAddresses: true,
			tickesBuyed: true,
		},
	});
	const decClients = clients.map((v) => {
		return { ...v, password: decryptPassword(v.password) } as User;
	});
	return (
		<TabsPages
			defVal="all"
			tabs={[
				{
					name: "All",
					value: "all",
					content: (
						<DataTable
							params={params}
							title="Clients"
							data={decClients}
							columns={columns}
							showControlBtns={true}
							type={TableTypes.CLIENTS}
							create_title="Add Client"
							create_link="clients/create"
							subtitle="Manage your clients and view their billing addresses."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "firstName", label: "First Name" },
								{ column: "lastName", label: "Last Name" },
								{ column: "email", label: "Email" },
								{ column: "phone", label: "Phone" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
