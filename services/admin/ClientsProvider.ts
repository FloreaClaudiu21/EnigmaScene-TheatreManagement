"use server";
import { prisma } from "@/lib/prismaClient";
import { MailSendResponse, RegisterData, RegisterResponse } from "@/lib/types";
import { encryptPassword, getClientByEmail } from "../general/AuthProvider";
import {
	isEmailAssociated,
	makeDictionaryBE,
} from "../general/AccountProviders";
import { Locale } from "@/i18n.config";

export const createClient = async (lang: Locale, data: RegisterData) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const registerData = {
			...data,
			password: await encryptPassword(data.password),
			emailVerified: new Date(),
		};
		const clientFound = await getClientByEmail(registerData.email);
		if (clientFound) {
			return {
				error: dictionary.backend.createClient.clientWithEmailExists.replace(
					"{email}",
					clientFound.email
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		const associatonFound = await isEmailAssociated(registerData.email);
		if (associatonFound) {
			return {
				error: dictionary.backend.createClient.emailAssociatedWithAnotherAccount.replace(
					"{email}",
					registerData.email
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		const client = await prisma.client.create({
			data: registerData,
		});
		return {
			error: dictionary.backend.createClient.accountCreatedSuccess,
			ok: true,
			status: 200,
			client: client,
		} as RegisterResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.createClient.unknownError,
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		}
	}
};

export const updateClient = async (lang: Locale, data: RegisterData) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const registerData = {
			...data,
			password: await encryptPassword(data.password),
		};
		const clientFound = await getClientByEmail(registerData.email);
		if (!clientFound) {
			return {
				error: dictionary.backend.updateClient.clientWithEmailNotFound.replace(
					"{email}",
					data.email
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		const client = await prisma.client.update({
			where: {
				email: data.email,
			},
			data: {
				...registerData,
			},
		});
		return {
			error: dictionary.backend.updateClient.accountUpdatedSuccess,
			ok: true,
			status: 200,
			client: client,
		} as RegisterResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.updateClient.unknownError,
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		}
	}
};

export const deleteClient = async (lang: Locale, clientId: string) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const deletedResponse = await prisma.client.delete({
			where: {
				id: clientId,
			},
		});
		if (!deletedResponse) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteClient.clientNotFound,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.deleteClient.clientDeletedSuccess.replace(
				"{clientId}",
				clientId
			),
		} as MailSendResponse;
	} catch (e) {
		console.log(e);
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.deleteClient.unknownError,
		} as MailSendResponse;
	}
};
