"use server";
import { prisma } from "@/lib/prismaClient";
import { Client, User } from "next-auth";
import DataTable from "@/components/admin/table/GeneralTabel";
import { decripteazaParola } from "@/services/auth/autentificare";
import PaginiTab from "@/components/admin/table/PaginiTab";
import { TipuriTabel } from "@/lib/tipuri";
import { columns } from "./coloane/definireColoaneClienti";

export default async function AdminClients() {
  const clients: Client[] = await prisma.client.findMany({
    orderBy: {
      creatPe: "desc",
    },
    include: {
      adreseFacturare: true,
      bileteCumparate: {
        include: {
          spectacol: true,
        },
      },
      platiiEfectuate: true,
    },
  });
  const decClients = clients.map((v) => {
    return { ...v, parola: decripteazaParola(v.parola) } as User;
  });
  return (
    <PaginiTab
      valoareDef="all"
      taburi={[
        {
          nume: "Toți Clienți",
          valoare: "all",
          continut: (
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
