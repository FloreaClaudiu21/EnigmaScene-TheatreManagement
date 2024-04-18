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
} from "./lib/types";

declare module "next-auth" {
	type User = {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		emailVerified?: Date | null;
		emailVerifySignature: String | null;
		createdAt: Date;
		updatedAt: Date;
		password: string;
		createdWithProvider: string | null;
		birthDate: string;
		profileImage?: String | null;
		phone: string;
		adminUser: boolean;
		providers?: Provider[] | null;
		billingAddresses?: BillingAddress[] | null;
		favorites?: ShowFavorite[] | null;
		ticketsBuyed?: TicketSold[] | null;
		payments?: Payment[] | null;
		invoices?: Invoice[] | null;
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
