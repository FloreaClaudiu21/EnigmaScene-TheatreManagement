"use server";
import { Locale } from "@/i18n.config";
import {
	isEmailAssociated,
	makeDictionaryBE,
} from "../general/AccountProviders";
import { RegisterResponse, TableTypes } from "@/lib/types";
import { encryptPassword, getClientByEmail } from "../general/AuthProvider";
import { prisma } from "@/lib/prismaClient";
import { capitalizeFirstLetter, generateRandomString } from "@/lib/utils";
import {
	createInvoiceSchema,
	createMaterialSchema,
	createMaterialUsed,
	createTicketSold,
} from "@/lib/schemas";
import { z } from "zod";

const typeByName = (type: TableTypes) => {
	return capitalizeFirstLetter(type.toString().toLowerCase());
};

export const getShowById = async (id: number) => {
	const found = await prisma.show.findFirst({
		where: {
			id: id,
		},
		include: {
			favorites: {
				include: {
					client: true,
				},
			},
			ticketsSold: true,
			showType: true,
			season: true,
			materials: {
				include: {
					material: {
						include: {
							category: true,
						},
					},
				},
			},
		},
	});
	return found;
};

export const getSeasonById = async (id: number) => {
	const found = await prisma.season.findFirst({
		where: {
			id: id,
		},
	});
	return found;
};

export const getTicketSoldById = async (id: number) => {
	const found = await prisma.ticketSold.findFirst({
		where: {
			id: id,
		},
	});
	return found;
};

export const getTicketVerifiedById = async (id: number) => {
	const found = await prisma.ticketVerified.findFirst({
		where: {
			id: id,
		},
	});
	return found;
};

export const getCategoryById = async (id: number) => {
	const found = await prisma.showType.findFirst({
		where: {
			id: id,
		},
	});
	return found;
};

export const getShowRoomById = async (id: number) => {
	return await prisma.showRoom.findFirst({
		where: {
			id: id,
		},
	});
};

export const getShowRoomSeatById = async (id: number) => {
	return await prisma.showRoomSeat.findFirst({
		where: {
			id: id,
		},
	});
};

export const getShowMaterialById = async (id: number) => {
	return await prisma.showMaterialDecoration.findFirst({
		where: {
			id: id,
		},
	});
};

export const getShowMaterialUsedById = async (id: number) => {
	return await prisma.showMaterialDecorationUsed.findFirst({
		where: {
			id: id,
		},
		include: {
			material: true,
			show: {
				include: {
					showType: true,
					season: true,
				},
			},
		},
	});
};

export const getShowMaterialCategoryById = async (id: number) => {
	return await prisma.showMaterialDecorationCategory.findFirst({
		where: {
			id: id,
		},
	});
};

