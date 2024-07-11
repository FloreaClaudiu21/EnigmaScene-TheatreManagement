import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { addDays, differenceInDays } from "date-fns";
const prisma = new PrismaClient();

async function main() {
  const algorithm = "aes-256-cbc";
  const secretKey = process.env.AUTH_SECRET ?? "";

  const encryptPassword = (parola: string) => {
    const cifru = crypto.createCipheriv(
      algorithm,
      secretKey,
      Buffer.alloc(16, 0)
    );
    let parolaCriptata = cifru.update(parola, "utf-8", "hex");
    parolaCriptata += cifru.final("hex");
    return parolaCriptata;
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

  function generateRandomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

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
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
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
    const firstDigit = Math.floor(Math.random() * 8) + 2;
    const restOfNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(7, "0");
    return `+4007${firstDigit}${restOfNumber}`;
  }

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

  ///////////////////////////////////////////////////

  const generateClients = async (count: number) => {
    await prisma.client.deleteMany();
    const numClients = count;
    const currentDate = new Date();
    const startDate = new Date("2024-01-01");
    const daysDifference = differenceInDays(currentDate, startDate);
    await prisma.client.create({
      data: {
        numeClient: "Florea Claudiu",
        email: "floreaclaudiu128@gmail.com",
        parola: encryptPassword("Claudiu123@"),
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
    await prisma.salaSpectacol.deleteMany();
    const saliDeSpectacol = ["A1", "B2", "C3", "D4", "E5", "F6", "G7"];
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
    console.log("Seed Locuri sala terminat.");
  }

  async function createSeasonAndType() {
    await prisma.spectacol.deleteMany();
    await prisma.sezon.deleteMany();
    await prisma.tipSpectacol.deleteMany();
    ///////////////////////////////////////
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
        oraIncepere: new Date("2024-07-20T12:00:00").toISOString(),
        oraTerminare: new Date("2024-07-20T13:40:00").toISOString(),
        titlu: "Billboard",
        codSalaSpectacol: 5,
        codSezon: 2,
        codTipSpectacol: 2,
      },
    });
    await prisma.spectacol.create({
      data: {
        director: "Bogdan Budeș",
        descriereScurta:
          "Don Dubrow, proprietarul unui magazin de vechituri, vrea să fure colecția de monede a unui client care, crede Don, l-a înșelat la cumpărarea unei monede cu cap de bizon. Complicele său e Bobby, băiatul de prăvălie bun la toate, dar la care renunță cînd Teach, un prieten manipulator, îl convinge că Bobby este incompetent.",
        actorii: "Angel Popescu, George Constantinescu, Ștefan Iancu",
        continut:
          "Într-o cronică pentru The New York Times a punerii în scenă din 1983, de pe Broadway, criticul Frank Rich, a numit-o „una dintre cele mai bune piese americane din ultimul deceniu.” Tot el scrisese și despre producția din 1981, numind piesa „genială” și notând: „Textul, totuși, este elementul central. Lucrând cu cel mai mic vocabular imaginabil – cuvinte precum nimic, grozav și nu, precum și cele “din patru litere” – domnul Mamet creează o lume subterană cu propriile ei benzi desenate nealfabetizate: lupte pe viață și pe moarte, patos și chiar afecțiune. În American Buffalo, el a creat o înșelătoare tragedie la scară mică, care are puterea de a face să explodeze cel mai mare dintre miturile americane.”",
        imagine:
          "https://mystage-static.starter.ro/files/342b6175715678661e0e619ca2112b388efd3edd_b4.jpg",
        oraIncepere: new Date("2024-07-15T10:00:00").toISOString(),
        oraTerminare: new Date("2024-07-15T13:50:00").toISOString(),
        titlu: "American Buffalo",
        codSalaSpectacol: 3,
        codSezon: 2,
        codTipSpectacol: 1,
      },
    });
    await prisma.spectacol.create({
      data: {
        director: "Laura Ducu",
        descriereScurta:
          "Un spectacol pasional și surprinzător despre căsătorie și parenting în epoca modernă, plin de note comice și emoții pe care le vei (re)trăi intens.",
        actorii: "Teodora Daiana, Păcurar Tamara Roman",
        continut:
          "Are 10 ani, deranjează la ore, intră neinvitată în curțile oamenilor, citește cărți nepotrivite pentru vârsta ei și apoi le împrumută colegilor. Dar comportamentul și deciziile CUI sunt judecate cu adevărat? O mamă și un tată se pregătesc de ședința cu părinții de la școala fiicei lor, prilej cu care relația le este testată în moduri neașteptate. Intens, pasional și surprinzător, „Ședință cu părinții” este un spectacol despre căsătorie și parenting în epoca modernă, în care listele nesfârșite de to-do, așteptările societății, teoriile specialiștilor și nevoile proprii se împletesc furtunos până în punctul în care nu mai știm când și ce pierdem. Din vedere sau chiar din propria viață.",
        imagine:
          "https://mystage-static.starter.ro/files/de3a4486d06fbf7ba9a891733e5b267256cbce6e_b4.jpg",
        oraIncepere: new Date("2024-07-12T15:00:00").toISOString(),
        oraTerminare: new Date("2024-07-12T17:00:00").toISOString(),
        titlu: "ȘEDINȚĂ CU PĂRINȚII",
        codSalaSpectacol: 1,
        codSezon: 2,
        codTipSpectacol: 2,
      },
    });
    await prisma.spectacol.create({
      data: {
        director: "Vladimir Turturica",
        descriereScurta:
          "Bubu este simbolul educației culturale timpurii și cel mai bun prieten al celor mici. Experiența dobândită alături de cei peste 22 000 de spectatori care au luat parte activ la spectacolele „Bubu și anotimpurile”, „Bubu la Zoo” și “Bubu si fulgii de nea” ne ajută în realizarea premierei de anul acesta, „Bubu la mare”.",
        actorii: "Andreea Soare, Irina Furdui",
        continut:
          "Vom păstra același tip de spectacol care i-a cucerit pe cei mici: o călătorie muzicală multi-senzorială, într-un spațiu sigur pentru copii, cu un decor conceput special pentru a le oferi libertate de mișcare, un scenariu ce le dezvoltă inteligența emotională și pune la dispoziția părinților un set de jocuri cu care pot continua educația acasă. Toate acestea sunt realizate prin contribuția unei echipe de specialiști în artele spectacolului, mișcare, psihologie și pedagogie.",
        imagine:
          "https://mystage-static.starter.ro/files/acf058fa5aa31ba289a01c2e9a88a8b4f18d3811_b4.jpg",
        oraIncepere: new Date("2024-07-12T11:00:00").toISOString(),
        oraTerminare: new Date("2024-07-12T12:00:00").toISOString(),
        titlu: "Bubu la mare",
        codSalaSpectacol: 2,
        codSezon: 2,
        codTipSpectacol: 5,
      },
    });
    await prisma.spectacol.create({
      data: {
        director: "Cristian Mihăilescu",
        descriereScurta:
          "„Directorul de teatru” este o adaptare a operei comice cu același nume, care a fost compusă de faimosul W. A. Mozart. Inițial, opera a fost scrisă la comanda împăratului Joseph al II-lea, pentru a fi pusă în scenă la un prânz privat, în fața a 80 de invitați. Lucrarea este considerată o parodie a vanității cântăreților de operă, care se luptă pentru a avea un statut cât mai înalt și o plată pe măsură. Opera originală este destul scurtă, având aproximativ 35 de minute, însă regizorul Cristian Mihăilescu a venit cu o serie de completări ingenioase, care vor prelungi bucuria spectatorilor.",
        actorii: "Andreea Soare, Irina Furdui",
        continut:
          "Personajul central este un director de teatru, care, asistat de Buffo, cântărețul comic, organizează audiții pentru alcătuirea unei trupe de operă. Primele două pretendente la angajare sunt doamnele Hertz (Doamna Inimă) și Silberklang (Doamna Sunet de Argint), care își dispută întâietatea pentru obținerea rolului principal și, implicit, a salariului mai mare. Opera Comică pentru Copii a avut cu ceva timp în urmă o inițiativă strălucită: turul ghidat în spatele cortinei. Cu acest prilej, copiii au descoperit culisele, studioul de balet, sălile de repetiție, și, în fine, locul sacru: scena. Spectacolul „Directorul de teatru” este o prelungire a acestui demers. Cu ajutorul muzicii lui Mozart, neasemuit de frumoasă, dar și al textului savuros și plin de viață, aflăm meandrele ce duc la realizarea unui spectacol. Vă invit să faceți parte din distribuția acestuia. Regizorul vă așteaptă.",
        imagine:
          "https://mystage-static.starter.ro/files/acf058fa5aa31ba289a01c2e9a88a8b4f18d3811_b4.jpg",
        oraIncepere: new Date("2024-09-17T12:00:00").toISOString(),
        oraTerminare: new Date("2024-09-17T13:30:00").toISOString(),
        titlu: "Directorul de teatru - Opera Comică pentru Copii",
        codSalaSpectacol: 4,
        codSezon: 3,
        codTipSpectacol: 2,
      },
    });
    console.log("Seed Spectacole terminat.");
  }

  async function createRandomTickets() {
    let createdTickets = 0;
    const numberOfTickets = 100;
    const clienti = await prisma.client.findMany({
      include: {
        adreseFacturare: true,
      },
    });
    const spectacole = await prisma.spectacol.findMany({
      include: {
        salaSpectacol: true,
        tipSpectacol: true,
        sezon: true,
      },
    });
    const endDate = new Date("2024-07-11");
    const startDate = new Date("2024-01-01");
    for (let i = 0; i < numberOfTickets; i++) {
      const spectacolAleatoriu =
        spectacole[Math.floor(Math.random() * spectacole.length)];
      const clientAleatoriu =
        clienti[Math.floor(Math.random() * clienti.length)];
      const adresa = clientAleatoriu.adreseFacturare[0];
      if (!adresa) continue;
      const locuriDisponibile = await getRandomAvailableSeats(
        spectacolAleatoriu.codSalaSpectacol
      );
      const creatPe = generateRandomDate(startDate, endDate);
      const numarLocuriAleatorii = Math.floor(Math.random() * 6) + 1;
      const locuriAleatorii: any[] = [];
      for (let j = 0; j < numarLocuriAleatorii; j++) {
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
      const payment = await prisma.plata.create({
        data: {
          tipPlata: generateRandomPaymentType(),
          codClient: clientAleatoriu.codClient,
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
      let codFactura: number | undefined = undefined;
      const name = `${adresa.adresa}, ${adresa.oras}, ${adresa.tara}`;
      if (generateRandomBoolean()) {
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
        await prisma.biletSpectacol.createMany({
          data: {
            biletVerificat: false,
            pretVanzare: loc.pretLoc,
            numarBilet: generateRandomString(5),
            codClient: clientAleatoriu.codClient,
            codSalaSpectacol: spectacolAleatoriu.codSalaSpectacol,
            codLocSalaSpectacol: loc.codLocSala,
            codSpectacol: spectacolAleatoriu.codSpectacol,
            codPlata: payment.codPlata,
            codFacturaFiscala: codFactura,
            codBonFiscal: fiscal.codBonFiscal,
            creatPe,
          },
        });
        createdTickets += 1;
      }
    }
    console.log("Seed TICKETS terminat." + createdTickets);
  }

  await generateClients(50);
  await createShowRooms();
  await createShowRoomSeats();
  await createSeasonAndType();
  await createShows();
  await createRandomTickets();
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
