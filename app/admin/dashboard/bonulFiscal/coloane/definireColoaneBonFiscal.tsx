"use client";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import ModalViewFiscalReceipt from "@/components/bonuriFiscale/ButonVizualizareBon";
import ModalViewInvoice from "@/components/facturaFiscala/ButonVizualizareFacturaFiscala";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera, formateazaData } from "@/lib/metodeUtile";
import { BiletSpectacol, BonFiscal } from "@/lib/tipuri";
import { formularGrafic } from "@/services/general/FurnizorStare";
import { ColumnDef } from "@tanstack/react-table";

export const columnsReceipts: ColumnDef<BonFiscal>[] = [
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return (
        <div className="flex flex-row gap-2 place-items-center flex-wrap">
          <ModalViewInvoice invoice={original.factura} />
          <ModalViewFiscalReceipt receipt={original} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "codBonFiscal",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cod Bon Fiscal" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.codBonFiscal} />;
    },
  },
  {
    accessorKey: "numarBonFiscal",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Numar Bon" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.numarBonFiscal} />;
    },
  },
  {
    accessorKey: "serieBonFiscal",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Serie Bon" />;
    },
    cell: ({ row: { original } }) => {
      return <CelulaColoana date={original.serieBonFiscal} />;
    },
  },
  {
    accessorKey: "sumaPlatita",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Suma Platită" />;
    },
    cell: ({ row: { original } }) => {
      let priceConverted = original.plata?.sumaPlatita ?? 0;
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
    accessorKey: "numarSala",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Numar Sala Spectacol" />;
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana date={original.spectacol?.salaSpectacol?.numarSala} />
      );
    },
  },
  {
    accessorKey: "bileteVandute",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Bilete Vandute Spectacol" />;
    },
    cell: ({ row: { original } }) => {
      const chartModel = formularGrafic();
      const bilete = original.bileteSpectacol ?? [];
      return (
        <CelulaColoana
          date={
            <div
              onClick={() => {
                chartModel.setTitlu("Bilete vandute: " + bilete.length);
                chartModel.setContinut(
                  bilete.map((ticket: BiletSpectacol) => {
                    let priceConverted = ticket.pretVanzare ?? 0;
                    return {
                      titlu: `Achiziționat de: ${ticket.client?.numeClient}`,
                      content: [
                        {
                          titlu: "Număr bilet spectacol: ",
                          content: ticket.numarBilet ?? "",
                        },
                        {
                          titlu: "Preț bilet: ",
                          content: priceConverted.toFixed(2) + " RON",
                        },
                        {
                          titlu: "Achiziționat pe: ",
                          content: capitalizeazaPrimaLitera(
                            formateazaDataComplet(ticket.creatPe)
                          ),
                        },
                      ],
                    };
                  })
                );
                chartModel.setVizibil(true);
              }}
            >
              <span className="hover:cursor-pointer">
                {bilete.length +
                  "/" +
                  (original.spectacol?.salaSpectacol?.locuriSala?.length ?? 0)}
              </span>
            </div>
          }
        />
      );
    },
  },
  {
    accessorKey: "creatPe",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Bon Emis Pe" />;
    },
    cell: ({ row: { original } }) => {
      return (
        <CelulaColoana
          date={capitalizeazaPrimaLitera(
            formateazaDataComplet(original.creatPe)
          )}
        />
      );
    },
  },
];
