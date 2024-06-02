import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prismaClient";
import { formatDate } from "@/lib/rangeOptions";
import { Client } from "next-auth";
import Link from "next/link";
import React from "react";

export default async function RecentClientsTable() {
	const clients: Client[] = await prisma.client.findMany({
		take: 5,
		orderBy: {
			creatPe: "desc",
		},
		include: {
			providerii: true,
			bileteCumparate: {
				include: {
					client: true,
					spectacol: true,
					salaSpectacol: true,
					locSalaSpectacol: true,
				},
			},
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
								<Link
									href={"./dashboard/clientii?numeClient=" + client.numeClient}
									className="text-lg font-semibold leading-none text-red-500 hover:underline"
								>
									{client.numeClient}
								</Link>
								<Link
									href={"./dashboard/clientii?email=" + client.email}
									className="text-md text-muted-foreground underline hover:font-semibold"
								>
									{client.email}
								</Link>
								<div className="flex flex-col gap-1">
									<Link
										href={"./dashboard/bilete?codClient=" + client.codClient}
										className="text-sm text-muted-foreground hover:underline"
									>
										{"Bilete cumpărate: " + client.bileteCumparate?.length}
									</Link>
									<Link
										href={"./dashboard/platii?codClient=" + client.codClient}
										className="text-sm text-muted-foreground hover:underline"
									>
										{"Plăți efectuate: " + client.platiiEfectuate?.length}
									</Link>
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
