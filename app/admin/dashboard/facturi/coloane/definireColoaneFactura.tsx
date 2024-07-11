"use client";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";
import {
  ColoanaSelecteazaCapTabel,
  ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import ModalViewFiscalReceipt from "@/components/bonuriFiscale/ButonVizualizareBon";
import ModalViewInvoice from "@/components/facturaFiscala/ButonVizualizareFacturaFiscala";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { FacturaFiscala, TipuriTabel } from "@/lib/tipuri";
import { ColumnDef } from "@tanstack/react-table";

export const columnsInvoice: ColumnDef<FacturaFiscala>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return <ColoanaSelecteazaCapTabel table={table} />;
    },
    cell: ({ row }) => {
      return <ColoanaSelecteazaRand row={row} />;
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      console.log(original);
      return (
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 place-items-center">
            <ModalViewInvoice invoice={original} />
            <ModalViewFiscalReceipt receipt={original.bonFiscal} />
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "numarFactura",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Numar Factura" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.numarFactura} />;
    },
  },
  {
    accessorKey: "dataIntocmiri",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Data Intocmirii" />;
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana
          date={capitalizeazaPrimaLitera(
            formateazaDataComplet(original.dataIntocmiri)
          )}
        />
      );
    },
  },
  {
    accessorKey: "codPlata",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cod Plata" />;
    },
    cell: ({ row }) => {
      return <CelulaColoana date={row.original.codPlata} />;
    },
  },
  {
    accessorKey: "sumaPlatita",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Suma Platita" />;
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana
          date={
            (original.sumaPlatita + original.costuriExtra).toFixed(2) + " RON"
          }
        />
      );
    },
  },
  {
    accessorKey: "numarBonFiscal",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Numar Bon Fiscal" />;
    },
    cell: ({ row }) => {
      return <CelulaColoana date={row.original.bonFiscal?.numarBonFiscal} />;
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
    accessorKey: "adresaFacturare",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Detalii Facturare" />;
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana
          date={
            <div className="flex flex-row flex-wrap justify-center">
              {original.email}, {original.telefon}, {original.adresaFacturare}
            </div>
          }
        />
      );
    },
  },
];
