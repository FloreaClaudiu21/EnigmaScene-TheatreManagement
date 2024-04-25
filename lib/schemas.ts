import * as z from "zod";
import { isNumeric } from "./utils";
import { PaymentType } from "@prisma/client";

const isStrongPassword = (password: string | undefined) => {
	if (!password || password.length <= 0) {
		return true;
	}
	try {
		password = password.trim();
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const hasMinLength = password.length >= 8;
		return hasUpperCase && hasLowerCase && hasSpecialCharacter && hasMinLength;
	} catch (e) {
		return false;
	}
};

const isDateInPast = (dateString: string | undefined) => {
	if (!dateString) return true;
	const date = new Date(dateString);
	const currentDate = new Date();
	return date <= currentDate;
};

const isDateOneMonthOld = (dateString: string | undefined) => {
	if (!dateString) return true;
	const date = new Date(dateString);
	const oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	return date <= oneMonthAgo;
};

export const loginFormSchema = z.object({
	email: z.string().min(4).max(100),
	password: z.string().min(8).max(60),
});

export const updateSchema = z
	.object({
		email: z
			.string()
			.min(4)
			.max(100)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		firstName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		lastName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		prefix: z.string(),
		phone: z
			.string()
			.min(8)
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		birthDate: z.string().optional(),
		password: z.string().optional(),
	})
	.refine((data) => isStrongPassword(data.password), {
		message:
			"Password must be strong (include uppercase, lowercase, special characters, and be at least 8 characters long)",
		path: ["password"],
	})
	.refine((data) => isDateInPast(data.birthDate), {
		message: "Birth date must be in the past",
		path: ["birthDate"],
	})
	.refine((data) => isDateOneMonthOld(data.birthDate), {
		message: "Birth date must be at least one month old",
		path: ["birthDate"],
	});

export const registerSchema = z
	.object({
		email: z
			.string()
			.min(4)
			.max(100)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		firstName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		lastName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		prefix: z.string(),
		phone: z
			.string()
			.min(8)
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		birthDate: z.string(),
		password: z
			.string()
			.min(8)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		rePassword: z
			.string()
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		terms: z.boolean().default(false),
	})
	.refine((data) => data.rePassword === data.password, {
		message: "Passwords must match",
		path: ["rePassword"],
	})
	.refine((data) => isStrongPassword(data.password), {
		message:
			"Password must be strong (include uppercase, lowercase, special characters, and be at least 8 characters long)",
		path: ["password"],
	})
	.refine((data) => isDateInPast(data.birthDate), {
		message: "Birth date must be in the past",
		path: ["birthDate"],
	})
	.refine((data) => isDateOneMonthOld(data.birthDate), {
		message: "Birth date must be at least one month old",
		path: ["birthDate"],
	});

export const firstTimeAccountSchema = z
	.object({
		email: z
			.string()
			.min(4)
			.max(100)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		firstName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		lastName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		prefix: z.string(),
		phone: z
			.string()
			.min(8)
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		birthDate: z.string(),
		terms: z.boolean().default(false),
	})
	.refine((data) => isDateInPast(data.birthDate), {
		message: "Birth date must be in the past",
		path: ["birthDate"],
	})
	.refine((data) => isDateOneMonthOld(data.birthDate), {
		message: "Birth date must be at least one month old",
		path: ["birthDate"],
	});

