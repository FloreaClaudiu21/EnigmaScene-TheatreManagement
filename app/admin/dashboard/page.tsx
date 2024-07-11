import React from "react";
import { Divider } from "@nextui-org/react";
import RecentPaymentsTable from "@/components/admin/dashboard/tables/RecentPaymentsTable";
import { ChartCard } from "@/components/admin/dashboard/ChartCard";
import ShowsStatCard from "@/components/admin/dashboard/stats/SpectacoleStatCard";
import TicketsStatCard from "@/components/admin/dashboard/stats/BileteStatCard";
import RecentClientsTable from "@/components/admin/dashboard/tables/ClientiRecentiiTabel";
import BonuriFiscaleStatCard from "@/components/admin/dashboard/stats/BonFiscalStatCard";
import { TipDiagrama, TipDiagramaT } from "@/lib/tipuri";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: any;
}) {
  return (
    <div className="flex flex-col gap-8 md:gap-4 h-full">
      <div className="flex flex-col w-full gap-2 md:flex-row md:gap-8 justify-between">
        <ShowsStatCard searchParams={searchParams} />
        <TicketsStatCard searchParams={searchParams} />
        <BonuriFiscaleStatCard searchParams={searchParams} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard
          title="Clienti Noi"
          chartType={TipDiagrama.BAR}
          queryKey="newClientsChart"
          searchParams={searchParams}
          chartDataType={TipDiagramaT.UTILIZATORI_TOTALE}
        />
        <ChartCard
          title="Vanzări Totale (RON)"
          chartType={TipDiagrama.LINE}
          queryKey="totalSalesChart"
          searchParams={searchParams}
          chartDataType={TipDiagramaT.VANZARI_TOTALE}
        />
      </div>
      <Divider className="block md:hidden" />
      <div className="flex flex-1 !mb-8 md:mb-0 flex-col w-full lg:flex-row gap-4 justify-between">
        <RecentPaymentsTable />
        <RecentClientsTable />
      </div>
    </div>
  );
}
