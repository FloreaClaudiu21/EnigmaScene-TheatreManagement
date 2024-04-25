import React from "react";
import { Divider } from "@nextui-org/react";
import RevenueStatCard from "@/components/admin/dashboard/stats/RevenueStatCard";
import ClientsStatCard from "@/components/admin/dashboard/stats/ClientsStatCard";
import DecoMaterialsStatCard from "@/components/admin/dashboard/stats/DecorationMaterialsStatCard";
import TicketsStatCard from "@/components/admin/dashboard/stats/TicketsStatCard";
import RecentPaymentsTable from "@/components/admin/dashboard/tables/RecentPaymentsTable";
import RecentTicketsBuyedTable from "@/components/admin/dashboard/tables/RecentTicketsBuyedTable";
import { generateDictionary } from "@/lib/dictionary";

export default async function DashboardPage({ params }: { params: any }) {
	const dict = await generateDictionary(params);
	return (
		<div className="flex flex-col gap-8 md:gap-4 h-full">
			<div className="flex flex-col w-full gap-2 md:flex-row md:gap-8 justify-between">
				<RevenueStatCard />
				<ClientsStatCard />
				<TicketsStatCard />
				<DecoMaterialsStatCard />
			</div>
			<Divider className="block md:hidden" />
			<div className="flex flex-1 !mb-8 md:mb-0 flex-col w-full lg:flex-row gap-4 justify-between">
				<RecentPaymentsTable />
				<RecentTicketsBuyedTable params={params} />
			</div>
		</div>
	);
}
