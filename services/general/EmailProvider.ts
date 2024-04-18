"use server";
import { cookies } from "next/headers";
import { render } from "@react-email/components";
import * as node from "nodemailer";
import Cryptr from "cryptr";
import ForgotPasswordEmail from "../emails/ResetPasswordEmail";
import { setCookie, hasCookie, getCookie } from "cookies-next";
import { prisma } from "@/lib/prismaClient";
import VerifiyAccountEmail from "../emails/VerifyAccountEmail";
import {
	DecryptSignatureResponse,
	MailSendResponse,
	verifyPasswordResetResponse,
} from "@/lib/types";
import { messageSchema } from "@/lib/schemas";
import { z } from "zod";
import GuestMessageEmail from "../emails/GuestMessageEmail";
import { Locale } from "@/i18n.config";
import { makeDictionaryBE } from "./AccountProviders";
import { Client } from "next-auth";

const transporter = node.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: true,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

export const encryptSignature = async (
	foundUser: Client,
	sendFromLink: string,
	expirationTime: number
) => {
	const crypt = new Cryptr(process.env.AUTH_SECRET ?? "");
	const currentTimestamp = new Date().getTime();
	const expiration = currentTimestamp + expirationTime;
	const encryptedData = crypt.encrypt(
		"email:" +
			foundUser.email +
			"|" +
			"expireAt:" +
			expiration +
			"|sendFromURL:" +
			sendFromLink
	);
	return encryptedData;
};

export const decryptSignature = async (signature: string) => {
	const crypter = new Cryptr(process.env.AUTH_SECRET ?? "");
	const data = crypter.decrypt(signature);
	if (
		!data.includes("|") ||
		!data.includes("email:") ||
		!data.includes("expireAt:") ||
		!data.includes("sendFromURL:")
	) {
		return {
			ok: false,
			status: 500,
		} as DecryptSignatureResponse;
	}
	const variables = data.split("|");
	const email = variables[0].split("email:")[1];
	const expiresAt = variables[1].split("expireAt:")[1];
	const sendFromURL = variables[2].split("sendFromURL:")[1];
	return {
		ok: true,
		status: 200,
		data: {
			email,
			expiresAt,
			sendFromURL,
		},
	} as DecryptSignatureResponse;
};

export const verifyAccountIsActivated = async (lang: Locale, email: string) => {
	const { dictionary } = await makeDictionaryBE(lang);
	const foundUser = await prisma.client.findFirst({
		where: {
			email,
		},
	});
	if (!foundUser) {
		return {
			ok: false,
			status: 404,
			message: dictionary.backend.verifyAccountIsActivated.userNotFound,
		} as verifyPasswordResetResponse;
	}
	if (
		foundUser.emailVerified != null &&
		foundUser.emailVerifySignature == null
	) {
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.verifyAccountIsActivated.accountActivated,
		} as verifyPasswordResetResponse;
	}
	if (
		foundUser.emailVerified === null &&
		foundUser.emailVerifySignature !== null
	) {
		const decrypt = await decryptSignature(foundUser.emailVerifySignature);
		if (!decrypt.ok) {
			return {
				ok: false,
				status: 500,
				redirectURL: null,
				message: dictionary.backend.verifyAccountIsActivated.invalidSignature,
			} as verifyPasswordResetResponse;
		}
		const { expiresAt } = decrypt.data;
		const currentTimestamp = new Date().getTime();
		const expirationDate = new Date(parseInt(expiresAt));
		const hasExpired = expirationDate.getTime() < currentTimestamp;
		if (hasExpired) {
			await prisma.client.delete({
				where: {
					email,
				},
			});
			return {
				ok: false,
				status: 500,
				redirectURL: null,
				message:
					dictionary.backend.verifyAccountIsActivated.accountActivationExpired,
			} as verifyPasswordResetResponse;
		} else {
			return {
				ok: false,
				status: 404,
				redirectURL: null,
				message:
					dictionary.backend.verifyAccountIsActivated.accountNotActivated,
			} as verifyPasswordResetResponse;
		}
	}
	return {
		ok: false,
		status: 500,
		message: dictionary.backend.verifyAccountIsActivated.unknownError,
	} as verifyPasswordResetResponse;
};

