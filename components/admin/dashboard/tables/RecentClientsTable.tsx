import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prismaClient";
import { formatDate } from "@/lib/rangeOptions";
import { Client } from "next-auth";
import React from "react";

export default async function RecentClientsTable() {
	const clients: Client[] = await prisma.client.findMany({
		take: 5,
		orderBy: {
			creatPe: "desc",
		},
		include: {
			providerii: true,
			bileteCumparate: true,
			platiiEfectuate: true,
		},
	});
	return (
		<Card className="md:min-w-[410px] max-h-[800px] overflow-y-auto shadow-md">
			<CardHeader>
				<CardTitle>Clienți recenți - Ultimele 5 înregistrări</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-8 w-full">
				{clients.map((client: Client) => {
					return (
						<div
							key={client.codClient}
							className="flex items-start gap-4 overflow-hidden border-b-1 pb-2"
						>
							<div className="grid gap-1 overflow-hidden break-all">
								<p className="text-lg font-semibold leading-none text-red-500">
									{client.numeClient}
								</p>
								<p className="text-md text-muted-foreground">{client.email}</p>
								<div>
									<p className="text-sm text-muted-foreground">
										{"Bilete cumpărate: " + client.bileteCumparate?.length}
									</p>
									<p className="text-sm text-muted-foreground">
										{"Plăți efectuate: " + client.platiiEfectuate?.length}
									</p>
									<p className="text-sm text-muted-foreground">
										{"Admin: " + client.utlizatorAdmin}
									</p>
								</div>
							</div>
							<div className="ml-auto font-medium text-right">
								{formatDate(client.creatPe)}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
