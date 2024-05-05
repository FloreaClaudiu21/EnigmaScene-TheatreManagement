"use server";
import { prisma } from "@/lib/prismaClient";
import {
	AssociatedAccountData,
	MailSendResponse,
	PartialClient,
	Provider,
} from "@/lib/types";
import { User } from "next-auth";
import { getClientByEmail } from "./AuthProvider";

export const fetchAccountProviders = async (client: User) => {
	const mainAccountsData = (await Promise.all(
		(client.providerii ?? []).map(async (v: Provider) => {
			const isMain = await isMainAccount(client, v);
			return {
				provider: v,
				isMain,
			} as AssociatedAccountData;
		})
	)) as AssociatedAccountData[];
	return mainAccountsData;
};

export const findAssociatedAccount = async (partialUser: PartialClient) => {
	// FIND MAIN ACCOUNT
	let mainFound = false;
	const main = await getClientByEmail(partialUser.email);
	if (
		main &&
		main?.creatCuProvider &&
		(await isMainAccount(main as User, partialUser))
	) {
		mainFound = true;
	}
	// FIND ASSOCIATED ACCOUNTS
	const providers = await prisma.provider.findMany({
		where: {
			numeProvider: partialUser.provider,
			providerEmail: partialUser.email,
		},
		include: {
			client: true,
		},
	});
	const clients = await Promise.all(
		providers.map(async (p: Provider) => {
			const main = await isMainAccount(p.client as User, { ...p } as Provider);
			return main ? null : p.client;
		})
	);
	const filteredUsers = clients.filter((client) => client !== null);
	if (mainFound) {
		return main;
	} else {
		if (filteredUsers.length <= 0) {
			return null;
		} else {
			return filteredUsers[0];
		}
	}
};

export const isMainAccount = async (
	client: User,
	p: Provider | PartialClient
) => {
	if (client.creatCuProvider) {
		const dataCreated = client.creatCuProvider.split("|");
		const provName = dataCreated[0];
		const provAccId = dataCreated[1];
		if (provName === p.numeProvider && provAccId === p.providerContCod) {
			return true;
		}
	}
	return false;
};

export const accountAlreadyExists = async (
	partial: PartialClient,
	bypass: boolean
) => {
	if (bypass) return false;
	const found = await getClientByEmail(partial.email);
	return found ? true : false;
};

export const isEmailAssociated = async (email: string) => {
	const list = await prisma.provider.findMany({
		where: {
			providerEmail: email,
		},
		include: {
			client: true,
		},
	});
	if (list.length > 0) {
		return true;
	} else {
		return false;
	}
};

export const isAlreadyAssociated = async (partialUser: PartialClient) => {
	const list = await prisma.provider.findMany({
		where: {
			numeProvider: partialUser.numeProvider,
			providerEmail: partialUser.email,
		},
	});
	if (list.length > 0) {
		return { found: true, email: list[0].asociatCu };
	}
	return {
		found: false,
	};
};

export const existsAccountProvider = async (
	email: string,
	partialUser: PartialClient
) => {
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: "Utilizatorul nu a fost găsit.",
			} as MailSendResponse;
		}
		const providers = client.providerii;
		const found = providers.filter(
			(p: Provider) =>
				p.providerContCod === partialUser.providerContCod &&
				p.numeProvider === partialUser.numeProvider
		);
		if (found.length > 0) {
			return {
				ok: false,
				status: 500,
				message: `Providerul de cont '${found[0].numeProvider}' există deja.`,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
		} as MailSendResponse;
	} catch (e) {
		console.log("Error Verficare Provider: " + e);
		return {
			ok: false,
			status: 500,
			message:
				"A apărut o eroare în timpul verificării existenței providerului de cont.",
		} as MailSendResponse;
	}
};

export const deleteMainAccountProvider = async (
	email: string,
	providerId: number
) => {
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: "Utilizatorul nu a fost găsit.",
			} as MailSendResponse;
		}
		if (client.parola == null || client.parola.length <= 1) {
			return {
				ok: false,
				status: 404,
				message:
					"Trebuie să setați o parolă pentru contul dvs. înainte de a elimina providerul principal.",
			} as MailSendResponse;
		}
		const prov = await prisma.provider.delete({
			where: {
				codProvider: providerId,
				codClient: client.codClient,
			},
		});
		if (!prov) {
			return {
				ok: false,
				status: 404,
				message: "Providerul nu a fost găsit.",
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: `Providerul de cont principal '${email}' a fost șters cu succes.`,
		} as MailSendResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			message:
				"A apărut o eroare în timpul ștergerii providerului principal de cont.",
		} as MailSendResponse;
	}
};

export const deleteAccountProvider = async (
	email: string,
	providerId: number
) => {
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: "Utilizatorul nu a fost găsit.",
			} as MailSendResponse;
		}
		const prov = await prisma.provider.delete({
			where: {
				codProvider: providerId,
				codClient: client.codClient,
			},
		});
		if (!prov) {
			return {
				ok: false,
				status: 404,
				message: "Providerul nu a fost găsit.",
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: `Providerul de cont '${email}' a fost șters cu succes.`,
		} as MailSendResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			message: "A apărut o eroare în timpul ștergerii providerului de cont.",
		} as MailSendResponse;
	}
};

export const createAccountProvider = async (
	email: string,
	partialUser: PartialClient,
	bypass: boolean
) => {
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: "Utilizatorul nu a fost găsit.",
			} as MailSendResponse;
		}
		const existsProvider = await existsAccountProvider(email, partialUser);
		if (!existsProvider.ok) {
			return existsProvider;
		}
		const alreadyExists = await accountAlreadyExists(partialUser, bypass);
		if (alreadyExists) {
			return {
				ok: false,
				status: 500,
				message: "Nu puteți asocia contul dvs. cu un altul care deja există.",
			};
		}
		const associated = await isAlreadyAssociated(partialUser);
		if (associated.found) {
			return {
				ok: false,
				status: 500,
				message: `Contul este deja asociat cu un alt email '${associated.email}'.`,
			};
		}
		await prisma.provider.create({
			data: {
				asociatCu: email,
				numeProvider: partialUser.numeProvider,
				providerContCod: partialUser.providerContCod,
				providerContNume: partialUser.numeClient,
				providerEmail: partialUser.email,
				codClient: client.codClient,
			},
		});
		return {
			ok: true,
			status: 200,
			message: `Contul dvs. a fost asociat cu succes cu emailul '${email}' și providerul '${partialUser.numeProvider}'.`,
		} as MailSendResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			message: "A apărut o eroare în timpul creării providerului de cont.",
		} as MailSendResponse;
	}
};
