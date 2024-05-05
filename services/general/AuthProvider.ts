"use server";
import { cookies } from "next/headers";
import { Client } from "next-auth";
import crypto from "crypto";
import { prisma } from "@/lib/prismaClient";
import { z } from "zod";
import { deleteCookie, getCookie } from "cookies-next";
import { createAccountProvider, isEmailAssociated } from "./AccountProviders";
import {
	schemaActualizareClient,
	schemaCreareAdresaFacturareClient,
} from "@/lib/schemas";
import {
	AdresaFacturare,
	MailSendResponse,
	PartialClient,
	RegisterData,
} from "@/lib/types";

const algorithm = "aes-256-cbc";
const secretKey = process.env.AUTH_SECRET ?? "";

export const getAdminKey = async () => {
	return process.env.ADMIN_KEY;
};

export const getClientById = async (id: number) => {
	const foundClient = await prisma.client.findFirst({
		where: {
			codClient: id,
		},
		include: {
			providerii: true,
			adreseFacturare: true,
			bileteCumparate: true,
			bonuriFiscale: true,
			facturiiEmise: true,
			platiiEfectuate: true,
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
			providerii: true,
			adreseFacturare: true,
			bileteCumparate: true,
			bonuriFiscale: true,
			facturiiEmise: true,
			platiiEfectuate: true,
		},
	});
	return foundClient;
};

export const LoginWithProvider = async (email: string) => {
	const client = await getClientByEmail(email);
	if (!client) {
		throw Error(`Utilizatorul cu emailul '${email}' nu a fost găsit!`);
	}
	return client;
};

export const LoginWithCredentials = async (email: string, password: string) => {
	const client = await getClientByEmail(email);
	if (!client) {
		throw Error(`Utilizatorul cu emailul '${email}' nu a fost găsit!`);
	}
	if (client.parola == null || client.parola.length <= 0) {
		throw Error(`Contul asociat cu emailul '${email}' nu are o parolă.`);
	}
	const passCorrect = await verifyPassword(client.parola, password);
	if (passCorrect) {
		client.parola = "";
		return client as Client;
	} else {
		throw Error(`Parolă incorectă pentru utilizatorul '${email}'.`);
	}
};

export const deleteAccountClient = async (clientId: number) => {
	const client = await getClientById(clientId);
	if (!client) {
		return {
			ok: false,
			status: 404,
			message:
				"Utilizatorul nu a putut fi șters, încercați din nou mai târziu.",
		} as MailSendResponse;
	}
	await prisma.client.delete({
		where: {
			codClient: clientId,
		},
	});
	return {
		ok: true,
		status: 200,
		message: `Contul '${client.email}' a fost șters din baza de date.`,
	} as MailSendResponse;
};

export const updateDetailsClient = async (
	clientId: number,
	values: z.infer<typeof schemaActualizareClient>
) => {
	let encryptedPassword = "";
	if (values.parola && values.parola.trim().length > 0) {
		encryptedPassword = await encryptPassword(values.parola.trim());
	}
	const updated = await prisma.client.update({
		where: {
			codClient: clientId,
		},
		data: {
			email: values.email,
			numeClient: values.numeClient,
			parola: encryptedPassword,
			telefon: values.prefix + values.telefon,
			dataNasterii: values.dataNasterii,
		},
		include: {
			providerii: true,
		},
	});
	if (!updated) {
		return {
			ok: false,
			status: 404,
			message:
				"Utilizatorul nu a putut fi actualizat, încercați din nou mai târziu.",
		} as MailSendResponse;
	}
	return {
		ok: true,
		status: 200,
		client: updated as Client,
		message: `Detaliile utilizatorului pentru contul '${updated.email}' au fost actualizate!`,
	} as MailSendResponse;
};