export const insert = async (lang: Locale, type: TableTypes, data: any) => {
	const what = typeByName(type);
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		switch (type) {
			case TableTypes.CLIENT: {
				const registerData = {
					...data,
					password: await encryptPassword(data.password),
					emailVerified: new Date(),
				};
				const found = await getClientByEmail(registerData.email);
				if (found) {
					return {
						error: dictionary.backend.createGeneral.alreadyExistsEmail
							.replace("{email}", found.email)
							.replace("{what}", what),
						status: 404,
						ok: false,
					} as RegisterResponse;
				}
				const associatonFound = await isEmailAssociated(registerData.email);
				if (associatonFound) {
					return {
						error: dictionary.backend.createGeneral.emailAssociatedWithAnotherAccount.replace(
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
					error: dictionary.backend.createGeneral.createdSuccess.replace(
						"{what}",
						what
					),
					ok: true,
					status: 200,
					client: client,
				} as RegisterResponse;
			}
			case TableTypes.SHOW: {
				await prisma.show.create({
					data: {
						...data,
						seasonId: parseInt(data.seasonId),
						showTypeId: parseInt(data.showTypeId),
						showRoomId: parseInt(data.showRoomId),
					},
				});
				break;
			}
			case TableTypes.SHOW_CATEGORY: {
				await prisma.showType.create({
					data,
				});
				break;
			}
			case TableTypes.SHOW_SEASON: {
				await prisma.season.create({
					data,
				});
				break;
			}
			case TableTypes.SHOWROOM: {
				await prisma.showRoom.create({
					data,
				});
				break;
			}
			case TableTypes.SHOWROOM_SEAT: {
				await prisma.showRoomSeat.create({
					data: {
						...data,
						showRoomId: parseInt(data.showRoomId),
					},
				});
				break;
			}
			case TableTypes.TICKET_SOLD: {
				const values = data as z.infer<typeof createTicketSold>;
				const payment = await prisma.payment.create({
					data: {
						type: values.paymentType,
						clientId: parseInt(values.clientId),
						amount: parseFloat(values.soldPrice),
						currencyAmount: parseFloat(values.currencyAmount),
						currency: values.currency,
						currencyDate: values.currencyDate,
					},
				});
				const ticket = await prisma.ticketSold.create({
					data: {
						number: values.number,
						clientId: parseInt(values.clientId),
						seatId: parseInt(values.seatId),
						showId: parseInt(values.showId),
						showRoomId: parseInt(values.showRoomId),
						soldPrice: parseFloat(values.soldPrice),
					},
				});
				await prisma.payment.update({
					where: {
						id: payment.id,
					},
					data: {
						ticketId: ticket.id,
					},
				});
				const fiscal = await prisma.fiscalReceipt.create({
					data: {
						clientId: parseInt(values.clientId),
						currency: values.currency,
						currencyDate: values.currencyDate,
						showId: parseInt(values.showId),
						ticketId: ticket.id,
						paymentId: payment.id,
						paidAt: new Date(),
						amount: parseFloat(values.soldPrice),
						receiptNumber: "#" + generateRandomString(6),
						currencyAmount: parseFloat(values.currencyAmount),
					},
				});
				if (values.generateInvoice == "true") {
					await prisma.invoice.create({
						data: {
							billingAddress: values.billingAddress,
							firstName: values.firstName,
							lastName: values.lastName,
							phone: values.prefix + values.phone,
							email: values.email,
							clientId: parseInt(values.clientId),
							paymentId: payment.id,
							ticketId: ticket.id,
							amount: 1,
							dueDate: new Date(),
							extraFees: 0,
							totalAmount: parseFloat(values.soldPrice),
							currencyAmount: parseFloat(values.currencyAmount),
							invoiceNumber: generateRandomString(6),
							fiscalReceiptId: fiscal.id,
							currency: values.currency,
							currencyDate: values.currencyDate,
						},
					});
				}
				break;
			}
			case TableTypes.TICKET_VERIFIED: {
				await prisma.ticketVerified.create({
					data: {
						...data,
						ticketSoldId: parseInt(data.ticketSoldId),
					},
				});
				break;
			}
			case TableTypes.INVOICE: {
				const values = data as z.infer<typeof createInvoiceSchema>;
				await prisma.invoice.create({
					data: {
						billingAddress: values.billingAddress,
						firstName: values.firstName,
						lastName: values.lastName,
						phone: values.prefix + values.phone,
						email: values.email,
						clientId: parseInt(values.clientId),
						paymentId: parseInt(values.paymentId),
						ticketId: parseInt(values.ticketId),
						amount: 1,
						dueDate: new Date(),
						extraFees: 0,
						totalAmount: parseFloat(values.totalAmount),
						currencyAmount: parseFloat(values.currencyAmount),
						invoiceNumber: generateRandomString(6),
						fiscalReceiptId: parseInt(values.fiscalReceiptId),
						currency: values.currency,
						currencyDate: values.currencyDate,
					},
				});
				break;
			}
			case TableTypes.MATERIAL: {
				const values = data as z.infer<typeof createMaterialSchema>;
				await prisma.showMaterialDecoration.create({
					data: {
						...values,
						stock: parseInt(values.stock),
						buyPrice: parseFloat(values.buyPrice),
						categoryId: parseInt(values.categoryId),
					},
				});
				break;
			}
			case TableTypes.MATERIAL_USED: {
				const values = data as z.infer<typeof createMaterialUsed>;
				await prisma.showMaterialDecorationUsed.create({
					data: {
						...values,
						quantity: parseInt(values.quantity),
						leftQuantity: parseInt(values.leftQuantity),
						materialId: parseInt(values.materialId),
						showId: parseInt(values.showId),
					},
				});
				await prisma.showMaterialDecoration.update({
					where: {
						id: parseInt(values.materialId),
					},
					data: {
						stock: parseInt(values.leftQuantity),
					},
				});
				break;
			}
			case TableTypes.MATERIAL_CATEGORY: {
				await prisma.showMaterialDecorationCategory.create({
					data,
				});
				break;
			}
		}
		return {
			error: dictionary.backend.createGeneral.createdSuccess.replace(
				"{what}",
				what
			),
			ok: true,
			status: 200,
		} as RegisterResponse;
	} catch (e) {
		console.log("Add Error: " + e);
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.createGeneral.unknownError.replace(
					"{what}",
					what
				),
				status: 500,
				ok: false,
			} as RegisterResponse;
		}
	}
};

