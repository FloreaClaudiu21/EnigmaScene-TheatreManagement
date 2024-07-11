import { prisma } from "@/lib/prismaClient";
import { columnsReceipts } from "./coloane/definireColoaneBonFiscal";
import { BonFiscal, TipuriTabel } from "@/lib/tipuri";
import PaginiTab from "@/components/admin/table/PaginiTab";
import GeneralTabel from "@/components/admin/table/GeneralTabel";

export default async function AdminFiscalReceipts() {
  const receipts: BonFiscal[] = await prisma.bonFiscal.findMany({
    orderBy: {
      creatPe: "desc",
    },
    include: {
      client: true,
      plata: true,
      spectacol: {
        include: {
          bileteVandute: true,
          salaSpectacol: {
            include: {
              locuriSala: true,
            },
          },
          tipSpectacol: true,
          sezon: true,
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
          bonFiscal: true,
          client: true,
          plata: true,
        },
      },
    },
  });
  return (
    <PaginiTab
      valoareDef="all"
      taburi={[
        {
          nume: "Toate Bonurile Fiscale",
          valoare: "all",
          continut: (
            <GeneralTabel
              data={receipts}
              title="Bonuri Fiscale Emise"
              showControlBtns={false}
              columns={columnsReceipts}
              type={TipuriTabel.BON_FISCAL}
              create_link="fiscalReceipt/create"
              subtitle="Administrați chitanțele fiscale și vizualizați datele clienților acestora."
              filters={[
                { column: "codBonFiscal", label: "Cod Bon Fiscal" },
                { column: "numarBonFiscal", label: "Numar Bon" },
                { column: "serieBonFiscal", label: "Serie Bon" },
                { column: "codClient", label: "Cod Client" },
                { column: "numeClient", label: "Nume Client" },
                { column: "codPlata", label: "Cod Plata" },
                { column: "sumaPlatita", label: "Suma Platită" },
                { column: "codSpectacol", label: "Cod Spectacol" },
                { column: "titlu", label: "Nume Spectacol" },
                { column: "creatPe", label: "Emis Pe" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