export const registerWithCredentialsorProvider = async (
	data: RegisterData,
	sendFrom: string,
	partialClient?: PartialClient
) => {
	try {
		if (partialClient && partialClient.provider.length > 0) {
			const registerData = {
				...data,
				parola: "",
			};
			const clientFound = await getClientByEmail(registerData.email);
			if (clientFound) {
				return {
					message: `Utilizatorul cu emailul '${registerData.email}' deja există.`,
					status: 404,
					ok: false,
				} as MailSendResponse;
			}
			const associatonFound = await isEmailAssociated(registerData.email);
			if (associatonFound) {
				return {
					message: `Utilizatorul cu emailul '${registerData.email}' este asociat cu un alt cont.`,
					status: 404,
					ok: false,
				} as MailSendResponse;
			}
			const client = await prisma.client.create({
				data: {
					...registerData,
					telefon: registerData.prefix + registerData.telefon,
					emailVerificat: new Date(),
					creatCuProvider:
						partialClient.provider + "|" + partialClient.providerContCod,
				},
				include: {
					providerii: true,
				},
			});
			const providerCreate = await createAccountProvider(
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
						providerii: true,
					},
				});
				return {
					ok: false,
					message: providerCreate.message,
					status: providerCreate.status,
				} as MailSendResponse;
			}
			return {
				message: `Contul a fost creat cu succes pentru emailul '${client.email}' cu providerul '${partialClient.numeProvider}'.`,
				ok: true,
				status: 200,
				client: client,
			} as MailSendResponse;
		}
		const registerData = {
			...data,
			parola: await encryptPassword(data.parola),
		};
		const clientFound = await getClientByEmail(registerData.email);
		if (clientFound) {
			return {
				message: `Utilizatorul cu emailul '${registerData.email}' deja există.`,
				status: 404,
				ok: false,
			} as MailSendResponse;
		}
		const associatonFound = await isEmailAssociated(registerData.email);
		if (associatonFound) {
			return {
				message: `Utilizatorul cu emailul '${registerData.email}' este asociat cu un alt cont.`,
				status: 404,
				ok: false,
			} as MailSendResponse;
		}
		const client = await prisma.client.create({
			data: {
				...registerData,
				telefon: registerData.prefix + registerData.telefon,
			},
			include: {
				providerii: true,
			},
		});
		/*
		const res = await sendVerifyAccountEmail(lang, client.email, sendFrom);
		if (!res.ok) {
			return {
				ok: false,
				client: undefined,
				error: res.message,
				status: res.status,
			} as RegisterResponse;
		}
		*/
		return {
			message:
				"Contul a fost creat cu succes, verificați-vă emailul pentru a vă activa contul.",
			ok: true,
			status: 200,
			client: client,
		} as MailSendResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				message: e.toString(),
				status: 500,
				ok: false,
			} as MailSendResponse;
		} else {
			return {
				message: "A apărut o eroare necunoscută.",
				status: 500,
				ok: false,
			} as MailSendResponse;
		}
	}
};

export const resetPasswordClient = async (
	email: string,
	newPassword: string
) => {
	const client = await getClientByEmail(email);
	if (!client) {
		return {
			ok: false,
			status: 404,
			message: `Utilizatorul cu emailul '${email}' nu a fost găsit!`,
		} as MailSendResponse;
	}
	const encryptedPassword = await encryptPassword(newPassword);
	const updated = await prisma.client.update({
		where: {
			email: email,
		},
		data: {
			parola: encryptedPassword,
		},
	});
	if (!updated) {
		return {
			ok: false,
			status: 404,
			message: "A apărut o eroare necunoscută",
		} as MailSendResponse;
	}
	const emailSended = getCookie("resetMailSend", { cookies });
	if (emailSended && emailSended === email) {
		deleteCookie("resetMailSend", { cookies });
	}
	return {
		ok: true,
		status: 200,
		message: `Parola pentru contul '${email}' a fost actualizată cu succes!`,
	} as MailSendResponse;
};

export const addBillingAddress = async (
	id: number,
	values: z.infer<typeof schemaCreareAdresaFacturareClient>
) => {
	try {
		const address = await prisma.adresaFacturare.create({
			data: {
				codClient: id,
				tara: values.tara,
				adresa: values.adresa,
				oras: values.oras,
				codPostal: values.codPostal,
				observatii: values.observatii,
			},
		});
		return address as AdresaFacturare;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const deleteBillingAddress = async (id: number) => {
	try {
		const address = await prisma.adresaFacturare.delete({
			where: {
				codAdresa: id,
			},
		});
		return address as AdresaFacturare;
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
