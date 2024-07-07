import { NextAuthOptions, User } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";
import {
	autentificareCuCredentiale,
	autentificareCuProvider,
	creazaProviderCont,
	gasesteContAsociat,
} from "@/services/auth/autentificare";
import { ParametriFurnizorAutentificare, PartialClient } from "@/lib/tipuri";
import { obtineClientDupaEmail } from "@/services/backend/client/obtineClientDupaEmail";

export const AuthOption: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
		LinkedInProvider({
			clientId: process.env.LINKEDIN_ID ?? "",
			clientSecret: process.env.LINKEDIN_SECRET ?? "",
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					type: "text",
				},
				provider: { type: "text" },
				password: { type: "password" },
			},
			async authorize(credentials, req) {
				try {
					if (credentials?.provider) {
						if (!credentials?.email) {
							throw Error("You must specify the email of the account!");
						}
						const data = await autentificareCuProvider(credentials.email);
						return data as User;
					} else {
						if (!credentials?.email || !credentials?.password) {
							throw Error(
								"You must specify the email and password of the account!"
							);
						}
						const data = await autentificareCuCredentiale(
							credentials.email,
							credentials.password
						);
						return data as User;
					}
				} catch (e) {
					console.log(e);
					if (e instanceof Error) {
						throw Error(e.message);
					} else {
						throw Error("An unknown error occurred");
					}
				}
			},
		}),
	],
	pages: {
		signIn: "/",
	},
	callbacks: {
		jwt: async ({ token, account, profile, user, session, trigger }) => {
			try {
				if (trigger == "update" && session.user) {
					token.user = session.user;
					return token;
				}
				if (user) {
					if (
						account &&
						(account.provider === "google" || account.provider === "linkedin")
					) {
						const {
							access_token: accessToken,
							providerAccountId: provAccountId,
						} = account;
						if (!accessToken || !provAccountId) {
							throw new Error("Login failed, no tokens");
						}
						const partialClient = {
							codPartialClient: profile?.id,
							email: profile?.email,
							provider: account.provider,
							numeClient:
								profile?.family_name ?? profile?.name
									? profile.name?.split(" ")[0]
									: "" + " " + profile?.given_name ?? profile?.name
									? profile?.name?.split(" ")[1]
									: "",
							providerContCod: account.providerAccountId,
							numeProvider: account.provider,
						} as PartialClient;
						const res = await gasesteContAsociat(partialClient);
						if (res == null) {
							token.user = partialClient;
							token.firstTime = true;
						} else {
							token.firstTime = false;
							token.user = res as User;
						}
					} else {
						const userFound = await obtineClientDupaEmail(user.email ?? "");
						if (userFound) {
							token.user = userFound;
						} else {
							token.user = null;
						}
					}
				}
			} catch (error) {
				console.log(error);
				throw error;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				if (token.firstTime) {
					session.user = token.user;
				} else {
					const user = token.user as User | undefined;
					const userFound = await obtineClientDupaEmail(user?.email ?? "");
					if (userFound) {
						session.user = userFound;
					} else {
						session.user = undefined;
					}
				}
			} else {
				session.user = undefined;
			}
			session.firstTime = token.firstTime as boolean;
			return session;
		},
		async signIn({ account, profile }) {
			const signInParams = getCookie("signInProviderLinkParams", { cookies });
			if (signInParams) {
				const { linkCu, url } = JSON.parse(
					signInParams
				) as ParametriFurnizorAutentificare;
				if (profile && account) {
					const partialClient = {
						codPartialClient: profile.id,
						email: profile?.email,
						provider: account.provider,
						providerContCod: account.providerAccountId,
						numeProvider: account.provider,
						numeClient:
							profile?.family_name ?? profile?.name
								? profile.name?.split(" ")[0]
								: "" + " " + profile?.given_name ?? profile?.name
								? profile?.name?.split(" ")[1]
								: "",
					} as PartialClient;
					const response = await creazaProviderCont(
						linkCu,
						partialClient,
						false
					);
					setCookie(
						"signInProviderLinkParams",
						JSON.stringify({
							linkCu,
							url,
							response,
						}),
						{
							cookies,
						}
					);
					return false;
				} else {
					deleteCookie("signInProviderLinkParams", { cookies });
				}
				return true;
			}
			if (account?.provider === "google") {
				return profile?.email_verified ?? false;
			}
			return true;
		},
	},
	secret: process.env.AUTH_SECRET,
};