export const resetPassSchema = z
	.object({
		password: z
			.string()
			.min(8)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		rePassword: z
			.string()
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => data.rePassword === data.password, {
		message: "Passwords must match",
		path: ["rePassword"],
	})
	.refine((data) => isStrongPassword(data.password), {
		message:
			"Password must be strong (include uppercase, lowercase, special characters, and be at least 8 characters long)",
		path: ["password"],
	});

export const createShowSchema = z.object({
	image: z
		.string()
		.min(1)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	title: z
		.string()
		.min(3)
		.max(100)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	title_en: z
		.string()
		.min(3)
		.max(100)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	description: z.string().min(3).max(150),
	description_en: z.string().min(3).max(150),
	content: z.string().min(3).max(500),
	content_en: z.string().min(3).max(500),
	director: z.string().min(3).max(150),
	actors: z.string().min(3).max(200),
	startTime: z.string(),
	endTime: z.string(),
	showRoomId: z
		.string()
		.min(1)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	showTypeId: z
		.string()
		.min(1)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	seasonId: z
		.string()
		.min(1)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
});

export const createShowSeason = z.object({
	name: z.string().min(3).max(100),
	name_en: z.string().min(3).max(100),
});

export const createShowType = z.object({
	name: z.string().min(3).max(100),
	name_en: z.string().min(3).max(100),
});

export const createShowDistribution = z.object({
	name: z.string().min(3).max(100),
	name_en: z.string().min(3).max(100),
});

export const createShowRoom = z.object({
	number: z
		.string()
		.min(1)
		.max(150)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	observations: z.string().min(5).max(200).optional(),
});

export const createShowRoomSeat = z
	.object({
		type: z.string().min(3).max(150),
		price: z.string(),
		row: z.string().max(3),
		number: z
			.string()
			.min(1)
			.max(150)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		showRoomId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => isNumeric(data.price), {
		message: "Invalid price, must be a number!",
		path: ["price"],
	})
	.refine((data) => parseFloat(data.price) > 0, {
		message: "Invalid price, must be a greater than 0!",
		path: ["price"],
	});

export const createTicketSold = z
	.object({
		number: z.string().min(3).max(150),
		soldPrice: z.string().min(1),
		clientId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		seatId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		showId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		showRoomId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		showRoomName: z.string(),
		currency: z.string().min(2).max(150),
		currencyDate: z.string().min(2).max(150),
		currencyAmount: z.string().min(1).max(150),
		paymentType: z.enum(["DEBIT_CARD", "CASH"]).default("CASH"),
		generateInvoice: z.string().default("false"),
		email: z
			.string()
			.max(100)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		firstName: z
			.string()
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		lastName: z
			.string()
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		prefix: z.string(),
		billingAddress: z.string(),
		phone: z
			.string()
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => isNumeric(data.soldPrice), {
		message: "Invalid price, must be a number!",
		path: ["soldPrice"],
	})
	.refine((data) => isNumeric(data.currencyAmount), {
		message: "Invalid price, must be a number!",
		path: ["currencyAmount"],
	})
	.refine((data) => parseFloat(data.soldPrice) > 0, {
		message: "Invalid price, must be greater than 0!",
		path: ["soldPrice"],
	})
	.refine((data) => parseFloat(data.currencyAmount) > 0, {
		message: "Invalid currency amount, must be greater than 0!",
		path: ["currencyAmount"],
	});

export const createTicketVerified = z.object({
	ticketSoldId: z
		.string()
		.min(1)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
});

export const createInvoiceSchema = z
	.object({
		invoiceNumber: z.string(),
		totalAmount: z.string(),
		clientId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		paymentId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		fiscalReceiptId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		ticketId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		currency: z.string().min(2).max(150),
		currencyDate: z.string().min(2).max(150),
		currencyAmount: z.string().min(1).max(150),
		email: z
			.string()
			.max(100)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		firstName: z
			.string()
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		lastName: z
			.string()
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		prefix: z.string(),
		billingAddress: z.string(),
		phone: z
			.string()
			.max(15)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => isNumeric(data.totalAmount), {
		message: "Invalid price, must be a number!",
		path: ["totalAmount"],
	})
	.refine((data) => isNumeric(data.currencyAmount), {
		message: "Invalid price, must be a number!",
		path: ["currencyAmount"],
	})
	.refine((data) => parseFloat(data.totalAmount) > 0, {
		message: "Invalid price, must be greater than 0!",
		path: ["totalAmount"],
	})
	.refine((data) => parseFloat(data.currencyAmount) > 0, {
		message: "Invalid price, must be greater than 0!",
		path: ["currencyAmount"],
	});

export const createMaterialSchema = z
	.object({
		name: z.string().min(3).max(100),
		name_en: z.string().min(3).max(100),
		stock: z.string(),
		buyPrice: z.string(),
		buyDate: z.string().min(2).max(150),
		unit: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		producer: z
			.string()
			.min(3)
			.max(130)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		categoryId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => isNumeric(data.stock), {
		message: "Invalid stock, must be a number!",
		path: ["stock"],
	})
	.refine((data) => isNumeric(data.buyPrice), {
		message: "Invalid buy price, must be a number!",
		path: ["buyPrice"],
	})
	.refine((data) => parseInt(data.stock) > 0, {
		message: "Invalid stock, must be greater than 0!",
		path: ["stock"],
	})
	.refine((data) => parseFloat(data.buyPrice) > 0, {
		message: "Invalid buy price, must be greater than 0!",
		path: ["buyPrice"],
	});

export const createMaterialUsed = z
	.object({
		quantity: z.string(),
		leftQuantity: z.string(),
		usedDate: z.string().min(2).max(150),
		showId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		materialId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		observations: z.string().min(5).max(200).optional(),
	})
	.refine((data) => isNumeric(data.quantity), {
		message: "Invalid quantity, must be a number!",
		path: ["quantity"],
	})
	.refine((data) => parseInt(data.quantity) > 0, {
		message: "Invalid quantity, must be greater than 0!",
		path: ["quantity"],
	})
	.refine((data) => isNumeric(data.leftQuantity), {
		message: "Invalid left quantity, must be a number!",
		path: ["leftQuantity"],
	})
	.refine((data) => parseInt(data.leftQuantity) >= 0, {
		message: "Invalid left quantity, must be greater than 0!",
		path: ["leftQuantity"],
	});

export const createMaterialCategory = z.object({
	name: z.string().min(3).max(100),
	name_en: z.string().min(3).max(100),
});

export const messageSchema = z.object({
	email: z
		.string()
		.min(4)
		.max(100)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	firstName: z
		.string()
		.min(4)
		.max(120)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	lastName: z
		.string()
		.min(4)
		.max(120)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	phone: z
		.string()
		.min(8)
		.max(15)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	message: z.string().max(250),
});

export const facturareDetailsSchema = z.object({
	email: z
		.string()
		.min(4)
		.max(100)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	firstName: z
		.string()
		.min(4)
		.max(120)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	lastName: z
		.string()
		.min(4)
		.max(120)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	prefix: z.string(),
	billingAddress: z.string().min(4),
	phone: z
		.string()
		.min(8)
		.max(15)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
});

export const addAddressFormSchema = z.object({
	address: z.string().min(5).max(150),
	observations: z.string().min(5).max(200).optional(),
	type: z.enum(["BILLING", "SHIPPING"]).default("BILLING"),
	zipCode: z
		.string()
		.min(4)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	city: z
		.string()
		.min(5)
		.max(30)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
	country: z
		.string()
		.min(4)
		.max(30)
		.refine((value) => (typeof value === "string" ? value.trim() : value)),
});
