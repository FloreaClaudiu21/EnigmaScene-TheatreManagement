"use server";
import { isEmailAssociated } from "../general/AccountProviders";
import { encryptPassword, getClientByEmail } from "../general/AuthProvider";
import { prisma } from "@/lib/prismaClient";
import {
	schemaCreareBiletSpectacol,
	schemaCreareFacturaFiscala,
	schemaCreareMaterialDecorSpectacol,
	schemaCreareMaterialDecorSpectacolFolosit,
	schemaCreareSpectacol,
} from "@/lib/schemas";
import {
	BiletSpectacol,
	LocSalaSpectacol,
	MailSendResponse,
	TipuriTabel,
} from "@/lib/types";
import { capitalizeFirstLetter, generateRandomString } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const typeByName = (type: TipuriTabel) => {
	return capitalizeFirstLetter(type.toString().toLowerCase());
};

export const getShowById = async (id: number) => {
	const found = await prisma.spectacol.findFirst({
		where: {
			codSpectacol: id,
		},
		include: {
			bileteVandute: true,
			bonuriFiscale: true,
			materialeDecorFolosite: true,
			salaSpectacol: true,
			sezon: true,
			tipSpectacol: true,
		},
	});
	return found;
};

export const getSeasonById = async (id: number) => {
	const found = await prisma.sezon.findFirst({
		where: {
			codSezon: id,
		},
	});
	return found;
};

export const getTicketSoldById = async (id: number) => {
	const found = await prisma.biletSpectacol.findFirst({
		where: {
			codBiletSpectacol: id,
		},
	});
	return found;
};

export const getCategoryById = async (id: number) => {
	const found = await prisma.tipSpectacol.findFirst({
		where: {
			codTipSpectacol: id,
		},
	});
	return found;
};

export const getShowRoomById = async (id: number) => {
	return await prisma.salaSpectacol.findFirst({
		where: {
			codSalaSpectacol: id,
		},
	});
};

export const getShowRoomSeatById = async (id: number) => {
	return await prisma.locSalaSpectacol.findFirst({
		where: {
			codLocSala: id,
		},
		include: {
			salaSpectacol: true,
		},
	});
};

export const getShowMaterialById = async (id: number) => {
	return await prisma.materialDecorSpectacol.findFirst({
		where: {
			codMaterialDecor: id,
		},
		include: {
			categorieMaterialDecor: true,
		},
	});
};

export const getShowMaterialUsedById = async (id: number) => {
	return await prisma.materialDecorSpectacolFolosit.findFirst({
		where: {
			codMaterialDecorSpectacolFolosit: id,
		},
		include: {
			materialDecorSpectacol: true,
			spectacol: true,
		},
	});
};

export const getShowMaterialCategoryById = async (id: number) => {
	return await prisma.categorieMaterialDecor.findFirst({
		where: {
			codCategorieMaterialDecor: id,
		},
	});
};

///////////////////////////////////////////////////////////////////////////

export const verifyTicket = async (data: BiletSpectacol) => {
	const response = await prisma.biletSpectacol.update({
		where: {
			codBiletSpectacol: data.codBiletSpectacol,
		},
		data: {
			biletVerificat: !data.biletVerificat,
		},
	});
	revalidateTag("checked");
	return response;
};

