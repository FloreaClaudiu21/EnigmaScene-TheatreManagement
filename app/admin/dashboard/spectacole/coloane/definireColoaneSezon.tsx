"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Tooltip } from "@nextui-org/react";
import {
  formularGrafic,
  formularImagineSpectacol,
} from "@/services/general/FurnizorStare";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";
import { BiletSpectacol, Spectacol, TipuriTabel } from "@/lib/tipuri";
import { ImageIcon } from "lucide-react";
import {
  ColoanaSelecteazaCapTabel,
  ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";

function ActionsShow({ row }: { row: any }) {
  const imgModal = formularImagineSpectacol();
  return (
    <div className="flex flex-row gap-2">
      <CelulaColoanaActiuni
        type={TipuriTabel.SPECTACOL}
        deleteId={row.original.codSpectacol}
        link_edit={"spectacole/" + row.original.codSpectacol + "/editare"}
      />
      <Button
        size="sm"
        radius="sm"
        isIconOnly
        variant="bordered"
        onClick={() => {
          imgModal.setSpectacol(row.original);
          imgModal.setVizibil(true);
        }}
        title="Vizualizare imagine spectacol"
        className="text-zinc-600 font-medium hover:text-red-600"
      >
        <ImageIcon size={18} />
      </Button>
    </div>
  );
}

export const columnsShow: ColumnDef<Spectacol>[] = [
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
      return <ActionsShow row={row} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "codSpectacol",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cod Spectacol" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.codSpectacol} />;
    },
  },
  {
    accessorKey: "titlu",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Titlu" />;
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana
          date={
            <div className="flex flex-row items-start justify-center text-center h-full break-words">
              <Tooltip
                content={original.descriereScurta}
                className="max-w-32"
                showArrow
              >
                <p>{original.titlu}</p>
              </Tooltip>
            </div>
          }
        />
      );
    },
  },
  {
    accessorKey: "director",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Regizor" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.director} />;
    },
  },
  {
    accessorKey: "oraIncepere",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Ora & Data Inceperii" />;
    },
    cell: ({ row }) => {
      const show = row.original;
      return (
        <CelulaColoana
          date={capitalizeazaPrimaLitera(
            formateazaDataComplet(new Date(show.oraIncepere))
          )}
        />
      );
    },
  },
  {
    accessorKey: "oraTerminare",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Ora & Data Terminării" />;
    },
    cell: ({ row }) => {
      const show = row.original;
      return (
        <CelulaColoana
          date={capitalizeazaPrimaLitera(
            formateazaDataComplet(new Date(show.oraTerminare))
          )}
        />
      );
    },
  },
  {
    accessorKey: "numeSezon",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Sezon" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.sezon?.numeSezon} />;
    },
  },
  {
    accessorKey: "numeTip",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Sezon & Categorie" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.tipSpectacol?.numeTip} />;
    },
  },
  {
    accessorKey: "numarSala",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Nume Sala" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.salaSpectacol?.numarSala} />;
    },
  },
  {
    accessorKey: "creatPe",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Adăugat Pe" />;
    },
    cell: ({ row }) => {
      const show = row.original;
      const theDate = capitalizeazaPrimaLitera(
        formateazaDataComplet(show.creatPe)
      );
      return <CelulaColoana date={theDate} />;
    },
  },
];
