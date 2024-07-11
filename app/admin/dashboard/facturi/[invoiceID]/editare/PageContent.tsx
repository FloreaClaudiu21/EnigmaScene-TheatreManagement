"use client";
import NouEditareContinut from "@/components/admin/NouEditareContinut";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { schemaCreareFacturaFiscala } from "@/lib/schemeFormulare";
import {
  AdresaFacturare,
  coduriTariRomanesti,
  FacturaFiscala,
  TipuriTabel,
} from "@/lib/tipuri";
import { actualizare } from "@/services/backend/GeneralController";
import {
  ecranIncarcare,
  formularCreareAdresa,
} from "@/services/general/FurnizorStare";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Tooltip,
} from "@nextui-org/react";
import {
  MailIcon,
  PenIcon,
  PhoneIcon,
  PlusIcon,
  SquareUserIcon,
} from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdminInvoiceEditAdmin({
  invoice,
}: {
  invoice: FacturaFiscala;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const addAddress = formularCreareAdresa();
  const loadingScreen = ecranIncarcare();
  const form = useForm<z.infer<typeof schemaCreareFacturaFiscala>>({
    resolver: zodResolver(schemaCreareFacturaFiscala),
    defaultValues: {
      numarFactura: invoice.numarFactura,
      codClient: invoice.codClient,
      codPlata: invoice.codPlata,
      codBonFiscal: invoice.codBonFiscal,
      sumaPlatita: invoice.sumaPlatita + "",
      adresaFacturare: invoice.adresaFacturare,
      email: invoice.email,
      numeClient: invoice.numeClient,
      telefon: invoice.telefon.substring(3),
      prefix: invoice.telefon.substring(3, 0),
    },
  });
  const billingAddreses = invoice.client?.adreseFacturare ?? [];
  async function onSubmit(values: z.infer<typeof schemaCreareFacturaFiscala>) {
    loadingScreen.setIncarcare(true);
    const data = await actualizare(
      TipuriTabel.FACTURA_FISCALA,
      values,
      invoice.codFactura
    );
    toast({
      description: data.mesaj,
      title: "Editare Factură",
      variant: data.ok ? "default" : "destructive",
    });
    if (data.ok) {
      router.push("../../facturi?tab=all");
      form.reset();
      router.refresh();
    }
    loadingScreen.setIncarcare(false);
  }
  return (
    <NouEditareContinut
      form={form}
      onSubmit={onSubmit}
      back_link="../../facturi?tab=all"
      titlu={`Editați factura cu codul de identificare #${invoice.codFactura}`}
      loading={loadingScreen.incarcare}
    >
      <div className="flex flex-col md:flex-row gap-2">
        <FormField
          name="numarFactura"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full md:w-1/2">
              <FormLabel>Numar Factura*</FormLabel>
              <FormControl>
                <Input
                  radius="md"
                  isDisabled
                  variant="bordered"
                  required
                  endContent={
                    <PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="codPlata"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full md:w-1/2">
              <FormLabel>Cod Plata*</FormLabel>
              <FormControl>
                <Input
                  radius="md"
                  variant="bordered"
                  isDisabled
                  required
                  endContent={
                    <PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  {...field}
                  value={field.value + ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <FormField
          control={form.control}
          name="codClient"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/2">
              <FormLabel>Cod Client*</FormLabel>
              <FormControl>
                <Input
                  radius="md"
                  variant="bordered"
                  isDisabled
                  required
                  endContent={
                    <PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  {...field}
                  value={field.value + ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="codBonFiscal"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/2">
              <FormLabel>Cod Bon Fiscal*</FormLabel>
              <FormControl>
                <Input
                  radius="md"
                  variant="bordered"
                  isDisabled
                  required
                  endContent={
                    <PenIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  {...field}
                  value={field.value + ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row gap-2 place-items-center">
        <FormField
          control={form.control}
          name="adresaFacturare"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Adresa facturare*</FormLabel>
              <FormControl>
                <Autocomplete
                  radius="md"
                  variant="bordered"
                  defaultSelectedKey={invoice.adresaFacturare}
                  onSelectionChange={field.onChange}
                  {...field}
                >
                  {billingAddreses.map((bill: AdresaFacturare, index) => {
                    const name =
                      bill.adresa + ", " + bill.oras + ", " + bill.tara;
                    return (
                      <AutocompleteItem value={name} key={name}>
                        {index + 1 + ". " + name}
                      </AutocompleteItem>
                    );
                  })}
                </Autocomplete>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Tooltip content="Adauga adresa facturare" radius="md">
          <Button
            size="sm"
            isIconOnly
            radius="md"
            variant="flat"
            className="!mt-8"
            onClick={() => {
              addAddress.setVizibil(true);
              addAddress.setEstePanouAdmin(invoice.client?.codClient ?? 0);
            }}
          >
            <PlusIcon size={20} />
          </Button>
        </Tooltip>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <FormField
          control={form.control}
          name="numeClient"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/2">
              <FormLabel>Nume Client*</FormLabel>
              <FormControl>
                <Input
                  radius="md"
                  variant="bordered"
                  required
                  endContent={
                    <SquareUserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/2">
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  radius="md"
                  variant="bordered"
                  required
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row gap-2">
        <FormField
          name="prefix"
          control={form.control}
          render={({ field }) => (
            <FormItem className="min-w-[140px]">
              <FormLabel>Telefon*</FormLabel>
              <FormControl>
                <Autocomplete
                  radius="md"
                  label="Prefix"
                  variant="bordered"
                  onSelectionChange={field.onChange}
                  defaultInputValue={invoice.client?.telefon.substring(3, 0)}
                  {...field}
                >
                  {coduriTariRomanesti.map((array) => {
                    return (
                      <AutocompleteItem
                        className="px-0"
                        value={array[1]}
                        key={array[1]}
                      >
                        {array[1]}
                      </AutocompleteItem>
                    );
                  })}
                </Autocomplete>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="telefon"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full mt-8">
              <FormControl>
                <Input
                  type="phone"
                  radius="md"
                  variant="bordered"
                  required
                  endContent={
                    <PhoneIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </NouEditareContinut>
  );
}