export const update = async (
	lang: Locale,
	type: TableTypes,
	data: any,
	id: number
) => {
	const what = typeByName(type);
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		switch (type) {
			case TableTypes.CLIENT: {
				const registerData = {
					...data,
					password: await encryptPassword(data.password),
				};
				const found = await getClientByEmail(registerData.email);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withEmailNotFound
							.replace("{email}", data.email)
							.replace("{what}", what),
						status: 404,
						ok: false,
					} as RegisterResponse;
				}
				await prisma.client.update({
					where: {
						email: data.email,
					},
					data: registerData,
				});
				return {
					error: dictionary.backend.updateGeneral.updatedSuccess.replace(
						"{what}",
						what
					),
					ok: false,
					status: 404,
				} as RegisterResponse;
			}
			case TableTypes.SHOW: {
				const found = await getShowById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				await prisma.show.update({
					where: {
						id,
					},
					data: {
						...data,
						showRoomId: parseInt(data.showRoomId),
						seasonId: parseInt(data.seasonId),
						showTypeId: parseInt(data.showTypeId),
					},
				});
				break;
			}
			case TableTypes.SHOW_CATEGORY: {
				const found = await getCategoryById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				await prisma.showType.update({
					where: {
						id,
					},
					data,
				});
				break;
			}
			case TableTypes.SHOW_SEASON: {
				const found = await getSeasonById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				await prisma.season.update({
					where: {
						id,
					},
					data,
				});
				break;
			}
			case TableTypes.SHOWROOM: {
				const found = await getShowRoomById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				await prisma.showRoom.update({
					where: {
						id,
					},
					data,
				});
				break;
			}
			case TableTypes.SHOWROOM_SEAT: {
				const found = await getShowRoomSeatById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				await prisma.showRoomSeat.update({
					where: {
						id,
					},
					data: {
						...data,
						showRoomId: parseInt(data.showRoomId),
					},
				});
				break;
			}
			case TableTypes.TICKET_SOLD: {
				const found = await getTicketSoldById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				const values = data as z.infer<typeof createTicketSold>;
				const payment = await prisma.payment.update({
					where: {
						ticketId: id,
					},
					data: {
						ticketId: id,
						type: values.paymentType,
						clientId: parseInt(values.clientId),
						amount: parseFloat(values.soldPrice),
						currencyAmount: parseFloat(values.currencyAmount),
						currency: values.currency,
						currencyDate: values.currencyDate,
					},
				});
				const ticket = await prisma.ticketSold.update({
					where: {
						id,
					},
					data: {
						number: values.number,
						clientId: parseInt(values.clientId),
						seatId: parseInt(values.seatId),
						showId: parseInt(values.showId),
						showRoomId: parseInt(values.showRoomId),
						soldPrice: parseFloat(values.soldPrice),
					},
				});
				await prisma.fiscalReceipt.update({
					where: {
						ticketId: id,
					},
					data: {
						clientId: parseInt(values.clientId),
						currency: values.currency,
						currencyDate: values.currencyDate,
						showId: parseInt(values.showId),
						ticketId: ticket.id,
						paymentId: payment.id,
						paidAt: new Date(),
						amount: parseFloat(values.soldPrice),
						currencyAmount: parseFloat(values.currencyAmount),
					},
				});
				if (values.generateInvoice == "true") {
					await prisma.invoice.update({
						where: {
							ticketId: id,
						},
						data: {
							extraFees: 0,
							billingAddress: values.billingAddress,
							firstName: values.firstName,
							lastName: values.lastName,
							phone: values.prefix + values.phone,
							email: values.email,
							clientId: parseInt(values.clientId),
							paymentId: payment.id,
							ticketId: ticket.id,
							dueDate: new Date(),
							currency: values.currency,
							currencyDate: values.currencyDate,
							amount: parseFloat(values.soldPrice),
							totalAmount: parseFloat(values.soldPrice),
							currencyAmount: parseFloat(values.currencyAmount),
						},
					});
				}
				break;
			}
			case TableTypes.TICKET_VERIFIED: {
				const found = await getTicketVerifiedById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				await prisma.ticketVerified.update({
					where: {
						id,
					},
					data: {
						...data,
						ticketSoldId: parseInt(data.ticketSoldId),
					},
				});
				break;
			}
			case TableTypes.INVOICE: {
				const values = data as z.infer<typeof createInvoiceSchema>;
				await prisma.invoice.update({
					where: {
						id,
					},
					data: {
						billingAddress: values.billingAddress,
						firstName: values.firstName,
						lastName: values.lastName,
						phone: values.prefix + values.phone,
						email: values.email,
						clientId: parseInt(values.clientId),
						paymentId: parseInt(values.paymentId),
						ticketId: parseInt(values.ticketId),
						totalAmount: parseFloat(values.totalAmount),
						currencyAmount: parseFloat(values.currencyAmount),
						fiscalReceiptId: parseInt(values.fiscalReceiptId),
						currency: values.currency,
						currencyDate: values.currencyDate,
					},
				});
				break;
			}
			case TableTypes.MATERIAL: {
				const found = await getShowMaterialById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				const values = data as z.infer<typeof createMaterialSchema>;
				await prisma.showMaterialDecoration.update({
					where: {
						id,
					},
					data: {
						...values,
						stock: parseInt(values.stock),
						buyPrice: parseFloat(values.buyPrice),
						categoryId: parseInt(values.categoryId),
					},
				});
				break;
			}
			case TableTypes.MATERIAL_USED: {
				const found = await getShowMaterialUsedById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				const values = data as z.infer<typeof createMaterialUsed>;
				await prisma.showMaterialDecorationUsed.update({
					where: {
						id,
					},
					data: {
						...values,
						quantity: parseInt(values.quantity),
						leftQuantity: parseInt(values.leftQuantity),
						materialId: parseInt(values.materialId),
						showId: parseInt(values.showId),
					},
				});
				await prisma.showMaterialDecoration.update({
					where: {
						id: parseInt(values.materialId),
					},
					data: {
						stock: parseInt(values.leftQuantity),
					},
				});
				break;
			}
			case TableTypes.MATERIAL_CATEGORY: {
				const found = await getShowMaterialCategoryById(id);
				if (!found) {
					return {
						error: dictionary.backend.updateGeneral.withIDNotFound
							.replace("{what}", what)
							.replace("{id}", id),
						ok: false,
						status: 404,
					} as RegisterResponse;
				}
				await prisma.showMaterialDecorationCategory.update({
					where: {
						id,
					},
					data,
				});
				break;
			}
		}
		return {
			error: dictionary.backend.updateGeneral.updatedSuccess.replace(
				"{what}",
				what
			),
			ok: true,
			status: 200,
		} as RegisterResponse;
	} catch (e) {
		console.log("Update Error: " + e);
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.updateGeneral.unknownError.replace(
					"{what}",
					what
				),
				status: 500,
				ok: false,
			} as RegisterResponse;
		}
	}
};

