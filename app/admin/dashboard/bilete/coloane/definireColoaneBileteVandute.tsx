"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@nextui-org/react";
import { useOptimistic, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BiletSpectacol, TipuriTabel } from "@/lib/tipuri";
import { verificareBiletSpectacol } from "@/services/backend/bilete/verificareBiletSpectacol";
import {
  ColoanaSelecteazaCapTabel,
  ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import ModalViewInvoice from "@/components/facturaFiscala/ButonVizualizareFacturaFiscala";
import ModalViewFiscalReceipt from "@/components/bonuriFiscale/ButonVizualizareBon";
import ModalViewTicket from "@/components/bileteSpectacol/ButonVizualizareBilet";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";
import { formateazaData, formateazaDataComplet } from "@/lib/intervaleOptiuni";
import CelulaColoanaActiuni from "@/components/admin/table/CelulaColoanaActiuni";

const VerifyComponent = ({ bilet }: { bilet: BiletSpectacol }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useOptimistic(bilet.biletVerificat);
  const verifyMethod = async () => {
    if (isPending) return;
    setChecked(!bilet.biletVerificat);
    const response = await verificareBiletSpectacol(bilet);
    if (!response.ok) {
      toast({
        title: "Verificare bilet la spectacol",
        variant: "destructive",
        description:
          "A apărut o eroare necunoscută în timpul verificari biletului. Vă rugăm să încercați din nou mai târziu.",
      });
    }
  };
  return (
    <div className="flex flex-row items-center justify-center text-center break-all">
      <Checkbox
        isSelected={checked}
        value={checked + ""}
        onValueChange={() => {
          startTransition(() => verifyMethod());
        }}
      />
    </div>
  );
};

export const columnsTicketsSold: ColumnDef<BiletSpectacol>[] = [
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
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          <div className="flex flex-row gap-2 place-items-center">
            <ModalViewInvoice invoice={original.factura} />
            <ModalViewFiscalReceipt receipt={original.bonFiscal} />
            <ModalViewTicket ticket={original} />
          </div>
          <CelulaColoanaActiuni
            deleteId={original.codBiletSpectacol}
            type={TipuriTabel.BILET}
            link_edit={"bilete/" + original.codBiletSpectacol + "/editare"}
          />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "verificareBilet",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Bilet Verificat" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <VerifyComponent bilet={user} />;
    },
  },
  {
    accessorKey: "codBiletSpectacol",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cod Bilet Spectacol" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.codBiletSpectacol} />;
    },
  },
  {
    accessorKey: "numarBilet",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Numar Bilet" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.numarBilet} />;
    },
  },
  {
    accessorKey: "pretVanzare",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Preț Bilet" />;
    },
    cell: ({ row: { original } }) => {
      let priceConverted = original.pretVanzare;
      return <CelulaColoana date={priceConverted.toFixed(2) + " RON"} />;
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
    accessorKey: "titlu",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Nume Spectacol" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.spectacol?.titlu} />;
    },
  },
  {
    accessorKey: "detaliiLoc",
    header: ({ column }) => {
      return (
        <AntetColoana coloana={column} titlu="Sala, Nr. Loc, Rand, Tip Loc" />
      );
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana
          date={
            (original.salaSpectacol?.numarSala,
            original.locSalaSpectacol?.numarLoc,
            original.locSalaSpectacol?.rand,
            original.locSalaSpectacol?.tipLoc)
          }
        />
      );
    },
  },
  {
    accessorKey: "creatPe",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cumparat Pe" />;
    },
    cell: ({ row }) => {
      const show = row.original;
      return (
        <CelulaColoana
          date={capitalizeazaPrimaLitera(formateazaDataComplet(show.creatPe))}
        />
      );
    },
  },
];
