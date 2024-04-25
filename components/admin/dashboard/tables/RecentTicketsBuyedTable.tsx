import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prismaClient";
import { TicketSold } from "@/lib/types";
import { Image } from "@nextui-org/react";
import React from "react";

export default async function RecentTicketsBuyedTable({
	params,
}: {
	params: any;
}) {
	const lang = params.lang;
	const tickets: TicketSold[] = await prisma.ticketSold.findMany({
		take: 5,
		orderBy: {
			createdAt: "desc",
		},
		include: {
			client: true,
			payment: true,
			show: {
				include: {
					showType: true,
					season: true,
					showRoom: true,
				},
			},
		},
	});
	return (
		<Card className="md:min-w-[410px] max-h-[800px] overflow-y-auto">
			<CardHeader>
				<CardTitle>Recent Tickets Sold</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-8 w-full">
				{tickets.map((ticket: TicketSold) => {
					const cur = ticket.payment?.currency;
					let priceConverted = ticket.payment?.amount ?? 0;
					if (cur != "RON") {
						priceConverted /= ticket.payment?.currencyAmount ?? 0;
					}
					return (
						<div
							key={ticket.id}
							className="flex items-start gap-4 overflow-hidden border-b-1 pb-2"
						>
							<Image
								src={ticket.show?.image}
								alt=""
								className="h-20 w-32 min-w-28 rounded-sm"
							/>
							<div className="grid gap-1 overflow-hidden break-all">
								<p className="text-md font-semibold leading-none text-red-500">
									{ticket.number}
								</p>
								<p className="text-sm text-muted-foreground">
									{lang == "ro" ? ticket.show?.title : ticket.show?.title_en}
								</p>
								<p className="text-sm text-muted-foreground">
									{lang == "ro"
										? ticket.show?.showType.name
										: ticket.show?.showType.name_en}
								</p>
								<p className="text-sm text-muted-foreground">
									{ticket.show?.showRoom?.number}
								</p>
							</div>
							<div className="ml-auto font-medium text-right">
								+{priceConverted.toFixed(2)} {cur}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
