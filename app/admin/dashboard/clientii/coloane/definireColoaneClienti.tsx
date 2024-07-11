"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { Button, Chip, Link } from "@nextui-org/react";
import {
  formularGrafic,
  formularStergereAdresa,
  formularStergereInregistrari,
} from "@/services/general/FurnizorStare";
import { User } from "next-auth";
import { BiletSpectacol, Plata, TipuriTabel } from "@/lib/tipuri";
import {
  ColoanaSelecteazaCapTabel,
  ColoanaSelecteazaRand,
} from "@/components/admin/table/SelectareColoane";
import AntetColoana from "@/components/admin/table/AntetColoana";
import CelulaColoana from "@/components/admin/table/CelulaColoana";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";
import { formateazaData, formateazaDataComplet } from "@/lib/intervaleOptiuni";

function ActionButtons({ user }: { user: User }) {
  const deleteModal = formularStergereInregistrari();
  return (
    <div className="flex flex-row items-center justify-center text-center gap-2">
      <Button
        size="sm"
        isIconOnly
        radius="sm"
        variant="light"
        className="text-zinc-600 hover:text-red-600"
        onPress={() => {
          deleteModal.setTip(TipuriTabel.CLIENT);
          deleteModal.setCodStergere(user.codClient);
          deleteModal.setVizibil(true);
        }}
      >
        <Trash2Icon size={18} />
      </Button>
      <Button
        size="sm"
        as={Link}
        radius="sm"
        isIconOnly
        variant="faded"
        className="text-zinc-600 border-zinc-400 font-medium"
        href={"clientii/" + user.codClient + "/editare"}
      >
        <Edit2Icon size={18} />
      </Button>
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
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
      const user = row.original;
      return <ActionButtons user={user} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "codClient",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Cod Client" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.codClient} />;
    },
  },
  {
    accessorKey: "numeClient",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Nume Client" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.numeClient} />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Email" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <CelulaColoana
          date={user.email}
          clasa={`${user.utlizatorAdmin && "font-bold underline"}`}
        />
      );
    },
  },
  {
    accessorKey: "telefon",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Telefon" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={user.telefon} />;
    },
  },
  {
    accessorKey: "dataNasterii",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Data Nasterii" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      return <CelulaColoana date={row.original.dataNasterii} />;
    },
  },
  {
    accessorKey: "creatPe",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Creat Pe" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      const theDate = capitalizeazaPrimaLitera(
        formateazaDataComplet(user.creatPe)
      );
      return <CelulaColoana date={theDate} />;
    },
  },
  {
    accessorKey: "bileteCumparate",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Bilete Cumpărate" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      const chartModel = formularGrafic();
      const bilete = user.bileteCumparate ?? [];
      return (
        <CelulaColoana
          date={
            <div
              onClick={() => {
                chartModel.setTitlu("Bilete cumparate de " + user.email);
                chartModel.setContinut(
                  bilete.map((ticket: BiletSpectacol) => {
                    let priceConverted = ticket.pretVanzare ?? 0;
                    return {
                      titlu: `1 x ${ticket.spectacol?.titlu}`,
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
                {user.bileteCumparate?.length ?? 0}
              </span>
            </div>
          }
        />
      );
    },
  },
  {
    accessorKey: "platiiEfectuate",
    header: ({ column }) => {
      return <AntetColoana coloana={column} titlu="Plății Efectuate" />;
    },
    cell: ({ row }) => {
      const user = row.original;
      const chartModel = formularGrafic();
      const plati = user.platiiEfectuate ?? [];
      return (
        <CelulaColoana
          date={
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                chartModel.setTitlu("Plăți efectuate de către " + user.email);
                chartModel.setContinut(
                  plati.map((plata: Plata) => {
                    return {
                      titlu: `Platit pe: ${formateazaDataComplet(
                        plata.platitPe
                      )}`,
                      content: [
                        {
                          titlu: "Suma plătită: ",
                          content: plata.sumaPlatita + " RON",
                        },
                        {
                          titlu: "Stare plată: ",
                          content: plata.starePlata,
                        },
                        {
                          titlu: "Tip plată: ",
                          content: plata.tipPlata,
                        },
                      ],
                    };
                  })
                );
                chartModel.setVizibil(true);
              }}
            >
              <span className="hover:cursor-pointer">{plati.length}</span>
            </div>
          }
        />
      );
    },
  },
];
