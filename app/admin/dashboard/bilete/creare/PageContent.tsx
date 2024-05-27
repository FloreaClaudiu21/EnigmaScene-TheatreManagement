"use client";
import { useToast } from "@/components/ui/use-toast";
import { useLoadingScreen } from "@/services/StateProvider";
import { insert } from "@/services/admin/ControlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Client } from "next-auth";
import ShowRoomPanel from "@/components/admin/dashboard/bilete/ShowRoomPanel";
import TicketsCreateForm from "@/components/admin/dashboard/bilete/TicketsCreateForm";
import {
	AdresaFacturare,
	BileteAchizitionate,
	LocSalaSpectacol,
	RataDeSchimbValutar,
	Spectacol,
	TipuriTabel,
} from "@/lib/types";
import { schemaCreareBiletSpectacol } from "@/lib/schemas";

export default function AdminTicketNew({
	spectacole,
	clienti,
	cursuriValutare,
}: {
	clienti: Client[];
	spectacole: Spectacol[];
	cursuriValutare: RataDeSchimbValutar[];
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const [generareFactura, setGenerareFactura] = useState(false);
	const [locuriAlese, setLocuriAlese] = useState<LocSalaSpectacol[]>([]);
	const [clientSelectat, setClientSelectat] = useState<Client | null>(
		clienti.length > 0 ? clienti[0] : null
	);
	const [
		cursValutarSelectat,
		setCursValutarSelectat,
	] = useState<RataDeSchimbValutar | null>(
		cursuriValutare.length > 0
			? cursuriValutare.filter((curs) => curs.moneda == "RON")[0]
			: null
	);
	const adreseFacturare = useCallback(
		() => clientSelectat?.adreseFacturare ?? [],
		[clientSelectat]
	);
	const adresaDefault: AdresaFacturare | null =
		adreseFacturare().length > 0 ? adreseFacturare()[0] : null;
	const adresaDefaultString =
		adresaDefault?.adresa +
		", " +
		adresaDefault?.oras +
		", " +
		adresaDefault?.tara;
	const [spectacolSelectat, setSpectacolSelectat] = useState<Spectacol | null>(
		spectacole.length > 0 ? spectacole[0] : null
	);
	const costTotalLocuriRON = useMemo(() => {
		return locuriAlese.reduce((prev, cur) => prev + cur.pretLoc, 0);
	}, [locuriAlese]);
	const form = useForm<z.infer<typeof schemaCreareBiletSpectacol>>({
		resolver: zodResolver(schemaCreareBiletSpectacol),
		defaultValues: {
			tipPlata: "CASH",
			pretVanzare: "0",
			codClient: clientSelectat != null ? clientSelectat.codClient : undefined,
			codSpectacol:
				spectacolSelectat != null ? spectacolSelectat.codSpectacol : undefined,
			codSalaSpectacol:
				spectacolSelectat != null
					? spectacolSelectat.codSalaSpectacol
					: undefined,
			codRataDeSchimbValutar:
				cursValutarSelectat != null
					? cursValutarSelectat.codRataValutar
					: undefined,
			genereazaFacturaFiscala: "false",
			adresaFacturare: generareFactura ? adresaDefaultString ?? "" : "null",
			email: generareFactura ? clientSelectat?.email ?? "" : "null",
			numeClient: generareFactura ? clientSelectat?.numeClient ?? "" : "null",
			prefix: generareFactura
				? clientSelectat?.telefon.substring(3) ?? ""
				: "null",
			telefon: generareFactura
				? clientSelectat?.telefon.substring(3, 0) ?? ""
				: "nullnull",
		},
	});
	async function onSubmit(values: z.infer<typeof schemaCreareBiletSpectacol>) {
		if (locuriAlese.length <= 0) {
			toast({
				variant: "destructive",
				title: "Înregistrare Vânzarea Biletelor",
				description: "Nu ai selectat nici un loc in sala de spectacol.",
			});
			return;
		}
		loadingScreen.setLoading(true);
		const otherValues = {
			locuriAlese: locuriAlese,
			numarLocuri: locuriAlese.length,
			pretTotal: costTotalLocuriRON,
		} as BileteAchizitionate;
		values.bileteDetalii = otherValues;
		const data = await insert(TipuriTabel.BILET, values);
		toast({
			description: data.message,
			title: "Înregistrare Vânzarea Biletelor",
			variant: data.ok ? "default" : "destructive",
		});
		if (data.ok) {
			router.push("../bilete?tab=ticketsAll");
			form.reset();
			router.refresh();
		}
		loadingScreen.setLoading(false);
	}
	return (
		<div className="flex flex-col md:flex-row min-h-full gap-4">
			<ShowRoomPanel
				toast={toast}
				locuriAlese={locuriAlese}
				setLocuriAlese={setLocuriAlese}
				spectacolSelectat={spectacolSelectat}
			/>
			<TicketsCreateForm
				form={form}
				onSubmit={onSubmit}
				clientSelectat={clientSelectat}
				clienti={clienti}
				setClientSelectat={setClientSelectat}
				cursValutarSelectat={cursValutarSelectat}
				cursuriValutare={cursuriValutare}
				setCursValutarSelectat={setCursValutarSelectat}
				generareFactura={generareFactura}
				setGenerareFactura={setGenerareFactura}
				locuriAlese={locuriAlese}
				setLocuriAlese={setLocuriAlese}
				setSpectacolSelectat={setSpectacolSelectat}
				spectacolSelectat={spectacolSelectat}
				spectacole={spectacole}
			/>
		</div>
	);
}