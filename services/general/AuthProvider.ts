"use server";
import { cookies } from "next/headers";
import { Client } from "next-auth";
import crypto from "crypto";
import { prisma } from "@/lib/prismaClient";
import { addAddressFormSchema, updateSchema } from "@/lib/schemas";
import { z } from "zod";
import { deleteCookie, getCookie } from "cookies-next";
import { sendVerifyAccountEmail } from "./EmailProvider";
import {
	createAccountProvider,
	isEmailAssociated,
	makeDictionaryBE,
} from "./AccountProviders";
import {
	BillingAddress,
	PartialClient,
	RegisterData,
	RegisterResponse,
	ResetPasswordResponse,
} from "@/lib/types";
import { Locale } from "@/i18n.config";

const algorithm = "aes-256-cbc";
const secretKey = process.env.AUTH_SECRET ?? "";

export const getAdminKey = async () => {
	return process.env.ADMIN_KEY;
};

export const getClientById = async (id: string) => {
	const foundClient = await prisma.client.findFirst({
		where: {
			id,
		},
		include: {
			providers: true,
			billingAddresses: true,
			favorites: true,
			invoices: true,
			payments: true,
			tickesBuyed: true,
		},
	});
	return foundClient;
};

export const getClientByEmail = async (email: string) => {
	const foundClient = await prisma.client.findFirst({
		where: {
			email,
		},
		include: {
			providers: true,
			billingAddresses: true,
			favorites: true,
			invoices: true,
			payments: true,
			tickesBuyed: true,
		},
	});
	return foundClient;
};

export const LoginWithProvider = async (lang: Locale, email: string) => {
	const { dictionary } = await makeDictionaryBE(lang);
	const Client = await getClientByEmail(email);
	if (!Client) {
		throw Error(dictionary.backend.loginWithProvider.notFound);
	}
	return Client;
};

export const LoginWithCredentials = async (
	lang: Locale,
	email: string,
	password: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	const Client = await getClientByEmail(email);
	if (!Client) {
		throw Error(dictionary.backend.loginWithCredentials.notFound);
	}
	if (Client.password == null || Client.password.length <= 0) {
		throw Error(dictionary.backend.loginWithCredentials.noPassword);
	}
	const passCorrect = await verifyPassword(Client.password, password);
	if (passCorrect) {
		Client.password = "";
		return Client as Client;
	} else {
		throw Error(dictionary.backend.loginWithCredentials.invalidPassword);
	}
};

export const deleteAccountClient = async (lang: Locale, clientId: string) => {
	const { dictionary } = await makeDictionaryBE(lang);
	const client = await getClientById(clientId);
	if (!client) {
		return {
			ok: false,
			status: 404,
			error: dictionary.backend.deleteAccountClient.notFound,
		} as ResetPasswordResponse;
	}
	await prisma.client.delete({
		where: {
			id: client.id,
		},
	});
	return {
		ok: true,
		status: 200,
		error: dictionary.backend.deleteAccountClient.success.replace(
			"{email}",
			client.email
		),
	} as ResetPasswordResponse;
};

export const updateDetailsClient = async (
	lang: Locale,
	clientId: string,
	values: z.infer<typeof updateSchema>
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	let encryptedPassword = "";
	if (values.password && values.password.trim().length > 0) {
		encryptedPassword = await encryptPassword(values.password.trim());
	}
	const updated = await prisma.client.update({
		where: {
			id: clientId,
		},
		data: {
			email: values.email,
			lastName: values.lastName,
			firstName: values.firstName,
			password: encryptedPassword,
			phone: values.prefix + values.phone,
			birthDate: values.birthDate,
		},
		include: {
			providers: true,
		},
	});
	if (!updated) {
		return {
			ok: false,
			status: 404,
			error: dictionary.backend.updateDetailsClient.notFound,
		} as ResetPasswordResponse;
	}
	return {
		ok: true,
		status: 200,
		client: updated as Client,
		error: dictionary.backend.updateDetailsClient.success.replace(
			"{email}",
			values.email
		),
	} as ResetPasswordResponse;
};

