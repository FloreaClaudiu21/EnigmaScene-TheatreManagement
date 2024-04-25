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
import { Payment } from "@/lib/types";
import { Chip, Link } from "@nextui-org/react";
import { PaymentStatus } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import React from "react";

export default async function RecentPaymentsTable() {
	const payments: Payment[] = await prisma.payment.findMany({
		take: 10,
		orderBy: {
			paidAt: "desc",
		},
		include: {
			client: true,
			invoice: true,
		},
	});
	return (
		<Card className="xl:col-span-2 w-full max-h-[1000px] overflow-y-auto">
			<CardHeader className="flex flex-row items-center">
				<div className="grid gap-2">
					<CardTitle>Transactions</CardTitle>
					<CardDescription>
						Recent transactions from your theatre.
					</CardDescription>
				</div>
				<Button asChild size="sm" className="ml-auto gap-1">
					<Link href="./dashboard/payments">
						View All
						<ArrowUpRight className="h-4 w-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-red-500 text-center">
								Customer
							</TableHead>
							<TableHead className="text-red-500 text-center">Type</TableHead>
							<TableHead className="text-red-500 text-center">Status</TableHead>
							<TableHead className="text-red-500 text-center">Amount</TableHead>
							<TableHead className="text-red-500 text-center">Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{payments.map((payment) => {
							const color =
								payment.status == PaymentStatus.ACCEPTED ? "success" : "danger";
							const cur = payment.currency;
							let priceConverted = payment.amount;
							if (cur != "RON") {
								priceConverted /= payment.currencyAmount;
							}
							return (
								<TableRow key={payment.id} className="justify-items-center">
									<TableCell>
										<div className="font-medium">
											{payment.client?.firstName +
												" " +
												payment.client?.lastName}
										</div>
										<div className="text-sm text-muted-foreground inline">
											{payment.client?.email}
										</div>
									</TableCell>
									<TableCell className="text-center">{payment.type}</TableCell>
									<TableCell className="flex justify-center place-items-center">
										<Chip variant="flat" color={color} className="text-xs">
											{color != "danger" ? "Accepted" : "Rejected"}
										</Chip>
									</TableCell>
									<TableCell className="text-center">
										{priceConverted.toFixed(2)} {payment.currency}
									</TableCell>
									<TableCell className="table-cell text-center">
										{payment.paidAt.toISOString().split("T")[0]}
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