export const sendEmailContact = async (
	lang: Locale,
	values: z.infer<typeof messageSchema>
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	const html = render(GuestMessageEmail({ lang, values }));
	return await sendEmail(
		lang,
		"floreaclaudiu128@gmail.com",
		html,
		dictionary.backend.sendEmailContact.subject,
		dictionary.backend.sendEmailContact.successMessage
	);
};

export const verifyAccountActivationSignature = async (
	lang: Locale,
	signature: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const decrypt = await decryptSignature(signature);
		if (!decrypt.ok) {
			return {
				ok: false,
				status: 500,
				redirectURL: null,
				message:
					dictionary.backend.verifyAccountActivationSignature.invalidSignature,
			} as verifyPasswordResetResponse;
		}
		const { email, sendFromURL, expiresAt } = decrypt.data;
		const foundUser = await prisma.client.findFirst({
			where: {
				email,
				emailVerifySignature: signature,
			},
		});
		if (!foundUser) {
			return {
				ok: false,
				status: 404,
				redirectURL: sendFromURL,
				message:
					dictionary.backend.verifyAccountActivationSignature.userNotFound,
			} as verifyPasswordResetResponse;
		}
		const expirationDate = new Date(parseInt(expiresAt));
		const currentTimestamp = new Date().getTime();
		const hasExpired = expirationDate.getTime() < currentTimestamp;
		if (hasExpired) {
			await prisma.client.delete({
				where: {
					email,
				},
			});
			return {
				ok: false,
				status: 404,
				redirectURL: sendFromURL,
				message: dictionary.backend.accountActivationExpired,
			} as verifyPasswordResetResponse;
		}
		await prisma.client.update({
			where: {
				email,
			},
			data: {
				emailVerified: new Date(),
				emailVerifySignature: null,
			},
		});
		return {
			ok: true,
			status: 200,
			user: email,
			redirectURL: sendFromURL,
			message:
				dictionary.backend.verifyAccountActivationSignature.accountActivated,
		} as verifyPasswordResetResponse;
	} catch (e) {
		return {
			ok: false,
			status: 500,
			redirectURL: null,
			message:
				dictionary.backend.verifyAccountActivationSignature.invalidSignature,
		} as verifyPasswordResetResponse;
	}
};

export const verifyPasswordResetSignature = async (
	lang: Locale,
	signature: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const decrypt = await decryptSignature(signature);
		if (!decrypt.ok) {
			return {
				ok: false,
				status: 500,
				redirectURL: null,
				message:
					dictionary.backend.verifyPasswordResetSignature.invalidSignature,
			} as verifyPasswordResetResponse;
		}
		const { email, sendFromURL, expiresAt } = decrypt.data;
		const foundUser = await prisma.client.findFirst({
			where: {
				email,
				passwordResetSignature: signature,
			},
		});
		if (!foundUser) {
			return {
				ok: false,
				status: 404,
				redirectURL: sendFromURL,
				message: dictionary.backend.verifyPasswordResetSignature.userNotFound,
			} as verifyPasswordResetResponse;
		}
		const currentTimestamp = new Date().getTime();
		const expirationDate = new Date(parseInt(expiresAt));
		const hasExpired = expirationDate.getTime() < currentTimestamp;
		if (hasExpired) {
			await prisma.client.update({
				where: {
					email,
				},
				data: {
					passwordResetSignature: null,
				},
			});
			return {
				ok: false,
				status: 404,
				redirectURL: sendFromURL,
				message:
					dictionary.backend.verifyPasswordResetSignature.resetLinkExpired,
			} as verifyPasswordResetResponse;
		}
		await prisma.client.update({
			where: {
				email,
			},
			data: {
				passwordResetSignature: null,
			},
		});
		return {
			ok: true,
			status: 200,
			user: email,
			redirectURL: sendFromURL,
			message: dictionary.backend.verifyPasswordResetSignature.validLink,
		} as verifyPasswordResetResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				ok: false,
				status: 500,
				redirectURL: null,
				message: e.message,
			} as verifyPasswordResetResponse;
		} else {
			return {
				ok: false,
				status: 500,
				redirectURL: null,
				message:
					dictionary.backend.verifyPasswordResetSignature.invalidSignature,
			} as verifyPasswordResetResponse;
		}
	}
};
export const sendPasswordForgotEmail = async (
	lang: Locale,
	to: string,
	sendFromLink: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	if (!to || to.length <= 0) {
		return {
			ok: false,
			status: 404,
			message: dictionary.backend.sendPasswordForgotEmail.emailNotSpecified,
		} as MailSendResponse;
	}
	const emailSended = getCookie("resetMailSend", { cookies });
	const hasSendMailBefore = hasCookie("resetMailSend", { cookies });
	if (hasSendMailBefore && emailSended === to) {
		return {
			ok: false,
			status: 404,
			message: dictionary.backend.sendPasswordForgotEmail.resetRequested,
		} as MailSendResponse;
	} else {
		const foundUser = await prisma.client.findFirst({
			where: {
				email: to,
			},
		});
		if (!foundUser) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.sendPasswordForgotEmail.accountNotFound.replace(
					"{email}",
					to
				),
			} as MailSendResponse;
		}
		if (foundUser.password == null || foundUser.password.length <= 0) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.sendPasswordForgotEmail.noPassword.replace(
					"{email}",
					to
				),
			} as MailSendResponse;
		}
		if (foundUser.emailVerified === null) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.sendPasswordForgotEmail.notActivated.replace(
					"{email}",
					to
				),
			} as MailSendResponse;
		}
		const name = foundUser.firstName + " " + foundUser.lastName;
		const encryptedData = await encryptSignature(
			foundUser,
			sendFromLink,
			12 * 60 * 60 * 1000
		);
		const url = `${process.env.APP_URL}/${lang}/account/reset-password?signature=${encryptedData}`;
		const html = render(
			ForgotPasswordEmail({
				lang,
				name,
				url,
			})
		);
		const res = await sendEmail(
			lang,
			to,
			html,
			dictionary.backend.sendPasswordForgotEmail.subject,
			dictionary.backend.sendPasswordForgotEmail.successMessage
		);
		if (res.ok) {
			await prisma.client.update({
				where: {
					email: to,
				},
				data: {
					passwordResetSignature: encryptedData,
				},
			});
			setCookie("resetMailSend", to, { cookies, maxAge: 30 * 60 });
			return res;
		}
		return res;
	}
};

