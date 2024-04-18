import {
	Invoice,
	PartialClient,
	SelectedFilters,
	TableTypes,
	currencyArray,
} from "@/lib/types";
import { Table } from "@tanstack/react-table";
import { setCookie } from "cookies-next";
import { User } from "next-auth";
import { create } from "zustand";

type currencySet = {
	currency: string;
	setCurrency: (val: string) => void;
};
type LoadingScreen = {
	loading: boolean;
	setLoading: (val: boolean) => void;
};
type SelectedFiltersState = {
	filters: SelectedFilters;
	generalList: () => Map<string, FilterValue>;
	setFilters: (val: SelectedFilters) => void;
	clearFilters: () => SelectedFilters;
};
type generalModal = {
	visible: boolean;
	onToggle: () => void;
	setVisible: (val: boolean) => void;
};
type AddAddress = {
	userId: string;
	setIsAdminPanel: (val: string) => void;
} & generalModal;
type firstTimeModal = {
	user: PartialClient | undefined;
	setUser: (user: PartialClient | undefined) => void;
} & generalModal;
type resetPassModal = {
	user: string;
	setUser: (val: string) => void;
} & generalModal;
type deleteModal = {
	type: TableTypes;
	deleteId: string;
	setType: (type: TableTypes) => void;
	setDeleteId: (val: string) => void;
} & generalModal;
type AuthModel = {
	isLogged: boolean;
	user: User | undefined;
	setUser: (user: User | undefined) => void;
};
type DeleteAddressModal = {
	addressId: string | null;
	onToggle: (val: string | null) => void;
};
type InvoiceModal = {
	visible: boolean;
	invoice: Invoice | null;
	setVisible: (val: boolean) => void;
	setInvoice: (val: Invoice | null) => void;
};
type RaportModal = {
	visible: boolean;
	table: Table<any> | null;
	setVisible: (val: boolean) => void;
	setTable: (val: Table<any> | null) => void;
};
type ActiveLink = {
	active: string;
	setActive: (val: string) => void;
};
export const useAuth = create<AuthModel>((set) => ({
	user: undefined,
	isLogged: false,
	setUser: (user) =>
		set({ user, isLogged: user !== null && user !== undefined }),
}));
export const useLoginModal = create<generalModal>((set) => ({
	visible: false,
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
}));
export const useResetPassModal = create<resetPassModal>((set) => ({
	user: "",
	visible: false,
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setUser: (val: string) => set({ user: val }),
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
	userId: "",
	onToggle: () =>
		set((state: { visible: boolean }) => ({
			visible: !state.visible,
			userId: "",
		})),
	setVisible: (val: boolean) => set({ visible: val }),
	setIsAdminPanel: (val: string) => set({ userId: val }),
}));
export const useDeleteAddressModal = create<DeleteAddressModal>((set) => ({
	addressId: null,
	onToggle: (val: string | null) => set({ addressId: val }),
}));
export const useDeleteModal = create<deleteModal>((set) => ({
	visible: false,
	deleteId: "",
	type: TableTypes.CLIENTS,
	setDeleteId: (val: string) => set({ deleteId: val }),
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
	setType: (val: TableTypes) => set({ type: val }),
}));
export const useFirstTimeAccountModal = create<firstTimeModal>((set) => ({
	visible: false,
	user: undefined,
	setUser: (val: PartialClient | undefined) => set({ user: val }),
	onToggle: () =>
		set((state: { visible: boolean }) => ({ visible: !state.visible })),
	setVisible: (val: boolean) => set({ visible: val }),
}));
export const useCurrency = create<currencySet>((set) => ({
	currency: currencyArray[0][1],
	setCurrency: (val: string) => {
		set({ currency: val });
		setCookie("selectedCurrency", val);
	},
}));
export const useLoadingScreen = create<LoadingScreen>((set) => ({
	loading: false,
	setLoading: (val: boolean) => set({ loading: val }),
}));

export const useCarsRefresh = create<LoadingScreen>((set) => ({
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
	setInvoice: (val: Invoice | null) => set({ invoice: val }),
}));
export const useRaportModal = create<RaportModal>((set) => ({
	visible: false,
	setVisible: (val: boolean) => set({ visible: val }),
	table: null,
	setTable: (val: Table<any> | null) => set({ table: val }),
}));
type FilterValue = string | string[] | null | undefined;
export const useFiltersQuery = create<SelectedFiltersState>((set, get) => ({
	filters: {
		page: 1,
		models: [],
		specs: [],
		fuelTypes: [],
		fuelPolicy: [],
		categories: [],
		locationType: [],
		manufacturers: [],
		transmissions: [],
	},
	generalList: () => {
		const filters = get().filters;
		const mapEntries: [string, FilterValue][] = [
			["manufacturers", filters.manufacturers],
			["models", filters.models],
			["categories", filters.categories],
			["locationType", filters.locationType],
			["fuelPolicy", filters.fuelPolicy],
			["specs", filters.specs],
			["fuelTypes", filters.fuelTypes],
			["transmissions", filters.transmissions],
			["ratings", filters.ratings ?? undefined],
			["doors", filters.doors ?? undefined],
			["seats", filters.seats ?? undefined],
		];
		return new Map(mapEntries.filter(([, value]) => value !== undefined));
	},
	setFilters: (val: SelectedFilters) => set({ filters: val }),
	clearFilters: () => {
		let map = {
			page: 1,
			models: [],
			specs: [],
			fuelTypes: [],
			fuelPolicy: [],
			categories: [],
			locationType: [],
			manufacturers: [],
			transmissions: [],
		};
		set({ filters: map });
		return map as SelectedFilters;
	},
}));
