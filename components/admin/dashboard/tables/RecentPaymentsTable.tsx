import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prismaClient";
import { formatDateFull } from "@/lib/rangeOptions";
import { Plata } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Chip, Link } from "@nextui-org/react";
import { StarePlata } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import React from "react";

export default async function RecentPaymentsTable() {
	const payments: Plata[] = await prisma.plata.findMany({
		take: 10,
		orderBy: {
			platitPe: "desc",
		},
		include: {
			client: true,
			factura: true,
		},
	});
	return (
		<Card className="xl:col-span-2 w-full shadow-md max-h-[1000px] overflow-y-auto">
			<CardHeader className="flex flex-row items-center">
				<div className="grid gap-2">
					<CardTitle>Plăți Recente - Ultimele 10 înregistrări</CardTitle>
					<CardDescription>
						Plăți recente efectuate de către clienți pentru cumpărarea
						biletelor.
					</CardDescription>
				</div>
				<Button asChild size="sm" className="ml-auto gap-1">
					<Link href="./dashboard/payments">
						Mai Multe
						<ArrowUpRight className="h-4 w-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-red-500 text-center">Client</TableHead>
							<TableHead className="text-red-500 text-center">
								Metoda De Plată
							</TableHead>
							<TableHead className="text-red-500 text-center">
								Stare Plată
							</TableHead>
							<TableHead className="text-red-500 text-center">
								Suma Plătită
							</TableHead>
							<TableHead className="text-red-500 text-center">
								Plătit Pe
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{payments.map((payment) => {
							const color =
								payment.starePlata == StarePlata.ACCEPTATA
									? "success"
									: "danger";
							const cur = payment.rataDeSchimbValutar?.moneda;
							let priceConverted = payment.sumaPlatita;
							if (cur != "RON") {
								priceConverted /= payment.rataDeSchimbValutar?.valuare ?? 1;
							}
							return (
								<TableRow
									key={payment.codPlata}
									className="justify-items-center"
								>
									<TableCell>
										<div className="font-medium">
											{payment.client?.numeClient}
										</div>
										<div className="text-sm text-muted-foreground inline">
											{payment.client?.email}
										</div>
									</TableCell>
									<TableCell className="text-center">
										{payment.tipPlata}
									</TableCell>
									<TableCell className="flex justify-center place-items-center">
										<Chip variant="flat" color={color} className="text-xs">
											{color != "danger" ? "Aceptată" : "Refuzată"}
										</Chip>
									</TableCell>
									<TableCell className="text-center">
										{priceConverted.toFixed(2)}{" "}
										{payment.rataDeSchimbValutar?.moneda}
									</TableCell>
									<TableCell className="table-cell text-center">
										{capitalizeFirstLetter(formatDateFull(payment.platitPe))}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