export const insert = async (type: TipuriTabel, data: any) => {
	const what = typeByName(type);
	try {
		switch (type) {
			case TipuriTabel.CLIENT: {
				const registerData = {
					...data,
					parola: await encryptPassword(data.parola),
					emailVerificat: new Date(),
				};
				const found = await getClientByEmail(registerData.email);
				if (found) {
					return {
						message: `${what} cu adresa de email '${found.email}' există deja.`,
						status: 404,
						ok: false,
					} as MailSendResponse;
				}
				const associatonFound = await isEmailAssociated(registerData.email);
				if (associatonFound) {
					return {
						message: `Adresa de email '${registerData.email}' este deja asociată cu un alt cont.`,
						status: 404,
						ok: false,
					} as MailSendResponse;
				}
				const client = await prisma.client.create({
					data: registerData,
				});
				return {
					message: `${what} creat cu succes.`,
					ok: true,
					status: 200,
					client: client,
				} as MailSendResponse;
			}
			case TipuriTabel.SPECTACOL: {
				const val = data as z.infer<typeof schemaCreareSpectacol>;
				await prisma.spectacol.create({
					data: {
						...val,
					},
				});
				break;
			}
			case TipuriTabel.SPECTACOL_CATEGORIE: {
				await prisma.tipSpectacol.create({
					data,
				});
				break;
			}
			case TipuriTabel.SPECTACOL_SEZON: {
				await prisma.sezon.create({
					data,
				});
				break;
			}
			case TipuriTabel.CAMERA_SPECTACOL: {
				await prisma.salaSpectacol.create({
					data,
				});
				break;
			}
			case TipuriTabel.SCAUN_CAMERA_SPECTACOL: {
				await prisma.locSalaSpectacol.create({
					data: {
						...data,
						codSalaSpectacol: parseInt(data.codSalaSpectacol),
					},
				});
				break;
			}
			case TipuriTabel.BILET: {
				const values = data as z.infer<typeof schemaCreareBiletSpectacol>;
				const payment = await prisma.plata.create({
					data: {
						tipPlata: values.tipPlata,
						codClient: values.codClient,
						codRataDeSchimbValutar: values.codRataDeSchimbValutar,
						sumaPlatita: parseFloat(values.bileteDetalii?.pretTotal + ""),
					},
				});
				const fiscal = await prisma.bonFiscal.create({
					data: {
						codPlata: payment.codPlata,
						codClient: values.codClient,
						codSpectacol: values.codSpectacol,
						numarBonFiscal: "#" + generateRandomString(6),
					},
				});
				const locuri: LocSalaSpectacol[] =
					values.bileteDetalii?.locuriAlese ?? [];
				let codFactura = undefined;
				if (values.genereazaFacturaFiscala == "true") {
					const factura = await prisma.facturaFiscala.create({
						data: {
							adresaFacturare: values.adresaFacturare,
							email: values.email,
							numeClient: values.numeClient,
							codClient: values.codClient,
							telefon: values.prefix + values.telefon,
							numarFactura: generateRandomString(6),
							costuriExtra: 0,
							totalSumaPlatita:
								parseFloat(values.bileteDetalii?.pretTotal + "") + 0,
							sumaPlatita: parseFloat(values.bileteDetalii?.pretTotal + ""),
							dataScadentei: new Date(),
							codBonFiscal: fiscal.codBonFiscal,
							codPlata: payment.codPlata,
						},
					});
					codFactura = factura.codFactura;
				}
				await Promise.all(
					locuri.map(async (loc) => {
						await prisma.biletSpectacol.create({
							data: {
								biletVerificat: false,
								numarBilet: generateRandomString(5),
								codPlata: payment.codPlata,
								codClient: values.codClient,
								codSpectacol: values.codSpectacol,
								codSalaSpectacol: values.codSalaSpectacol,
								codLocSalaSpectacol: loc.codLocSala,
								codBonFiscal: fiscal.codBonFiscal,
								codFacturaFiscala: codFactura,
								pretVanzare: parseFloat(values.bileteDetalii?.pretTotal + ""),
							},
						});
					})
				);
				break;
			}
			case TipuriTabel.FACTURA_FISCALA: {
				const values = data as z.infer<typeof schemaCreareFacturaFiscala>;
				const factura = await prisma.facturaFiscala.create({
					data: {
						costuriExtra: 0,
						codPlata: values.codPlata,
						codClient: values.codClient,
						codBonFiscal: values.codBonFiscal,
						telefon: values.prefix + values.telefon,
						numarFactura: values.numarFactura,
						adresaFacturare: values.adresaFacturare,
						email: values.email,
						numeClient: values.numeClient,
						sumaPlatita: parseFloat(values.sumaPlatita),
						dataScadentei: new Date(),
						totalSumaPlatita: parseFloat(values.sumaPlatita) + 0,
					},
				});
				await prisma.biletSpectacol.updateMany({
					where: {
						codBonFiscal: values.codBonFiscal,
						codPlata: values.codPlata,
					},
					data: {
						codBonFiscal: values.codBonFiscal,
						codFacturaFiscala: factura.codFactura,
					},
				});
				break;
			}
			case TipuriTabel.MATERIAL_DECOR: {
				const values = data as z.infer<
					typeof schemaCreareMaterialDecorSpectacol
				>;
				await prisma.materialDecorSpectacol.create({
					data: {
						...values,
						pretAchizitie: parseFloat(values.pretAchizitie),
					},
				});
				break;
			}
			case TipuriTabel.MATERIAL_DECOR_FOLOSIT: {
				const values = data as z.infer<
					typeof schemaCreareMaterialDecorSpectacolFolosit
				>;
				await prisma.materialDecorSpectacolFolosit.create({
					data: {
						...values,
					},
				});
				await prisma.materialDecorSpectacol.update({
					where: {
						codMaterialDecor: values.codMaterialDecorSpectacol,
					},
					data: {
						cantitateStoc: values.cantitateaRamasaPeStoc,
					},
				});
				break;
			}
			case TipuriTabel.MATERIAL_DECOR_CATEGORIE: {
				await prisma.categorieMaterialDecor.create({
					data,
				});
				break;
			}
		}
		return {
			message: `${what} creat cu succes.`,
			ok: true,
			status: 200,
		} as MailSendResponse;
	} catch (e) {
		console.log("Add Error: " + e);
		if (e instanceof Error) {
			console.log(e.stack);
			return {
				message: e.toString(),
				status: 500,
				ok: false,
			} as MailSendResponse;
		} else {
			return {
				message: `A apărut o eroare necunoscută în timpul creării '${what}'. Vă rugăm să încercați din nou mai târziu.`,
				status: 500,
				ok: false,
			} as MailSendResponse;
		}
	}
};

