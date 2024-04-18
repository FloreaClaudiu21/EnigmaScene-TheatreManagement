"use server";
import { prisma } from "@/lib/prismaClient";
import {
	AssociatedAccountData,
	LanguageData,
	MailSendResponse,
	PartialClient,
	Provider,
} from "@/lib/types";
import { User } from "next-auth";
import { generateDictionary, getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";
import { getClientByEmail } from "./AuthProvider";

export const makeDictionaryBE = async (lang: Locale) => {
	const dict = await getDictionary(lang);
	const languageData = {
		dictionary: dict,
		language: lang,
	} as LanguageData;
	return languageData;
};

export const makeDictionaryClient = async (lang: any) => {
	const dict = await generateDictionary(lang);
	return dict;
};

export const fetchAccountProviders = async (client: User) => {
	const mainAccountsData = (await Promise.all(
		(client.providers ?? []).map(async (v: Provider) => {
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
		main?.createdWithProvider &&
		(await isMainAccount(main as User, partialUser))
	) {
		mainFound = true;
	}
	// FIND ASSOCIATED ACCOUNTS
	const providers = await prisma.provider.findMany({
		where: {
			name: partialUser.name,
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
	if (client.createdWithProvider) {
		const dataCreated = client.createdWithProvider.split("|");
		const provName = dataCreated[0];
		const provAccId = dataCreated[1];
		if (provName === p.name && provAccId === p.providerAccountId) {
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
			name: partialUser.name,
			providerEmail: partialUser.email,
		},
	});
	if (list.length > 0) {
		return { found: true, email: list[0].linkedWith };
	}
	return {
		found: false,
	};
};

export const existsAccountProvider = async (
	lang: Locale,
	email: string,
	partialUser: PartialClient
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.existsAccountProvider.notFound,
			} as MailSendResponse;
		}
		const providers = client.providers;
		const found = providers.filter(
			(p: Provider) =>
				p.providerAccountId === partialUser.providerAccountId &&
				p.name === partialUser.provider
		);
		if (found.length > 0) {
			return {
				ok: false,
				status: 500,
				message: dictionary.backend.existsAccountProvider.providerExists,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
		} as MailSendResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.existsAccountProvider.error,
		} as MailSendResponse;
	}
};

export const deleteMainAccountProvider = async (
	lang: Locale,
	email: string,
	providerId: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteMainAccountProvider.notFound,
			} as MailSendResponse;
		}
		if (client.password == null || client.password.length <= 1) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteMainAccountProvider.noPassword,
			} as MailSendResponse;
		}
		const prov = await prisma.provider.delete({
			where: {
				id: providerId,
				clientId: client.id,
			},
		});
		if (!prov) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteMainAccountProvider.providerNotFound,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.deleteMainAccountProvider.success.replace(
				"{providerEmail}",
				email
			),
		} as MailSendResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.deleteMainAccountProvider.error,
		} as MailSendResponse;
	}
};

export const deleteAccountProvider = async (
	lang: Locale,
	email: string,
	providerId: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteAccountProvider.notFound,
			} as MailSendResponse;
		}
		const prov = await prisma.provider.delete({
			where: {
				id: providerId,
				clientId: client.id,
			},
		});
		if (!prov) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteAccountProvider.providerNotFound,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.deleteAccountProvider.success.replace(
				"{providerEmail}",
				email
			),
		} as MailSendResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.deleteAccountProvider.error,
		} as MailSendResponse;
	}
};

export const createAccountProvider = async (
	lang: Locale,
	email: string,
	partialUser: PartialClient,
	bypass: boolean
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const client = await getClientByEmail(email);
		if (!client) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteAccountProvider.notFound,
			} as MailSendResponse;
		}
		const existsProvider = await existsAccountProvider(
			lang,
			email,
			partialUser
		);
		if (!existsProvider.ok) {
			return existsProvider;
		}
		const alreadyExists = await accountAlreadyExists(partialUser, bypass);
		if (alreadyExists) {
			return {
				ok: false,
				status: 500,
				message: dictionary.backend.createAccountProvider.existsAccount,
			};
		}
		const associated = await isAlreadyAssociated(partialUser);
		if (associated.found) {
			return {
				ok: false,
				status: 500,
				message: dictionary.backend.createAccountProvider.alreadyAssociated.replace(
					"{existingEmail}",
					associated.email
				),
			};
		}
		await prisma.provider.create({
			data: {
				linkedWith: email,
				name: partialUser.provider,
				providerAccountId: partialUser.providerAccountId,
				providerEmail: partialUser.email,
				providerFirstName: partialUser.firstName,
				providerLastName: partialUser.lastName,
				clientId: client.id,
			},
		});
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.createAccountProvider.success
				.replace("{email}", email)
				.replace("{provider}", partialUser.provider),
		} as MailSendResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.createAccountProvider.error,
		} as MailSendResponse;
	}
};
