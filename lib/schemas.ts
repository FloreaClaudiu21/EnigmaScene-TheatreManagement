import * as z from "zod";
import { isNumeric } from "./utils";

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

export const loginFormSchema = z.object({
	email: z.string().min(4).max(100),
	password: z.string().min(8).max(60),
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

export const createShowSchema = z
	.object({
		bags: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		doors: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		seats: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		plateNumber: z
			.string()
			.min(3)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		mileage: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		price: z
			.string()
			.min(2)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		color: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		warrantyPrice: z
			.string()
			.min(2)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		gpsNavigation: z.boolean().default(false),
		airConditioning: z.boolean().default(false),
		carBrandId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		locationTypeId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		fuelPolicyId: z
			.string()
			.min(1)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => isNumeric(data.price), {
		message: "Invalid price, must be a number!",
		path: ["price"],
	})
	.refine((data) => isNumeric(data.warrantyPrice), {
		message: "Invalid price, must be a number!",
		path: ["warrantyPrice"],
	})
	.refine((data) => isNumeric(data.bags), {
		message: "Invalid bags, must be a number!",
		path: ["bags"],
	})
	.refine((data) => isNumeric(data.doors), {
		message: "Invalid doors, must be a number!",
		path: ["doors"],
	})
	.refine((data) => isNumeric(data.seats), {
		message: "Invalid seats, must be a number!",
		path: ["seats"],
	});
