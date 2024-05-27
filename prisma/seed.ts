import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { addDays, differenceInDays } from "date-fns";
import xml2js from "xml2js";
const prisma = new PrismaClient();
const algorithm = "aes-256-cbc";
const secretKey = process.env.AUTH_SECRET ?? "";

async function main() {
	// const encryptPassword = (password: string) => {
	// 	const cipher = crypto.createCipher(algorithm, secretKey);
	// 	let encryptedPassword = cipher.update(password, "utf-8", "hex");
	// 	encryptedPassword += cipher.final("hex");
	// 	return encryptedPassword;
	// };

	// // const mainAdminUser = await prisma.client.create({
	// // 	data: {
	// // 		numeClient: "Admin User",
	// // 		email: "adminuser@enigmatheatre.ro",
	// // 		parola: encryptPassword(process.env.ADMIN_KEY ?? ""),
	// // 		telefon: "+400729714106",
	// // 		utlizatorAdmin: true,
	// // 		dataNasterii: new Date("13-01-1998").toDateString(),
	// // 	},
	// // });
	// const seatsData = [];
	// let currentRow = "C";
	// let curRowNumber = 3;
	// for (let i = 1; i <= 90; i++) {
	// 	seatsData.push({
	// 		codSalaSpectacol: 1,
	// 		rand: curRowNumber + "",
	// 		numarLoc: currentRow + i,
	// 		pretLoc: 30,
	// 		tipLoc: "STANDARD",
	// 	});
	// 	if (i % 9 === 0) {
	// 		curRowNumber += 1;
	// 		currentRow = String.fromCharCode(currentRow.charCodeAt(0) + 1); // Increment row letter
	// 	}
	// }
	// const seats = await prisma.locSalaSpectacol.createMany({
	// 	data: seatsData,
	// });
	// console.log(seats.count);

	const addressesByCity = {
		București: [
			"Calea Victoriei",
			"Bulevardul Unirii",
			"Bulevardul Magheru",
			"Calea Dorobanților",
			"Strada Lipscani",
			"Strada Ion Câmpineanu",
			"Strada Grigore Alexandrescu",
			"Bulevardul Lascăr Catargiu",
			"Bulevardul Carol I",
			"Strada Polonă",
			"Strada Știrbei Vodă",
			"Bulevardul Gheorghe Magheru",
			"Strada Arthur Verona",
			"Strada Șoseaua Kiseleff",
			"Bulevardul Decebal",
		],
		"Cluj-Napoca": [
			"Strada Memorandumului",
			"Strada Regele Ferdinand I",
			"Strada Eroilor",
			"Bulevardul 21 Decembrie 1989",
			"Strada Horea",
			"Strada Moților",
			"Strada Mihail Kogălniceanu",
			"Bulevardul Eroilor",
			"Strada Avram Iancu",
			"Strada General Eremia Grigorescu",
			"Strada Traian Vuia",
			"Strada Mihail Sadoveanu",
			"Strada Emil Isac",
			"Strada Iuliu Maniu",
			"Strada Aurel Vlaicu",
		],
		Timișoara: [
			"Bulevardul Revoluției",
			"Strada General Henri Mathias Berthelot",
			"Piața Victoriei",
			"Strada 20 Decembrie 1989",
			"Strada Eugeniu de Savoya",
			"Strada Mercy",
			"Strada General Constantin Budisteanu",
			"Strada Doinei",
			"Strada Romulus",
			"Strada Vladimir Lenin",
			"Strada Aries",
			"Strada Dunărea",
			"Strada Dâmbovița",
			"Strada Olt",
			"Strada Prut",
		],
		Iași: [
			"Bulevardul Ștefan cel Mare și Sfânt",
			"Strada Lăpușneanu",
			"Bulevardul Independenței",
			"Strada Cuza Vodă",
			"Strada Palat",
			"Strada Anastasie Panu",
			"Bulevardul Carol I",
			"Bulevardul Tudor Vladimirescu",
			"Strada Socola",
			"Strada Cuza Vodă",
			"Strada Arcu",
		],
		Constanța: [
			"Bulevardul Tomis",
			"Strada Mihai Eminescu",
			"Bulevardul Mamaia",
			"Bulevardul Ferdinand",
			"Strada Traian",
			"Strada Mircea cel Bătrân",
			"Strada Regele Ferdinand I",
			"Strada Dobrogeanu Gherea",
			"Strada Nicolae Iorga",
			"Strada 1 Decembrie 1918",
			"Bulevardul Ferdinand II",
			"Strada Gheorghe Lazăr",
			"Strada Mircea cel Bătrân",
			"Strada Soveja",
			"Strada Bucovinei",
		],
		Craiova: [
			"Bulevardul Nicolae Bălcescu",
			"Strada Alexandru Ioan Cuza",
			"Bulevardul Carol I",
			"Strada 1 Decembrie 1918",
			"Bulevardul Tudor Vladimirescu",
			"Strada Matei Basarab",
			"Strada Olteniei",
			"Strada Gheorghe Magheru",
			"Strada Nicolae Titulescu",
			"Strada Anton Pann",
			"Strada Victor Babeș",
			"Strada Alexandru Odobescu",
			"Strada Cuza Vodă",
			"Strada Eroilor",
			"Strada Horea",
		],
		Brașov: [
			"Bulevardul Eroilor",
			"Strada Lungă",
			"Bulevardul 15 Noiembrie",
			"Strada Mureșenilor",
			"Strada 13 Decembrie",
			"Strada Gheorghe Barițiu",
			"Bulevardul Ștefan cel Mare",
			"Strada Zizinului",
			"Strada Lungă",
			"Bulevardul Gării",
			"Bulevardul Gării",
			"Strada Cetății",
			"Strada Castelului",
			"Strada Hărmanului",
			"Strada Șirul lui Traian",
		],
		Galați: [
			"Bulevardul Dunărea",
			"Strada Domnească",
			"Bulevardul Republicii",
			"Strada Brăilei",
			"Strada Brașovului",
			"Strada Călărașilor",
			"Strada Vasile Alecsandri",
			"Bulevardul 1 Decembrie 1918",
			"Strada Eroilor",
			"Strada Cuza Vodă",
			"Strada Progresului",
			"Strada Progresului",
			"Strada Sucevei",
			"Strada Vrancei",
			"Strada Aleea Rozelor",
		],
		Ploiești: [
			"Bulevardul Independenței",
			"Strada Gheorghe Grigore Cantacuzino",
			"Bulevardul Republicii",
			"Strada Ion Luca Caragiale",
			"Strada Ștefan cel Mare",
			"Strada Gheorghe Doja",
			"Strada Mihai Bravu",
			"Strada Mihai Eminescu",
			"Strada Nicolae Bălcescu",
			"Strada Nicolae Titulescu",
			"Strada Mihai Viteazul",
			"Strada Mihail Kogălniceanu",
			"Strada Nicolae Bălcescu",
			"Strada Constantin Dobrogeanu Gherea",
			"Strada Constantin Dobrogeanu Gherea",
		],
		Oradea: [
			"Bulevardul Dacia",
			"Bulevardul Decebal",
			"Bulevardul Republicii",
			"Strada Republicii",
			"Strada Gheorghe Lazăr",
			"Strada 1 Decembrie 1918",
			"Strada Tudor Vladimirescu",
			"Strada Nufărului",
			"Strada Arinului",
			"Strada Meșteșugarilor",
			"Strada Vasile Alecsandri",
			"Strada Grigore Alexandrescu",
			"Strada Mihai Eminescu",
			"Strada Traian",
			"Strada I.C. Brătianu",
		],
		Bacău: [
			"Bulevardul Unirii",
			"Bulevardul Nicolae Bălcescu",
			"Bulevardul Mărășești",
			"Strada Republicii",
			"Strada Mărăști",
			"Strada Bărăganului",
			"Strada Zimbrului",
			"Strada Lăpușneanu",
			"Strada 9 Mai",
			"Strada Făgărașului",
			"Strada Calea Moldovei",
			"Strada Traian",
			"Strada 1 Decembrie 1918",
			"Strada Ana Ipătescu",
			"Strada Bistriței",
		],
		Arad: [
			"Bulevardul Revoluției",
			"Bulevardul Decebal",
			"Bulevardul Vasile Goldiș",
			"Strada Horia",
			"Strada Ștefan cel Mare",
			"Strada Cloșca",
			"Strada 1 Decembrie 1918",
			"Strada Ion Mihalache",
			"Strada Traian Vuia",
			"Strada Oituz",
			"Strada Nicolae Grigorescu",
			"Strada Mihail Kogălniceanu",
			"Strada Avram Iancu",
			"Strada Călugăreni",
			"Strada Bihorului",
		],
		Pitești: [
			"Bulevardul Republicii",
			"Bulevardul Nicolae Bălcescu",
			"Bulevardul Independenței",
			"Strada Alexandru Odobescu",
			"Strada Mihai Bravu",
			"Strada Ion Câmpineanu",
			"Strada Transilvaniei",
			"Strada Sfânta Vineri",
			"Strada Unirii",
			"Strada Basarabiei",
			"Strada Gheorghe Doja",
			"Strada Nicolae Bălcescu",
			"Strada 1 Decembrie 1918",
			"Strada Căpitan Dumitru Moruzi",
			"Strada Ion Câmpineanu",
		],
		Sibiu: [
			"Bulevardul Victoriei",
			"Bulevardul Corneliu Coposu",
			"Bulevardul Calea Dumbrăvii",
			"Strada Mitropoliei",
			"Strada Nicolae Bălcescu",
			"Strada Johann Strauss",
			"Strada Avram Iancu",
			"Strada Mitropolit Andrei Șaguna",
			"Strada Revoluției",
			"Strada Gheorghe Lazăr",
			"Strada Oituz",
			"Strada Ion Rațiu",
			"Strada Mihail Kogălniceanu",
			"Strada General Magheru",
			"Strada Gheorghe Șincai",
		],
		"Târgu Mureș": [
			"Bulevardul 1 Decembrie 1918",
			"Bulevardul Pandurilor",
			"Bulevardul Nicolae Grigorescu",
			"Strada Păcii",
			"Strada Ana Ipătescu",
			"Strada Livezeni",
			"Strada Mihai Viteazu",
			"Strada George Coșbuc",
			"Strada Tiberiu Crudu",
			"Strada Corneliu Micloș",
			"Strada Avram Iancu",
			"Strada Școlii",
			"Strada Cloșca",
			"Strada Ion Rațiu",
			"Strada Ioan Slavici",
		],
		"Baia Mare": [
			"Bulevardul București",
			"Bulevardul Independenței",
			"Bulevardul Unirii",
			"Strada Gheorghe Șincai",
			"Strada 1 Decembrie 1918",
			"Strada Gheorghe Doja",
			"Strada Minerilor",
			"Strada Aurel Vlaicu",
			"Strada Constantin Brâncuși",
			"Strada Horea",
			"Strada Libertății",
			"Strada Principatele Unite",
			"Strada Traian",
			"Strada Cetății",
			"Strada Griviței",
		],
		Buzău: [
			"Bulevardul Unirii",
			"Bulevardul Nicolae Bălcescu",
			"Bulevardul Independenței",
			"Strada Alexandru Odobescu",
			"Strada Mărăști",
			"Strada Bărăganului",
			"Strada Zimbrului",
			"Strada Lăpușneanu",
			"Strada 9 Mai",
			"Strada Făgărașului",
			"Strada Calea Moldovei",
			"Strada Traian",
			"Strada 1 Decembrie 1918",
			"Strada Ana Ipătescu",
			"Strada Bistriței",
		],
	};

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

	const encryptPassword = (password: string) => {
		const cipher = crypto.createCipher(algorithm, secretKey);
		let encryptedPassword = cipher.update(password, "utf-8", "hex");
		encryptedPassword += cipher.final("hex");
		return encryptedPassword;
	};

	const generateRandomBoolean = () => Math.random() < 0.5;

	async function getRandomAvailableSeats(
		codSalaSpectacol: number
	): Promise<any[]> {
		const availableSeats = await prisma.locSalaSpectacol.findMany({
			where: {
				codSalaSpectacol,
				NOT: {
					bileteVandute: {
						some: {
							biletVerificat: true,
						},
					},
				},
			},
			select: {
				codLocSala: true,
				pretLoc: true,
				tipLoc: true,
			},
		});
		return availableSeats;
	}

	const generateClients = async (count: number) => {
		const numClients = count;
		const currentDate = new Date();
		const startDate = new Date("2024-01-01");
		const daysDifference = differenceInDays(currentDate, startDate);
		await prisma.client.create({
			data: {
				numeClient: "Admin User",
				email: "adminuser@enigmatheatre.ro",
				parola: encryptPassword(process.env.ADMIN_KEY ?? ""),
				telefon: "+400729714106",
				utlizatorAdmin: true,
				emailVerificat: new Date(),
				dataNasterii: new Date("13-01-1998").toDateString(),
			},
		});
		await prisma.client.create({
			data: {
				numeClient: "Florea Claudiu",
				email: "floreaclaudiu128@gmail.com",
				parola: encryptPassword("licenta2024"),
				telefon: "+400729714106",
				utlizatorAdmin: true,
				emailVerificat: new Date(),
				dataNasterii: new Date("13-01-1998").toDateString(),
			},
		});
		for (let i = 1; i <= numClients; i++) {
			const numeClient = generateRandomName();
			const email = await generateEmail(numeClient);
			const telefon = generatePhoneNumber();
			const parola = encryptPassword(generatePassword());
			const randomBirth = generateRandomDateOfBirth();
			const randomDays = Math.floor(Math.random() * daysDifference);
			const createdAt = addDays(startDate, randomDays);
			const client = await prisma.client.create({
				data: {
					numeClient,
					email,
					telefon,
					dataNasterii: randomBirth,
					parola,
					emailVerificat: new Date(),
					creatPe: createdAt,
				},
			});
			await createBillingAddress(client);
		}
		console.log("Seed Clientii terminat.");
	};

	type City = keyof typeof addressesByCity;

	async function createBillingAddress(client: any) {
		const tara = "România";
		const oras = generateRandomCity();
		const orasc = oras as City;
		const adresa = generateRandomAddress(orasc);
		const codPostal = generateRandomPostalCode();
		await prisma.adresaFacturare.create({
			data: {
				tara,
				oras,
				adresa,
				codPostal,
				codClient: client.codClient,
			},
		});
	}

	async function createShowRooms() {
		const saliDeSpectacol = ["A1", "B2", "C3", "D4", "E5"];
		for (const numarSala of saliDeSpectacol) {
			await prisma.salaSpectacol.create({
				data: {
					numarSala: numarSala,
				},
			});
		}
		console.log("Seed Show Rooms terminat.");
	}

	async function createShowRoomSeats() {
		const saliDeSpectacol = await prisma.salaSpectacol.findMany();
		for (const sala of saliDeSpectacol) {
			for (let i = 1; i <= 10; i++) {
				let tipLoc;
				let numarLoc;
				if (i == 1) {
					tipLoc = "PREMIUM";
				} else if (i > 1 && i <= 3) {
					tipLoc = "VIP";
				} else {
					tipLoc = "STANDARD";
				}
				const rand = "R" + i;
				const numarMinimLocuri = 8;
				for (let j = 1; j <= numarMinimLocuri; j++) {
					const sc = String.fromCharCode(64 + j);
					if (j <= 3 || (j > 3 && j <= 5)) {
						numarLoc = `${sc}${j <= 3 ? "" : j - 3}`;
					} else {
						numarLoc = `${sc}${j - 2}`;
					}
					const pretLoc =
						tipLoc === "PREMIUM" ? 80 : tipLoc === "VIP" ? 60 : 40;
					await prisma.locSalaSpectacol.create({
						data: {
							tipLoc,
							pretLoc,
							rand,
							numarLoc,
							salaSpectacol: {
								connect: { codSalaSpectacol: sala.codSalaSpectacol },
							},
						},
					});
				}
			}
		}
	}

	async function createSeasonAndType() {
		const sezoane = ["Primăvară", "Vară", "Toamnă", "Iarnă"];
		const tipuriSpectacole = [
			"Dramă",
			"Comedie",
			"Tragedie",
			"Muzical",
			"Dans",
			"Improvizatie",
		];
		for (const numeSezon of sezoane) {
			await prisma.sezon.create({
				data: {
					numeSezon,
				},
			});
		}
		for (const numeTip of tipuriSpectacole) {
			await prisma.tipSpectacol.create({
				data: {
					numeTip,
				},
			});
		}
		console.log("Seed Season and Type terminat.");
	}

	async function createShows() {
		await prisma.spectacol.create({
			data: {
				director: "Verena Tönjes",
				descriereScurta:
					"Songs of the Clown este povestea lui Pierrot și a lui Arlechin, spusă prin muzică, text și imagine.",
				actorii: "Daria Tudor, Verena Tönjes",
				continut:
					"O experiență muzical-dramatică care ne reconectează cu timpul prezent. Nevoia de multi-tasking dispare pentru 90 de minute, iar bucuriile și nevoile atât de importante în copilărie redevin subiecte de actualitate. Avem răbdare timp de 90 de minute și nici nu ne dăm seama. În sine un recital de lied, spectacolul propune un repertoriu care stârnește reacții. Compozitorii prezentați transmit mesajul lor artistic prin intermediul unor personaje concrete: clovnul alb și cel roșu. Clovnul însuși trasează un arc de legătură între copilărie și maturitate. Un copil îl consideră amuzant și neajutorat, în timp ce pentru un adult, clovnul este un inadaptat în fața căruia adultul e mereu superior. De aceea, unui clovn îi poți spune adevărul în orice situație, pentru că el oricum nu-l va înțelege. Astfel, clovnul străpunge ziduri de protecție, ne permite să fim pe deplin sinceri și ne reconectează în mod plăcut  la realitatea de care fugim adesea. Programul muzical este încadrat de lecturi și proiecții video de Buster Keaton, Charlie Chaplin, Marcel Marceau și Emmett Kelly, adresându-se astfel nu numai melomanilor, ci și oricui care se întreabă „de ce să mergem oare la un concert?.",
				imagine:
					"https://mystage-static.starter.ro/files/ee041cc4cab4395f8e99f4080d28e0b7d27e9456_b4.jpg",
				oraIncepere: new Date("2024-07-20T12:00:00").toISOString(),
				oraTerminare: new Date("2024-07-20T14:00:00").toISOString(),
				titlu: "Songs of the Clown",
				codSalaSpectacol: 1,
				codSezon: 3,
				codTipSpectacol: 1,
			},
		});
		await prisma.spectacol.create({
			data: {
				director: "Dragoş Alexandru Muşoiu",
				descriereScurta:
					"Farfuria este o farsă politică în care cei de jos și cei de sus și cei de aici și cei de acolo se întâlnesc în feluri comice, periculoase și demente.",
				actorii: "Voicu Aaniței, Mara Bugarin",
				continut:
					"Farfuria este o farsă politică în care cei de jos și cei de sus și cei de aici și cei de acolo se întâlnesc în feluri comice, periculoase și demente.  Într-un meci de ping-pong între nou și vechi, între “noi” și “ei”, între spații și spațiu, spectacolul este jucat în afara teatrului și apelează la planul SF pentru a elucida dinamici din realitatea noastră imediata. Cod vestimentar recomandat pentru acest eveniment: încălțări comode.",
				imagine:
					"https://mystage-static.starter.ro/files/9574def2113be565416a1bafad8851062ea221d6_b1.jpg",
				oraIncepere: new Date("2024-07-10T16:00:00").toISOString(),
				oraTerminare: new Date("2024-07-10T17:30:00").toISOString(),
				titlu: "FARFURIA",
				codSalaSpectacol: 2,
				codSezon: 3,
				codTipSpectacol: 2,
			},
		});
		await prisma.spectacol.create({
			data: {
				director: "Monica Pop",
				descriereScurta:
					"Dacă ai putea alege să îți ștergi din memorie toate amintirile dureroase, ai face-o?",
				actorii: "Axel Moustache, Andreea Moustache, Daniela Banciu",
				continut:
					"Captiv în propria minte, Joel trece printr-o călătorie tulburătoare prin abisurile trecutului cu bucurii, suferințe și sentimente de mult uitate. Iar Clementine îi iese mereu în cale: aceeași dar diferită, străină și totuși cunoscută și îl atrage ca un magnet, dincolo de rațiune în noaptea uitări. O călătorie incredibilă, presărată cu umor și suspans, o poveste de iubire intensă ce transcende limitele de timp și de spațiu. Cât de mult ești în stare să lupți pentru iubire?.",
				imagine:
					"https://mystage-static.starter.ro/files/2e9f29ccd7ebf03e6bd727432344de960e256a49_b1.jpg",
				oraIncepere: new Date("2024-11-13T18:00:00").toISOString(),
				oraTerminare: new Date("2024-11-13T20:00:00").toISOString(),
				titlu: "Remember me",
				codSalaSpectacol: 4,
				codSezon: 4,
				codTipSpectacol: 2,
			},
		});
		await prisma.spectacol.create({
			data: {
				director: "Daniel Hara",
				descriereScurta:
					"Veți râde și veți rămâne cu sufletul la gură în 'FURTUL SECOLULUI'. Haideți să descoperiți cea mai amuzantă aventură a anului!",
				actorii: "Maria Magdalena Chihaia, Alexandru Tudor Sabău, Dorin Enache",
				continut:
					"În mijlocul unui parc liniștit, Nelu vrea doar să se relaxeze pe o bancă. Dar apariția lui Paul, un vânzător de ziare plin de energie, declanșează o serie de evenimente nebunești. Când Nelu primește o scrisoare de la soția sa dispărută, Mimi, și află că un obiect valoros trebuie recuperat, aventura începe! Împreună cu hărțile desenate pe loc și o gașcă de personaje excentrice, cei doi pornesc într-o comedie haioasă plină de surprize. Cine este cu adevărat Paul? Ce va întâmpla cu obiectul valoros și cu viața lui Nelu și Mimi? Veți râde și veți rămâne cu sufletul la gură în 'FURTUL SECOLULUI'. Haideți să descoperiți cea mai amuzantă aventură a anului!",
				imagine:
					"https://mystage-static.starter.ro/files/ee041cc4cab4395f8e99f4080d28e0b7d27e9456_b4.jpg",
				oraIncepere: new Date("2024-08-03T15:00:00").toISOString(),
				oraTerminare: new Date("2024-08-03T17:00:00").toISOString(),
				titlu: "Furtul secolului",
				codSalaSpectacol: 4,
				codSezon: 4,
				codTipSpectacol: 2,
			},
		});
		await prisma.spectacol.create({
			data: {
				director: "Cristian Ioniță",
				descriereScurta:
					"O dramă comică despre bătălia dintre comercialism, faimă, artă și dragoste. Un spectacol care ne face cu adevărat să ne întrebăm dacă banii aduc fericirea.",
				actorii: "Dragoș Maxim, Vlad Andrei",
				continut:
					"Andy, un tânăr absolvent al masteratului în limba engleză, împovărat de împrumuturile studențești, este plătit foarte mult pentru a-și tatua logo-ul unei corporații pe frunte. Iubita lui, Katelyn, pictoriță, este total dezamăgită, cel mai bun prieten al său, Damon, crede că este nebun, iar acum Andy trebuie să trăiască cu asta. Decizia are atât consecințe tragice, cât și comice, deoarece ajunge să afle că logo-ul este mai mult decât un pic de cerneală injectată sub piele. Deși Andy vede doar banii câștigați din acest tatuaj, Katelyn vede o oportunitate artistică foarte unică. Ea vede corpul lui ca un exemplu al invadării consumerismului în viețile noastre de zi cu zi. Când Andy decide să rupă cecul și să-și scoată tatuajul, descoperă că trebuie să se confrunte cu o decizie neașteptată, mai mare decât propria persoană.",
				imagine:
					"https://mystage-static.starter.ro/files/57aefbab3a115e4542126810dbc1663f3b4fc23b_b1.jpg",
				oraIncepere: new Date("2024-06-20T12:00:00").toISOString(),
				oraTerminare: new Date("2024-06-20T13:40:00").toISOString(),
				titlu: "Billboard",
				codSalaSpectacol: 5,
				codSezon: 2,
				codTipSpectacol: 2,
			},
		});
	}

	async function createExchange() {
		const url = "https://www.bnr.ro/nbrfxrates.xml";
		const cursInstance = new CursBNR();
		await cursInstance.fetchAndParseXML(url);
		await cursInstance.saveToDatabase();
	}

	async function createRandomTickets() {
		const clienti = await prisma.client.findMany({
			include: {
				adreseFacturare: true,
			},
		});
		const numberOfTickets = 50;
		const spectacole = await prisma.spectacol.findMany({
			include: {
				salaSpectacol: true,
				tipSpectacol: true,
				sezon: true,
			},
		});
		const exchanges = await prisma.rataDeSchimbValutar.findMany();
		for (let i = 0; i < numberOfTickets; i++) {
			const spectacolAleatoriu =
				spectacole[Math.floor(Math.random() * spectacole.length)];
			const clientAleatoriu =
				clienti[Math.floor(Math.random() * clienti.length)];
			const locuriDisponibile = await getRandomAvailableSeats(
				spectacolAleatoriu.codSalaSpectacol
			);
			const creatPe = generateRandomDate();
			const numarLocuriAleatorii = Math.floor(Math.random() * 6) + 1;
			const locuriAleatorii = [];
			for (let i = 0; i < numarLocuriAleatorii; i++) {
				const locAleatoriu =
					locuriDisponibile[
						Math.floor(Math.random() * locuriDisponibile.length)
					];
				locuriAleatorii.push(locAleatoriu);
			}
			const pretTotal: number = locuriAleatorii.reduce(
				(prev, current) => prev + current.pretLoc,
				0
			);
			const randomRata = Math.floor(Math.random() * exchanges.length);
			const payment = await prisma.plata.create({
				data: {
					tipPlata: generateRandomPaymentType(),
					codClient: clientAleatoriu.codClient,
					codRataDeSchimbValutar: exchanges[randomRata].codRataValutar,
					sumaPlatita: pretTotal,
					platitPe: creatPe,
					starePlata: "ACCEPTATA",
					creatPe,
				},
			});
			const fiscal = await prisma.bonFiscal.create({
				data: {
					codPlata: payment.codPlata,
					codClient: clientAleatoriu.codClient,
					codSpectacol: spectacolAleatoriu.codSpectacol,
					numarBonFiscal: "#" + generateRandomString(6),
					creatPe,
				},
			});
			let codFactura = undefined;
			const adresa = clientAleatoriu.adreseFacturare[0];
			const name = adresa.adresa + ", " + adresa.oras + ", " + adresa.tara;
			if (generateRandomBoolean() == true) {
				const factura = await prisma.facturaFiscala.create({
					data: {
						adresaFacturare: name,
						email: clientAleatoriu.email,
						numeClient: clientAleatoriu.numeClient,
						codClient: clientAleatoriu.codClient,
						telefon: clientAleatoriu.telefon,
						numarFactura: generateRandomString(6),
						costuriExtra: 0,
						totalSumaPlatita: pretTotal,
						sumaPlatita: pretTotal,
						dataScadentei: creatPe,
						codBonFiscal: fiscal.codBonFiscal,
						codPlata: payment.codPlata,
						creatPe,
					},
				});
				codFactura = factura.codFactura;
			}
			for (const loc of locuriAleatorii) {
				await prisma.biletSpectacol.create({
					data: {
						biletVerificat: false,
						pretVanzare: loc.pretLoc,
						numarBilet: generateRandomString(5),
						codSpectacol: spectacolAleatoriu.codSpectacol,
						codClient: clientAleatoriu.codClient,
						codSalaSpectacol: spectacolAleatoriu.codSalaSpectacol,
						codLocSalaSpectacol: loc.codLocSalaSpectacol,
						codPlata: payment.codPlata,
						codFacturaFiscala: codFactura,
						codBonFiscal: fiscal.codBonFiscal,
						creatPe,
					},
				});
			}
		}
	}

	//await createExchange();
	//await generateClients(150);
	//await createShowRooms();
	await createShowRoomSeats();
	//await createSeasonAndType();
	//await createShows();
	//await createRandomTickets();

	///////////////////////////////////////////

	function generateRandomName() {
		const names = [
			"Maria",
			"Ion",
			"Elena",
			"Mihai",
			"Ana",
			"Alexandru",
			"Andreea",
			"Dragos",
			"Diana",
			"Cristian",
			"Laura",
			"Adrian",
			"Andreea",
			"George",
			"Raluca",
			"Cosmin",
			"Iulia",
			"Valentin",
			"Gabriela",
			"Sorin",
			"Simona",
			"Catalin",
			"Mihaela",
			"Bogdan",
			"Alina",
			"Daniel",
			"Monica",
			"Razvan",
			"Carmen",
		];
		const surnames = [
			"Popescu",
			"Ionescu",
			"Pop",
			"Stan",
			"Dumitru",
			"Stoica",
			"Gheorghe",
			"Florea",
			"Toma",
			"Dobre",
			"Dragomir",
			"Mocanu",
			"Oprea",
			"Constantin",
			"Voicu",
			"Munteanu",
			"Nistor",
			"Serban",
			"Georgescu",
			"Balan",
			"Stanciu",
			"Marin",
			"Dinu",
			"Stefan",
			"Costache",
		];
		const randomName = names[Math.floor(Math.random() * names.length)];
		const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
		return `${randomName} ${randomSurname}`;
	}

	function generateRandomPaymentType(): "CASH" | "CARD_CREDIT" {
		const paymentTypes = ["CASH", "CARD_CREDIT"];
		const randomIndex = Math.floor(Math.random() * paymentTypes.length);
		return paymentTypes[randomIndex] as "CASH" | "CARD_CREDIT";
	}

	function generateRandomDate() {
		const startDate = new Date("2024-01-01");
		const endDate = new Date();
		const start = new Date(startDate).getTime();
		const end = new Date(endDate).getTime();
		const randomTime = start + Math.random() * (end - start);
		return new Date(randomTime).toISOString();
	}

	function generateRandomAddress(city: City) {
		if (!addressesByCity.hasOwnProperty(city)) {
			throw new Error(`Orașul ${city} nu este suportat.`);
		}
		const streets = addressesByCity[city];
		const street = streets[Math.floor(Math.random() * streets.length)];
		const blockNumber = Math.floor(Math.random() * 100) + 1;
		return `${street} nr. ${blockNumber}`;
	}

	function generateRandomDateOfBirth() {
		const year = Math.floor(Math.random() * (2007 - 1950)) + 1950;
		const month = Math.floor(Math.random() * 12) + 1;
		const day = Math.floor(Math.random() * 30) + 1;
		return `${year}-${month
			.toString()
			.padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
	}

	function generateRandomCity() {
		const cities = [
			"București",
			"Cluj-Napoca",
			"Timișoara",
			"Iași",
			"Constanța",
			"Craiova",
			"Brașov",
			"Galați",
			"Ploiești",
			"Oradea",
			"Bacău",
			"Arad",
			"Pitești",
			"Sibiu",
			"Târgu Mureș",
			"Baia Mare",
			"Buzău",
		];
		return cities[Math.floor(Math.random() * cities.length)];
	}

	function generateRandomString(length: number) {
		let result = "";
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	function generateRandomPostalCode() {
		const postalCodes = [
			"010101",
			"020202",
			"030303",
			"040404",
			"050505",
			"060606",
			"070707",
			"080808",
			"090909",
			"101010",
			"202020",
			"303030",
			"404040",
			"505050",
			"606060",
			"707070",
			"808080",
			"909090",
			"111111",
			"121212",
		];
		return postalCodes[Math.floor(Math.random() * postalCodes.length)];
	}

	async function generateEmail(name: string): Promise<string> {
		const sanitizedName = name.toLowerCase().replace(/\s/g, "");
		const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
		const randomDomain = domains[Math.floor(Math.random() * domains.length)];
		let email = `${sanitizedName}${Math.floor(
			Math.random() * 100
		)}@${randomDomain}`;
		return (await emailExists(email)) ? generateEmail(name) : email;
	}

	async function emailExists(email: string) {
		const existingClient = await prisma.client.findFirst({
			where: {
				email,
			},
		});
		return existingClient !== null;
	}

	function generatePassword() {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const length = 12;
		let password = "";
		for (let i = 0; i < length; i++) {
			password += characters.charAt(
				Math.floor(Math.random() * characters.length)
			);
		}
		return password;
	}

	function generatePhoneNumber() {
		const firstDigit = Math.floor(Math.random() * 8) + 2; // Primul digit trebuie să fie între 2 și 9 pentru a respecta formatele de numere de telefon din România
		const restOfNumber = Math.floor(Math.random() * 1000000000)
			.toString()
			.padStart(9, "0");
		return `07${firstDigit}${restOfNumber}`;
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
