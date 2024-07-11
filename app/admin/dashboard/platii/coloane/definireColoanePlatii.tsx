"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Chip } from "@nextui-org/react";
import { StarePlata } from "@prisma/client";
import { Plata } from "@/lib/tipuri";
import ModalViewInvoice from "@/components/facturaFiscala/ButonVizualizareFacturaFiscala";
import ModalViewFiscalReceipt from "@/components/bonuriFiscale/ButonVizualizareBon";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";

export const columnsPayments: ColumnDef<Plata>[] = [
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return (
        <div className="flex flex-row gap-2 place-items-center">
          <ModalViewInvoice invoice={original.factura} />
          <ModalViewFiscalReceipt receipt={original.bonFiscal} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "codPlata",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cod Plata" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.codPlata} />;
    },
  },
  {
    accessorKey: "numeClient",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Nume Client" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.client?.numeClient} />;
    },
  },
  {
    accessorKey: "sumaPlatita",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Suma Platita (RON)" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.sumaPlatita} />;
    },
  },
  {
    accessorKey: "platitPe",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Platit Pe" />;
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana
          date={capitalizeazaPrimaLitera(
            formateazaDataComplet(original.platitPe)
          )}
        />
      );
    },
  },
  {
    accessorKey: "tipPlata",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Tip Plata" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.tipPlata} />;
    },
  },
  {
    accessorKey: "starePlata",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Stare Plata" />;
    },
    cell: ({ row }) => {
      const color =
        row.original.starePlata == StarePlata.ACCEPTATA ? "success" : "danger";
      return (
        <div className="flex flex-row items-center justify-center text-center">
          <Chip variant="flat" color={color}>
            {color != "danger" ? "Aceptată" : "Refuzată"}
          </Chip>
        </div>
      );
    },
  },
];
