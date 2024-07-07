import { Address, PartialUser } from "@/types";
import NextAuth from "next-auth";
import {
	BillingAddress,
	CarFavorite,
	CarRating,
	HistoryRent,
	Invoice,
	Payment,
	Provider,
} from "./lib/tipuri";

declare module "next-auth" {
	type User = {
		codClient: number;
		numeClient: string;
		email: string;
		emailVerificat?: Date | null;
		emailVerificatSemnatura?: string | null;
		creatPe: Date;
		actualizatPe: Date;
		creatCuProvider?: string | null;
		dataNasterii: string;
		telefon: string;
		parola: string;
		parolaResetareSemnatura?: string | null;
		termeni: boolean;
		utlizatorAdmin: boolean;
		providerii?: Provider[] | null;
		adreseFacturare?: AdresaFacturare[] | null;
		bileteCumparate?: BiletSpectacol[] | null;
		platiiEfectuate?: Plata[] | null;
		bonuriFiscale?: BonFiscal[] | null;
		facturiiEmise?: FacturaFiscala[] | null;
	};
	type Client = {} & User;
	interface Session {
		firstTime: boolean;
		user: Client | PartialUser | undefined;
	}
	interface Profile {
		id: string;
		name?: string;
		email: string;
		picture?: any;
		given_name?: string;
		family_name?: string;
		email_verified?: boolean;
	}
}