export const update = async (type: TipuriTabel, data: any, id: number) => {
	const what = typeByName(type);
	try {
		switch (type) {
			case TipuriTabel.CLIENT: {
				const registerData = {
					...data,
					parola: await encryptPassword(data.parola),
				};
				const found = await getClientByEmail(registerData.email);
				if (!found) {
					return {
						message: `${what} cu adresa de email '${registerData.email}' nu există.`,
						status: 404,
						ok: false,
					} as MailSendResponse;
				}
				await prisma.client.update({
					where: {
						email: data.email,
					},
					data: registerData,
				});
				return {
					message: `${what} actualizat cu succes.`,
					ok: true,
					status: 200,
				} as MailSendResponse;
			}
			case TipuriTabel.SPECTACOL: {
				const found = await getShowById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				await prisma.spectacol.update({
					where: {
						codSpectacol: id,
					},
					data: {
						...data,
					},
				});
				break;
			}
			case TipuriTabel.SPECTACOL_CATEGORIE: {
				const found = await getCategoryById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				await prisma.tipSpectacol.update({
					where: {
						codTipSpectacol: id,
					},
					data,
				});
				break;
			}
			case TipuriTabel.SPECTACOL_SEZON: {
				const found = await getSeasonById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				await prisma.sezon.update({
					where: {
						codSezon: id,
					},
					data,
				});
				break;
			}
			case TipuriTabel.CAMERA_SPECTACOL: {
				const found = await getShowRoomById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				await prisma.salaSpectacol.update({
					where: {
						codSalaSpectacol: id,
					},
					data,
				});
				break;
			}
			case TipuriTabel.SCAUN_CAMERA_SPECTACOL: {
				const found = await getShowRoomSeatById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				await prisma.locSalaSpectacol.update({
					where: {
						codLocSala: id,
					},
					data: {
						...data,
					},
				});
				break;
			}
			case TipuriTabel.BILET: {
				const found = await getTicketSoldById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				const values = data as z.infer<typeof schemaCreareBiletSpectacol>;
				const payment = await prisma.plata.update({
					where: {
						codPlata: found.codPlata,
					},
					data: {
						codClient: values.codClient,
						sumaPlatita: parseFloat(values.pretVanzare),
						codRataDeSchimbValutar: values.codRataDeSchimbValutar,
					},
				});
				await prisma.biletSpectacol.update({
					where: {
						codBiletSpectacol: id,
					},
					data: {
						codPlata: payment.codPlata,
						codClient: values.codClient,
						codSpectacol: values.codSpectacol,
						codSalaSpectacol: values.codSalaSpectacol,
						pretVanzare: parseFloat(values.pretVanzare),
					},
				});
				const fiscal = await prisma.bonFiscal.update({
					where: {
						codPlata: payment.codPlata,
					},
					data: {
						codClient: values.codClient,
						codSpectacol: values.codSpectacol,
					},
				});
				let codFactura = undefined;
				if (values.genereazaFacturaFiscala == "true") {
					if (found.codFacturaFiscala != null) {
						await prisma.facturaFiscala.update({
							where: {
								codPlata: payment.codPlata,
							},
							data: {
								email: values.email,
								telefon: values.prefix + values.telefon,
								numeClient: values.numeClient,
								adresaFacturare: values.adresaFacturare,
								costuriExtra: 0,
								codClient: values.codClient,
								totalSumaPlatita: parseFloat(values.pretVanzare) + 0,
								sumaPlatita: parseFloat(values.pretVanzare),
								codBonFiscal: fiscal.codBonFiscal,
								codPlata: payment.codPlata,
							},
						});
					} else {
						const factura = await prisma.facturaFiscala.create({
							data: {
								email: values.email,
								telefon: values.prefix + values.telefon,
								numeClient: values.numeClient,
								costuriExtra: 0,
								adresaFacturare: values.adresaFacturare,
								numarFactura: generateRandomString(6),
								totalSumaPlatita: parseFloat(values.pretVanzare) + 0,
								sumaPlatita: parseFloat(values.pretVanzare),
								dataScadentei: new Date(),
								codBonFiscal: fiscal.codBonFiscal,
								codPlata: payment.codPlata,
								codClient: values.codClient,
							},
						});
						codFactura = factura.codFactura;
					}
				}
				await prisma.biletSpectacol.updateMany({
					where: {
						codPlata: found.codPlata,
					},
					data: {
						codPlata: payment.codPlata,
						codClient: values.codClient,
						codSpectacol: values.codSpectacol,
						codSalaSpectacol: values.codSalaSpectacol,
						pretVanzare: parseFloat(values.pretVanzare),
						codFacturaFiscala: codFactura ?? found.codFacturaFiscala,
					},
				});
				break;
			}
			case TipuriTabel.FACTURA_FISCALA: {
				const values = data as z.infer<typeof schemaCreareFacturaFiscala>;
				await prisma.facturaFiscala.update({
					where: {
						codFactura: id,
					},
					data: {
						costuriExtra: 0,
						codPlata: values.codPlata,
						codClient: values.codClient,
						codBonFiscal: values.codBonFiscal,
						telefon: values.prefix + values.telefon,
						numarFactura: values.numarFactura,
						adresaFacturare: values.adresaFacturare,
						email: values.email,
						numeClient: values.numeClient,
						sumaPlatita: parseFloat(values.sumaPlatita),
						totalSumaPlatita: parseFloat(values.sumaPlatita) + 0,
					},
				});
				break;
			}
			case TipuriTabel.MATERIAL_DECOR: {
				const found = await getShowMaterialById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				const values = data as z.infer<
					typeof schemaCreareMaterialDecorSpectacol
				>;
				await prisma.materialDecorSpectacol.update({
					where: {
						codMaterialDecor: id,
					},
					data: {
						...values,
						pretAchizitie: parseFloat(values.pretAchizitie),
					},
				});
				break;
			}
			case TipuriTabel.MATERIAL_DECOR_FOLOSIT: {
				const found = await getShowMaterialUsedById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				const values = data as z.infer<
					typeof schemaCreareMaterialDecorSpectacolFolosit
				>;
				await prisma.materialDecorSpectacolFolosit.update({
					where: {
						codMaterialDecorSpectacolFolosit: id,
					},
					data: {
						...values,
					},
				});
				await prisma.materialDecorSpectacol.update({
					where: {
						codMaterialDecor: values.codMaterialDecorSpectacol,
					},
					data: {
						cantitateStoc: values.cantitateaRamasaPeStoc,
					},
				});
				break;
			}
			case TipuriTabel.MATERIAL_DECOR_CATEGORIE: {
				const found = await getShowMaterialCategoryById(id);
				if (!found) {
					return {
						message: `${what} cu ID-ul '${id}' nu există.`,
						ok: false,
						status: 404,
					} as MailSendResponse;
				}
				await prisma.categorieMaterialDecor.update({
					where: {
						codCategorieMaterialDecor: id,
					},
					data,
				});
				break;
			}
		}
		return {
			message: `${what} actualizat cu succes.`,
			ok: true,
			status: 200,
		} as MailSendResponse;
	} catch (e) {
		console.log("Update Error: " + e);
		if (e instanceof Error) {
			return {
				message: e.toString(),
				status: 500,
				ok: false,
			} as MailSendResponse;
		} else {
			return {
				message: `A apărut o eroare necunoscută în timpul actualizării ${what}. Vă rugăm să încercați din nou mai târziu.`,
				status: 500,
				ok: false,
			} as MailSendResponse;
		}
	}
};