export const remove = async (lang: Locale, type: TableTypes, id: number) => {
	const what = typeByName(type);
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		let deletedResponse = undefined;
		switch (type) {
			case TableTypes.CLIENT:
				deletedResponse = await prisma.client.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.SHOW:
				deletedResponse = await prisma.show.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.SHOW_CATEGORY:
				deletedResponse = await prisma.showType.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.SHOW_SEASON:
				deletedResponse = await prisma.season.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.SHOWROOM:
				deletedResponse = await prisma.showRoom.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.SHOWROOM_SEAT:
				deletedResponse = await prisma.showRoomSeat.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.TICKET_SOLD:
				deletedResponse = await prisma.ticketSold.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.TICKET_VERIFIED:
				deletedResponse = await prisma.ticketVerified.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.INVOICE:
				deletedResponse = await prisma.invoice.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.MATERIAL:
				deletedResponse = await prisma.showMaterialDecoration.delete({
					where: {
						id,
					},
				});
				break;
			case TableTypes.MATERIAL_USED:
				const mat = await prisma.showMaterialDecorationUsed.findFirst({
					where: {
						id,
					},
				});
				if (!mat) break;
				deletedResponse = await prisma.showMaterialDecorationUsed.delete({
					where: {
						id,
					},
				});
				await prisma.showMaterialDecoration.update({
					where: {
						id: mat.materialId,
					},
					data: {
						stock: { increment: mat?.quantity },
					},
				});
				break;
			case TableTypes.MATERIAL_CATEGORY:
				deletedResponse = await prisma.showMaterialDecorationCategory.delete({
					where: {
						id,
					},
				});
				break;
		}
		if (!deletedResponse) {
			return {
				ok: false,
				status: 404,
				error: dictionary.backend.deleteGeneral.notFoundID
					.replace("{id}", id)
					.replace("{what}", what),
			} as RegisterResponse;
		}
		return {
			ok: true,
			status: 200,
			error: dictionary.backend.deleteGeneral.deletedSuccess
				.replace("{id}", id)
				.replace("{what}", what),
		} as RegisterResponse;
	} catch (e) {
		console.log("Delete Error: " + e);
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.updateGeneral.unknownError.replace(
					"{what}",
					what
				),
				status: 500,
				ok: false,
			} as RegisterResponse;
		}
	}
};
