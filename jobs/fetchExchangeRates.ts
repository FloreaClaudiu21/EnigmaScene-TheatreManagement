import { PrismaClient } from "@prisma/client";
import xml2js from "xml2js";

const prisma = new PrismaClient();

class CursBNR {
	date: string = "";
	xmlDocument: string = "";
	currency: { name: string; value: number; multiplier: number }[] = [];
	async fetchAndParseXML(url: string) {
		const response = await fetch(url);
		const xmlString = await response.text();
		const xmlParsed = await xml2js.parseStringPromise(xmlString, {
			explicitArray: false,
		});
		const headerNode = xmlParsed["DataSet"]["Header"];
		this.date = headerNode["PublishingDate"] || "";
		const rates = xmlParsed["DataSet"]["Body"]["Cube"]["Rate"];
		rates.forEach((rate: any) => {
			const currencyName = rate["$"]["currency"];
			const currencyValue = parseFloat(rate["_"] || "0");
			const multiplier = rate["$"]["multiplier"] || "1";
			this.currency.push({
				name: currencyName,
				value: currencyValue,
				multiplier: parseFloat(multiplier),
			});
		});
	}
	async saveToDatabase() {
		const { count } = await prisma.rataDeSchimbValutar.deleteMany();
		console.log("Deleted old exchange rates: " + count);
		await prisma.rataDeSchimbValutar.createMany({
			data: this.currency.map((line) => ({
				moneda: line.name,
				valuare: line.value,
				multiplicator: line.multiplier,
				data: new Date(this.date),
			})),
		});
	}
}

export async function runCronJob() {
	const url = "https://www.bnr.ro/nbrfxrates.xml";
	const cursInstance = new CursBNR();
	await cursInstance.fetchAndParseXML(url);
	await cursInstance.saveToDatabase();
	const found = await prisma.rataDeSchimbValutar.findMany();
	console.log(found.length);
	console.log(
		`Exchange rates fetched and saved to the database at ${new Date().toLocaleString()}`
	);
	await prisma.$disconnect();
}

runCronJob()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