export const remove = async (type: TipuriTabel, id: number) => {
	const what = typeByName(type);
	try {
		let deletedResponse = undefined;
		switch (type) {
			case TipuriTabel.CLIENT:
				deletedResponse = await prisma.client.delete({
					where: {
						codClient: id,
					},
				});
				break;
			case TipuriTabel.SPECTACOL:
				deletedResponse = await prisma.spectacol.delete({
					where: {
						codSpectacol: id,
					},
				});
				break;
			case TipuriTabel.SPECTACOL_CATEGORIE:
				deletedResponse = await prisma.tipSpectacol.delete({
					where: {
						codTipSpectacol: id,
					},
				});
				break;
			case TipuriTabel.SPECTACOL_SEZON:
				deletedResponse = await prisma.sezon.delete({
					where: {
						codSezon: id,
					},
				});
				break;
			case TipuriTabel.CAMERA_SPECTACOL:
				deletedResponse = await prisma.salaSpectacol.delete({
					where: {
						codSalaSpectacol: id,
					},
				});
				break;
			case TipuriTabel.SCAUN_CAMERA_SPECTACOL:
				deletedResponse = await prisma.locSalaSpectacol.delete({
					where: {
						codLocSala: id,
					},
				});
				break;
			case TipuriTabel.BILET:
				deletedResponse = await prisma.biletSpectacol.delete({
					where: {
						codBiletSpectacol: id,
					},
				});
				if (deletedResponse.codBonFiscal != null) {
					const bonFiscal = await prisma.bonFiscal.findFirst({
						where: {
							codBonFiscal: deletedResponse.codBonFiscal,
						},
						include: {
							bileteSpectacol: true,
						},
					});
					if (bonFiscal?.bileteSpectacol?.length ?? 0 <= 0) {
						await prisma.bonFiscal.delete({
							where: {
								codBonFiscal: bonFiscal?.codBonFiscal,
							},
						});
						if (deletedResponse.codFacturaFiscala != null) {
							await prisma.facturaFiscala.delete({
								where: {
									codFactura: deletedResponse.codFacturaFiscala,
								},
							});
						}
					}
				}
				break;
			case TipuriTabel.FACTURA_FISCALA:
				deletedResponse = await prisma.facturaFiscala.delete({
					where: {
						codFactura: id,
					},
				});
				break;
			case TipuriTabel.MATERIAL_DECOR:
				deletedResponse = await prisma.materialDecorSpectacol.delete({
					where: {
						codMaterialDecor: id,
					},
				});
				break;
			case TipuriTabel.MATERIAL_DECOR_FOLOSIT:
				const mat = await prisma.materialDecorSpectacolFolosit.findFirst({
					where: {
						codMaterialDecorSpectacolFolosit: id,
					},
				});
				if (!mat) break;
				deletedResponse = await prisma.materialDecorSpectacolFolosit.delete({
					where: {
						codMaterialDecorSpectacolFolosit: id,
					},
				});
				await prisma.materialDecorSpectacol.update({
					where: {
						codMaterialDecor: mat.codMaterialDecorSpectacol,
					},
					data: {
						cantitateStoc: { increment: mat?.cantitateaFolosita },
					},
				});
				break;
			case TipuriTabel.MATERIAL_DECOR_CATEGORIE:
				deletedResponse = await prisma.categorieMaterialDecor.delete({
					where: {
						codCategorieMaterialDecor: id,
					},
				});
				break;
		}
		if (!deletedResponse) {
			return {
				ok: false,
				status: 404,
				message: `${what} cu ID-ul '${id}' nu a fost găsit!`,
			} as MailSendResponse;
		}
		return {
			ok: true,
			status: 200,
			message: `${what} cu ID-ul '${id}' a fost sters!`,
		} as MailSendResponse;
	} catch (e) {
		console.log("Delete Error: " + e);
		if (e instanceof Error) {
			return {
				message: e.toString(),
				status: 500,
				ok: false,
			} as MailSendResponse;
		} else {
			return {
				message: `A apărut o eroare necunoscută în timpul ștergerii ${what}. Vă rugăm să încercați din nou mai târziu.`,
				status: 500,
				ok: false,
			} as MailSendResponse;
		}
	}
};