export const sendVerifyAccountEmail = async (
	lang: Locale,
	to: string,
	sendFromLink: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	if (!to || to.length <= 0) {
		return {
			ok: false,
			status: 404,
			message: dictionary.backend.sendVerifyAccountEmail.invalidEmailAddress,
		} as MailSendResponse;
	}
	const foundUser = await prisma.client.findFirst({
		where: {
			email: to,
			emailVerified: null,
		},
	});
	if (!foundUser) {
		return {
			ok: false,
			status: 404,
			message: dictionary.backend.sendVerifyAccountEmail.accountNotFoundOrActivated.replace(
				"{email}",
				to
			),
		} as MailSendResponse;
	}
	const name = foundUser.firstName + " " + foundUser.lastName;
	const encryptedData = await encryptSignature(
		foundUser,
		sendFromLink,
		12 * 60 * 60 * 1000
	);
	const url = `${process.env.APP_URL}/${lang}/account/verify-email?signature=${encryptedData}`;
	const html = render(
		VerifiyAccountEmail({
			lang,
			name,
			url,
		})
	);
	const res = await sendEmail(
		lang,
		to,
		html,
		dictionary.backend.sendVerifyAccountEmail.subject,
		dictionary.backend.sendVerifyAccountEmail.successMessage
	);
	if (res.ok) {
		await prisma.client.update({
			where: {
				email: to,
			},
			data: {
				emailVerifySignature: encryptedData,
			},
		});
		return res;
	} else {
		await prisma.client.delete({
			where: {
				email: to,
			},
		});
		return {
			ok: false,
			status: 404,
			message: dictionary.backend.sendVerifyAccountEmail.activationEmailNotSent,
		} as MailSendResponse;
	}
};

export const sendEmail = async (
	lang: Locale,
	to: string,
	html: string,
	subject: string,
	successMessage: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		await transporter.sendMail({
			to: to,
			html: html,
			subject: subject,
			from: process.env.EMAIL_FROM,
		});
		return {
			ok: true,
			status: 200,
			message: successMessage,
		} as MailSendResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				ok: false,
				status: 500,
				message: e.message,
			} as MailSendResponse;
		} else {
			return {
				ok: false,
				status: 500,
				message: dictionary.backend.sendEmail.unknownError,
			} as MailSendResponse;
		}
	}
};
