import { BodyContents } from "@/components/admin/dashboard/stats/GeneralStatCard";
import {
	BiletSpectacol,
	BonFiscal,
	FacturaFiscala,
	Spectacol,
	TipuriTabel,
} from "@/lib/tipuri";
import { Table } from "@tanstack/react-table";
import { create } from "zustand";

type EcranIncarcare = {
	incarcare: boolean;
	setIncarcare: (val: boolean) => void;
};
type ModalGeneral = {
	vizibil: boolean;
	onToggle: () => void;
	setVizibil: (val: boolean) => void;
};
type ModalAdaugaAdresa = {
	codUtilizator: number;
	setEstePanouAdmin: (val: number) => void;
} & ModalGeneral;
type ModalStergere = {
	tip: TipuriTabel;
	codStergere: number;
	setTip: (tip: TipuriTabel) => void;
	setCodStergere: (val: number) => void;
} & ModalGeneral;
type ModalStergereAdresa = {
	codAdresa: number | null;
	onToggle: (val: number | null) => void;
};
type ModalFactura = {
	vizibil: boolean;
	factura: FacturaFiscala | null;
	setVizibil: (val: boolean) => void;
	setFactura: (val: FacturaFiscala | null) => void;
};
type ModalBilet = {
	vizibil: boolean;
	bilet: BiletSpectacol | null;
	setVizibil: (val: boolean) => void;
	setBilet: (val: BiletSpectacol | null) => void;
};
type ModalImagineSpectacol = {
	vizibil: boolean;
	spectacol: Spectacol | null;
	setVizibil: (val: boolean) => void;
	setSpectacol: (val: Spectacol | null) => void;
};
type ModalBonFiscal = {
	vizibil: boolean;
	bon: BonFiscal | null;
	setVizibil: (val: boolean) => void;
	setBon: (val: BonFiscal | null) => void;
};
export type ModalRaport = {
	vizibil: boolean;
	raport: Table<any> | null;
	setVizibil: (val: boolean) => void;
	setRaport: (val: Table<any> | null) => void;
};
type ModalGraficGeneral = {
	continut: BodyContents[];
	setContinut: (body: BodyContents[]) => void;
	titlu: string;
	setTitlu: (title: string) => void;
} & ModalGeneral;
type LinkActiv = {
	activ: string;
	setActiv: (val: string) => void;
};
export const formularLogare = create<ModalGeneral>((set) => ({
	vizibil: false,
	onToggle: () =>
		set((state: { vizibil: boolean }) => ({ vizibil: !state.vizibil })),
	setVizibil: (val: boolean) => set({ vizibil: val }),
}));
export const formularGrafic = create<ModalGraficGeneral>((set) => ({
	vizibil: false,
	continut: [],
	titlu: "",
	setTitlu: (val: string) => set({ titlu: val }),
	setContinut: (body: BodyContents[]) => set({ continut: body }),
	onToggle: () =>
		set((state: { vizibil: boolean }) => ({ vizibil: !state.vizibil })),
	setVizibil: (val: boolean) => set({ vizibil: val }),
}));
export const formularAdresa = create<ModalGeneral>((set) => ({
	vizibil: false,
	onToggle: () =>
		set((state: { vizibil: boolean }) => ({ vizibil: !state.vizibil })),
	setVizibil: (val: boolean) => set({ vizibil: val }),
}));
export const LinkActiv = create<LinkActiv>((set) => ({
	activ: "",
	setActiv: (val) => set({ activ: val }),
}));
export const formularStergereAdresa = create<ModalStergereAdresa>((set) => ({
	codAdresa: null,
	onToggle: (val: number | null) => set({ codAdresa: val }),
}));
export const formularCreareAdresa = create<ModalAdaugaAdresa>((set) => ({
	vizibil: false,
	codUtilizator: 0,
	onToggle: () =>
		set((state: { vizibil: boolean }) => ({
			vizibil: !state.vizibil,
			codUtilizator: 0,
		})),
	setVizibil: (val: boolean) => set({ vizibil: val }),
	setEstePanouAdmin: (val: number) => set({ codUtilizator: val }),
}));
export const formularStergereInregistrari = create<ModalStergere>((set) => ({
	vizibil: false,
	codStergere: 0,
	tip: TipuriTabel.CLIENT,
	setCodStergere: (val: number) => set({ codStergere: val }),
	onToggle: () =>
		set((state: { vizibil: boolean }) => ({ vizibil: !state.vizibil })),
	setVizibil: (val: boolean) => set({ vizibil: val }),
	setTip: (val: TipuriTabel) => set({ tip: val }),
}));
export const ecranIncarcare = create<EcranIncarcare>((set) => ({
	incarcare: false,
	setIncarcare: (val: boolean) => set({ incarcare: val }),
}));
export const adminParteaStanga = create<ModalGeneral>((set) => ({
	vizibil: false,
	onToggle: () =>
		set((state: { vizibil: boolean }) => ({ vizibil: !state.vizibil })),
	setVizibil: (val: boolean) => set({ vizibil: val }),
}));
export const formularFactura = create<ModalFactura>((set) => ({
	vizibil: false,
	setVizibil: (val: boolean) => set({ vizibil: val }),
	factura: null,
	setFactura: (val: FacturaFiscala | null) => set({ factura: val }),
}));
export const formularBilet = create<ModalBilet>((set) => ({
	vizibil: false,
	setVizibil: (val: boolean) => set({ vizibil: val }),
	bilet: null,
	setBilet: (val: BiletSpectacol | null) => set({ bilet: val }),
}));
export const formularRaport = create<ModalRaport>((set) => ({
	vizibil: false,
	setVizibil: (val: boolean) => set({ vizibil: val }),
	raport: null,
	setRaport: (val: Table<any> | null) => set({ raport: val }),
}));
export const formularBonFiscal = create<ModalBonFiscal>((set) => ({
	vizibil: false,
	setVizibil: (val: boolean) => set({ vizibil: val }),
	bon: null,
	setBon: (val: BonFiscal | null) => set({ bon: val }),
}));
export const formularImagineSpectacol = create<ModalImagineSpectacol>(
	(set) => ({
		vizibil: false,
		onToggle: () =>
			set((state: { vizibil: boolean }) => ({ vizibil: !state.vizibil })),
		setVizibil: (val: boolean) => set({ vizibil: val }),
		spectacol: null,
		setSpectacol: (val: Spectacol | null) => set({ spectacol: val }),
	})
);
