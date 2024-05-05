import {
	BiletSpectacol,
	BonFiscal,
	FacturaFiscala,
	TipuriTabel,
} from "@/lib/types";
import { Table } from "@tanstack/react-table";
import { User } from "next-auth";
import { create } from "zustand";

type LoadingScreen = {
	loading: boolean;
	setLoading: (val: boolean) => void;
};
type generalModal = {
	visible: boolean;
	onToggle: () => void;
	setVisible: (val: boolean) => void;
};
type AddAddress = {
	userId: number;
	setIsAdminPanel: (val: number) => void;
} & generalModal;
type deleteModal = {
	type: TipuriTabel;
	deleteId: number;
	setType: (type: TipuriTabel) => void;
	setDeleteId: (val: number) => void;
} & generalModal;
type DeleteAddressModal = {
	addressId: number | null;
	onToggle: (val: number | null) => void;
};
type InvoiceModal = {
	visible: boolean;
	invoice: FacturaFiscala | null;
	setVisible: (val: boolean) => void;
	setInvoice: (val: FacturaFiscala | null) => void;
};
type TicketModal = {
	visible: boolean;
	ticket: BiletSpectacol | null;
	setVisible: (val: boolean) => void;
	setTicket: (val: BiletSpectacol | null) => void;
};
type ReceiptModal = {
	visible: boolean;
	receipt: BonFiscal | null;
	setVisible: (val: boolean) => void;
	setReceipt: (val: BonFiscal | null) => void;
};
export type RaportModal = {
	visible: boolean;
	raport: Table<any> | null;
	setVisible: (val: boolean) => void;
	setRaport: (val: Table<any> | null) => void;
};
type GeneralChartModal = {
	body: any;
	setBody: (body: any) => void;
	title: string;
	setTitle: (title: string) => void;
} & generalModal;
type ActiveLink = {
	active: string;
	setActive: (val: string) => void;
};
export const useLoginModal = create<generalModal>((set) => ({
	visible: false,
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
}));
export const useGeneralChartModal = create<GeneralChartModal>((set) => ({
	visible: false,
	body: null,
	title: "",
	setTitle: (val: string) => set({ title: val }),
	setBody: (body: any) => set({ body: body }),
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
}));
export const useShipModal = create<generalModal>((set) => ({
	visible: false,
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
}));
export const useActiveLink = create<ActiveLink>((set) => ({
	active: "",
	setActive: (val) => set({ active: val }),
}));
export const useAddAddressModal = create<AddAddress>((set) => ({
	visible: false,
	userId: 0,
	onToggle: () =>
		set((state: { visible: boolean }) => ({
			visible: !state.visible,
			userId: 0,
		})),
	setVisible: (val: boolean) => set({ visible: val }),
	setIsAdminPanel: (val: number) => set({ userId: val }),
}));
export const useDeleteAddressModal = create<DeleteAddressModal>((set) => ({
	addressId: null,
	onToggle: (val: number | null) => set({ addressId: val }),
}));
export const useDeleteModal = create<deleteModal>((set) => ({
	visible: false,
	deleteId: 0,
	type: TipuriTabel.CLIENT,
	setDeleteId: (val: number) => set({ deleteId: val }),
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
	setType: (val: TipuriTabel) => set({ type: val }),
}));
export const useLoadingScreen = create<LoadingScreen>((set) => ({
	loading: false,
	setLoading: (val: boolean) => set({ loading: val }),
}));
export const useAdminSidebar = create<generalModal>((set) => ({
	visible: false,
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
}));
export const useInvoiceModal = create<InvoiceModal>((set) => ({
	visible: false,
	setVisible: (val: boolean) => set({ visible: val }),
	invoice: null,
	setInvoice: (val: FacturaFiscala | null) => set({ invoice: val }),
}));
export const useTicketModal = create<TicketModal>((set) => ({
	visible: false,
	setVisible: (val: boolean) => set({ visible: val }),
	ticket: null,
	setTicket: (val: BiletSpectacol | null) => set({ ticket: val }),
}));
export const useRaportModal = create<RaportModal>((set) => ({
	visible: false,
	setVisible: (val: boolean) => set({ visible: val }),
	raport: null,
	setRaport: (val: Table<any> | null) => set({ raport: val }),
}));
export const useFiscalReceiptModal = create<ReceiptModal>((set) => ({
	visible: false,
	setVisible: (val: boolean) => set({ visible: val }),
	receipt: null,
	setReceipt: (val: BonFiscal | null) => set({ receipt: val }),
}));