export const registerWithCredentialsorProvider = async (
	data: RegisterData,
	lang: Locale,
	sendFrom: string,
	partialClient?: PartialClient
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		if (partialClient && partialClient.provider.length > 0) {
			const registerData = {
				...data,
				password: "",
			};
			const ClientFound = await getClientByEmail(registerData.email);
			if (ClientFound) {
				return {
					error: dictionary.backend.registerWithCredentialsorProvider.emailExists.replace(
						"{email}",
						registerData.email
					),
					status: 404,
					ok: false,
				} as RegisterResponse;
			}
			const associatonFound = await isEmailAssociated(registerData.email);
			if (associatonFound) {
				return {
					error: dictionary.backend.registerWithCredentialsorProvider.associatedEmail.replace(
						"{email}",
						registerData.email
					),
					status: 404,
					ok: false,
				} as RegisterResponse;
			}
			const client = await prisma.client.create({
				data: {
					...registerData,
					emailVerified: new Date(),
					createdWithProvider:
						partialClient.provider + "|" + partialClient.providerAccountId,
				},
				include: {
					providers: true,
					billingAddresses: true,
					favorites: true,
					invoices: true,
					payments: true,
					tickesBuyed: true,
				},
			});
			const providerCreate = await createAccountProvider(
				lang,
				client.email,
				partialClient,
				true
			);
			if (!providerCreate.ok) {
				await prisma.client.delete({
					where: {
						email: client.email,
					},
					include: {
						providers: true,
						billingAddresses: true,
						favorites: true,
						invoices: true,
						payments: true,
						tickesBuyed: true,
					},
				});
				return {
					ok: false,
					error: providerCreate.message,
					status: providerCreate.status,
				} as RegisterResponse;
			}
			return {
				error: dictionary.backend.registerWithCredentialsorProvider.success
					.replace("{email}", client.email)
					.replace("{provider}", partialClient.provider),
				ok: true,
				status: 200,
				client: client,
			} as RegisterResponse;
		}
		const registerData = {
			...data,
			password: await encryptPassword(data.password),
		};
		const ClientFound = await getClientByEmail(registerData.email);
		if (ClientFound) {
			return {
				error: dictionary.backend.registerWithCredentialsorProvider.emailExists.replace(
					"{email}",
					registerData.email
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		const associatonFound = await isEmailAssociated(registerData.email);
		if (associatonFound) {
			return {
				error: dictionary.backend.registerWithCredentialsorProvider.associatedEmail.replace(
					"{email}",
					registerData.email
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		const client = await prisma.client.create({
			data: registerData,
			include: {
				providers: true,
				billingAddresses: true,
				favorites: true,
				invoices: true,
				payments: true,
				tickesBuyed: true,
			},
		});
		const res = await sendVerifyAccountEmail(lang, client.email, sendFrom);
		if (!res.ok) {
			return {
				ok: false,
				client: undefined,
				error: res.message,
				status: res.status,
			} as RegisterResponse;
		}
		return {
			error: dictionary.backend.registerWithCredentialsorProvider.verifyEmail,
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
				error:
					dictionary.backend.registerWithCredentialsorProvider.unknownError,
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		}
	}
};

export const resetPasswordClient = async (
	lang: Locale,
	email: string,
	newPassword: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	const client = await getClientByEmail(email);
	if (!client) {
		return {
			ok: false,
			status: 404,
			error: dictionary.backend.resetPasswordClient.notFound.replace(
				"{email}",
				email
			),
		} as ResetPasswordResponse;
	}
	const encryptedPassword = await encryptPassword(newPassword);
	const updated = await prisma.client.update({
		where: {
			email: email,
		},
		data: {
			password: encryptedPassword,
		},
		include: {
			providers: true,
			billingAddresses: true,
			favorites: true,
			invoices: true,
			payments: true,
			tickesBuyed: true,
		},
	});
	if (!updated) {
		return {
			ok: false,
			status: 404,
			error: dictionary.backend.resetPasswordClient.updateError,
		} as ResetPasswordResponse;
	}
	const emailSended = getCookie("resetMailSend", { cookies });
	if (emailSended && emailSended === email) {
		deleteCookie("resetMailSend", { cookies });
	}
	return {
		ok: true,
		status: 200,
		client: updated as Client,
		error: dictionary.backend.resetPasswordClient.success.replace(
			"{email}",
			email
		),
	} as ResetPasswordResponse;
};

export const addBillingAddress = async (
	id: string,
	values: z.infer<typeof addAddressFormSchema>
) => {
	try {
		const address = await prisma.billingAddress.create({
			data: {
				clientId: id,
				city: values.city,
				address: values.address,
				country: values.country,
				zipCode: values.zipCode,
				observations: values.observations,
			},
		});
		return address as BillingAddress;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const deleteBillingAddress = async (id: string) => {
	try {
		const address = await prisma.billingAddress.delete({
			where: {
				id: id,
			},
		});
		return address as BillingAddress;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const encryptPassword = (password: string) => {
	const cipher = crypto.createCipher(algorithm, secretKey);
	let encryptedPassword = cipher.update(password, "utf-8", "hex");
	encryptedPassword += cipher.final("hex");
	return encryptedPassword;
};

export const decryptPassword = (encryptedPassword: string) => {
	if (encryptPassword == null || encryptedPassword.length <= 0) return "";
	const decipher = crypto.createDecipher(algorithm, secretKey);
	let decryptedPassword = decipher.update(encryptedPassword, "hex", "utf-8");
	decryptedPassword += decipher.final("utf-8");
	return decryptedPassword;
};

const verifyPassword = (encryptedPassword: string, password: string) => {
	const decPass = decryptPassword(encryptedPassword);
	return decPass === password;
};
