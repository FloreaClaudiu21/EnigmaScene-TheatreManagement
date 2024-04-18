"use server";
import { prisma } from "@/lib/prismaClient";
import { MailSendResponse, RegisterResponse } from "@/lib/types";
import { makeDictionaryBE } from "../general/AccountProviders";
import { Locale } from "@/i18n.config";
import {
	createShowDistribution,
	createShowSeason,
	createShowType,
} from "@/lib/schemas";
import { z } from "zod";

export const getShowById = async (id: string) => {
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
			distribution: true,
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

export const getSeasonByName = async (name: string) => {
	const found = await prisma.season.findFirst({
		where: {
			name: name,
		},
	});
	return found;
};

export const getSeasonById = async (id: string) => {
	const found = await prisma.season.findFirst({
		where: {
			id: id,
		},
	});
	return found;
};

export const getCategoryByName = async (name: string) => {
	const found = await prisma.showType.findFirst({
		where: {
			name: name,
		},
	});
	return found;
};

export const getCategoryById = async (id: string) => {
	const found = await prisma.showType.findFirst({
		where: {
			id: id,
		},
	});
	return found;
};

export const getDistributionByName = async (name: string) => {
	const found = await prisma.distribution.findFirst({
		where: {
			name: name,
		},
	});
	return found;
};

export const getDistributionById = async (id: string) => {
	const found = await prisma.distribution.findFirst({
		where: {
			id: id,
		},
	});
	return found;
};

export const createSeason = async (
	lang: Locale,
	data: z.infer<typeof createShowSeason>
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const seasonFound = await getSeasonByName(data.name);
		if (seasonFound) {
			return {
				error: dictionary.backend.createShowSeason.seasonWithNameExists.replace(
					"{name}",
					data.name
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		await prisma.season.create({
			data,
		});
		return {
			error: dictionary.backend.createSeason.seasonCreatedSuccess,
			ok: true,
			status: 200,
		} as RegisterResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.createSeason.unknownError,
				status: 500,
				ok: false,
			} as RegisterResponse;
		}
	}
};

export const updateSeason = async (
	lang: Locale,
	seasonId: string,
	data: z.infer<typeof createShowSeason>
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const seasonFound = await getSeasonById(seasonId);
		if (!seasonFound) {
			return {
				error: dictionary.backend.updateSeason.seasonWithNameNotFound.replace(
					"{name}",
					data.name_en
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		await prisma.season.update({
			where: {
				id: seasonId,
			},
			data,
		});
		return {
			error: dictionary.backend.updateSeason.seasonUpdatedSuccess,
			ok: true,
			status: 200,
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
				error: dictionary.backend.updateSeason.unknownError,
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		}
	}
};

export const deleteSeason = async (lang: Locale, id: string) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const deletedResponse = await prisma.season.delete({
			where: {
				id,
			},
		});
		if (!deletedResponse) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteSeason.seasonNotFound,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.deleteSeason.seasonDeletedSuccess.replace(
				"{seasonId}",
				id
			),
		} as MailSendResponse;
	} catch (e) {
		console.log(e);
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.deleteSeason.unknownError,
		} as MailSendResponse;
	}
};

export const createCategory = async (
	lang: Locale,
	data: z.infer<typeof createShowType>
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const found = await getCategoryByName(data.name);
		if (found) {
			return {
				error: dictionary.backend.createShowType.typeWithNameExists.replace(
					"{name}",
					data.name
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		await prisma.showType.create({
			data,
		});
		return {
			error: dictionary.backend.createShowType.typeCreatedSuccess,
			ok: true,
			status: 200,
		} as RegisterResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.createShowType.unknownError,
				status: 500,
				ok: false,
			} as RegisterResponse;
		}
	}
};

export const updateCategory = async (
	lang: Locale,
	id: string,
	data: z.infer<typeof createShowType>
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const found = await getCategoryById(id);
		if (!found) {
			return {
				error: dictionary.backend.updateShowType.typeWithNameNotFound.replace(
					"{name}",
					data.name_en
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		await prisma.showType.update({
			where: {
				id,
			},
			data,
		});
		return {
			error: dictionary.backend.updateShowType.typeUpdatedSuccess,
			ok: true,
			status: 200,
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
				error: dictionary.backend.updateShowType.unknownError,
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		}
	}
};

export const deleteCategory = async (lang: Locale, id: string) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const deletedResponse = await prisma.showType.delete({
			where: {
				id,
			},
		});
		if (!deletedResponse) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteShowType.typeNotFound,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.deleteShowType.typeDeletedSuccess.replace(
				"{typeId}",
				id
			),
		} as MailSendResponse;
	} catch (e) {
		console.log(e);
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.deleteShowType.unknownError,
		} as MailSendResponse;
	}
};

export const createDistribution = async (
	lang: Locale,
	data: z.infer<typeof createShowDistribution>
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const found = await getDistributionByName(data.name);
		if (found) {
			return {
				error: dictionary.backend.createShowDistribution.distributionWithNameExists.replace(
					"{name}",
					data.name
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		await prisma.distribution.create({
			data,
		});
		return {
			error:
				dictionary.backend.createShowDistribution.distributionCreatedSuccess,
			ok: true,
			status: 200,
		} as RegisterResponse;
	} catch (e) {
		if (e instanceof Error) {
			return {
				error: e.toString(),
				status: 500,
				ok: false,
			} as RegisterResponse;
		} else {
			return {
				error: dictionary.backend.createShowDistribution.unknownError,
				status: 500,
				ok: false,
			} as RegisterResponse;
		}
	}
};

export const updateDistribution = async (
	lang: Locale,
	data: z.infer<typeof createShowDistribution>,
	id: string
) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const found = await getDistributionById(id);
		if (!found) {
			return {
				error: dictionary.backend.updateShowDistribution.distributionWithNameNotFound.replace(
					"{name}",
					data.name_en
				),
				status: 404,
				ok: false,
			} as RegisterResponse;
		}
		await prisma.distribution.update({
			where: {
				id,
			},
			data,
		});
		return {
			error:
				dictionary.backend.updateShowDistribution.distributionUpdatedSuccess,
			ok: true,
			status: 200,
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
				error: dictionary.backend.updateShowDistribution.unknownError,
				status: 500,
				ok: false,
				client: undefined,
			} as RegisterResponse;
		}
	}
};

export const deleteDistribution = async (lang: Locale, id: string) => {
	const { dictionary } = await makeDictionaryBE(lang);
	try {
		const deletedResponse = await prisma.distribution.delete({
			where: {
				id,
			},
		});
		if (!deletedResponse) {
			return {
				ok: false,
				status: 404,
				message: dictionary.backend.deleteShowDistribution.distributionNotFound,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: dictionary.backend.deleteShowDistribution.distributionDeletedSuccess.replace(
				"{typeId}",
				id
			),
		} as MailSendResponse;
	} catch (e) {
		console.log(e);
		return {
			ok: false,
			status: 500,
			message: dictionary.backend.deleteShowDistribution.unknownError,
		} as MailSendResponse;
	}
};
