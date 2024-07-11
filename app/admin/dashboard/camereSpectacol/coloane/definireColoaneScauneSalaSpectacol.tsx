"use client";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";
import {
  ColoanaSelecteazaCapTabel,
  ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { LocSalaSpectacol, TipuriTabel } from "@/lib/tipuri";
import { ColumnDef } from "@tanstack/react-table";

export const columnsShowRoomSeat: ColumnDef<LocSalaSpectacol>[] = [
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
    cell: ({ row }) => {
      return (
        <CelulaColoanaActiuni
          type={TipuriTabel.SCAUN_CAMERA_SPECTACOL}
          deleteId={row.original.codLocSala}
          link_edit={
            "camereSpectacol/" + row.original.codLocSala + "/editare-loc"
          }
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "codLocSala",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cod Loc Sala" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.codLocSala} />;
    },
  },
  {
    accessorKey: "numarLoc",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Numar Loc" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.numarLoc} />;
    },
  },
  {
    accessorKey: "rand",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Rand Loc" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.rand} />;
    },
  },
  {
    accessorKey: "pretLoc",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Pret Loc (RON)" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.pretLoc} />;
    },
  },
  {
    accessorKey: "tipLoc",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Tip Loc" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.tipLoc} />;
    },
  },
  {
    accessorKey: "numarSala",
    header: ({ column }) => {
      return (
        <AntetColoana coloana={column} titlu="Cod & Nume Sala Spectacol" />
      );
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.salaSpectacol?.numarSala} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Adăugat Pe" />;
    },
    cell: ({ row }) => {
      return (
        <CelulaColoana
          date={capitalizeazaPrimaLitera(
            formateazaDataComplet(row.original.creatPe)
          )}
        />
      );
    },
  },
];
