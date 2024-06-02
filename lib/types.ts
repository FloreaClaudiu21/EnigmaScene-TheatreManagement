import { StarePlata, TipPlata } from "@prisma/client";
import { Client, Session } from "next-auth";

export enum ChartTip {
	DONUT = "DONUT",
	BAR = "BAR",
	LINE = "LINE",
}

export type FilterParams = {
	column: string;
	label: string;
	value: string;
	page: string;
};

export const ChartComponentMap = (tip: ChartTip) => {};

export enum ChartDataTip {
	TOTAL_SALES,
	TOTAL_USERS,
	TICKETS_SOLD,
}

export type ChartDataType = {
	data: {
		nameKey: any;
		dataKey: any;
	}[];
};

export enum TipuriTabel {
	CLIENT = "Client",
	SPECTACOL = "Spectacol",
	SPECTACOL_CATEGORIE = "Categorie Spectacol",
	SPECTACOL_SEZON = "Sezon Spectacol",
	CAMERA_SPECTACOL = "Camera Spectacol",
	SCAUN_CAMERA_SPECTACOL = "Scaun Camera Spectacol",
	BILET = "Bilet Vandut",
	PLATA = "Plata",
	BON_FISCAL = "Bon Fiscal",
	FACTURA_FISCALA = "Factura Fiscala",
}

export type SessionAuth = {
	session: Session | null;
	user: Client | null;
	firstTime: boolean;
	isLogged: boolean;
};

export type SignInProviderParams = {
	url: string;
	linkWith: string;
	response?: MailSendResponse;
};

export type RegisterData = {
	email: string;
	parola: string;
	numeClient: string;
	telefon: string;
	prefix: string;
	dataNasterii: string;
};

export type DecryptSignatureResponse = {
	ok: boolean;
	status: number;
	data: {
		email: string;
		expiresAt: string;
		sendFromURL: string | null;
	};
};

export type MailSendResponse = {
	ok: boolean;
	status: number;
	message: string;
};

export type verifyPasswordResetResponse = {
	user: string | null;
	redirectURL: string | null;
} & MailSendResponse;

export const coduriTariRomanesti = [
	["Afganistan", "+93"],
	["Albania", "+355"],
	["Algeria", "+213"],
	["Andorra", "+376"],
	["Angola", "+244"],
	["Antigua și Barbuda", "+1-268"],
	["Argentina", "+54"],
	["Armenia", "+374"],
	["Australia", "+61"],
	["Austria", "+43"],
	["Azerbaidjan", "+994"],
	["Bahamas", "+1-242"],
	["Bahrain", "+973"],
	["Bangladesh", "+880"],
	["Barbados", "+1-246"],
	["Belarus", "+375"],
	["Belgia", "+32"],
	["Belize", "+501"],
	["Benin", "+229"],
	["Bhutan", "+975"],
	["Bolivia", "+591"],
	["Bosnia și Herțegovina", "+387"],
	["Botswana", "+267"],
	["Brazilia", "+55"],
	["Brunei", "+673"],
	["Bulgaria", "+359"],
	["Burkina Faso", "+226"],
	["Burundi", "+257"],
	["Cabo Verde", "+238"],
	["Cambodgia", "+855"],
	["Camerun", "+237"],
	["Canada", "+1"],
	["Republica Centrafricană", "+236"],
	["Ciad", "+235"],
	["Chile", "+56"],
	["China", "+86"],
	["Columbia", "+57"],
	["Comore", "+269"],
	["Costa Rica", "+506"],
	["Croația", "+385"],
	["Cuba", "+53"],
	["Cipru", "+357"],
	["Republica Cehă", "+420"],
	["Danemarca", "+45"],
	["Djibouti", "+253"],
	["Dominica", "+1-767"],
	["Ecuador", "+593"],
	["Egipt", "+20"],
	["El Salvador", "+503"],
	["Guineea Ecuatorială", "+240"],
	["Eritreea", "+291"],
	["Estonia", "+372"],
	["Swaziland", "+268"],
	["Etiopia", "+251"],
	["Fiji", "+679"],
	["Finlanda", "+358"],
	["Franța", "+33"],
	["Gabon", "+241"],
	["Gambia", "+220"],
	["Georgia", "+995"],
	["Germania", "+49"],
	["Ghana", "+233"],
	["Grecia", "+30"],
	["Grenada", "+1-473"],
	["Guatemala", "+502"],
	["Guineea", "+224"],
	["Guineea-Bissau", "+245"],
	["Guyana", "+592"],
	["Haiti", "+509"],
	["Honduras", "+504"],
	["Ungaria", "+36"],
	["Islanda", "+354"],
	["India", "+91"],
	["Indonezia", "+62"],
	["Iran", "+98"],
	["Irak", "+964"],
	["Irlanda", "+353"],
	["Israel", "+972"],
	["Italia", "+39"],
	["Jamaica", "+1-876"],
	["Japonia", "+81"],
	["Iordania", "+962"],
	["Kazakhstan", "+7"],
	["Kenya", "+254"],
	["Kiribati", "+686"],
	["Kuweit", "+965"],
	["Kirghizstan", "+996"],
	["Laos", "+856"],
	["Letonia", "+371"],
	["Liban", "+961"],
	["Lesotho", "+266"],
	["Liberia", "+231"],
	["Libia", "+218"],
	["Liechtenstein", "+423"],
	["Lituania", "+370"],
	["Luxemburg", "+352"],
	["Madagascar", "+261"],
	["Malawi", "+265"],
	["Malaezia", "+60"],
	["Maldive", "+960"],
	["Mali", "+223"],
	["Malta", "+356"],
	["Insulele Marshall", "+692"],
	["Mauritania", "+222"],
	["Mauritius", "+230"],
	["Mexic", "+52"],
	["Micronezia", "+691"],
	["Moldova", "+373"],
	["Monaco", "+377"],
	["Mongolia", "+976"],
	["Muntenegru", "+382"],
	["Maroc", "+212"],
	["Mozambic", "+258"],
	["Myanmar", "+95"],
	["Namibia", "+264"],
	["Nauru", "+674"],
	["Nepal", "+977"],
	["Olanda", "+31"],
	["Noua Zeelandă", "+64"],
	["Nicaragua", "+505"],
	["Niger", "+227"],
	["Nigeria", "+234"],
	["Coreea de Nord", "+850"],
	["Macedonia de Nord", "+389"],
	["Norvegia", "+47"],
	["Oman", "+968"],
	["Pakistan", "+92"],
	["Palau", "+680"],
	["Panama", "+507"],
	["Papua Noua Guinee", "+675"],
	["Paraguay", "+595"],
	["Peru", "+51"],
	["Filipine", "+63"],
	["Polonia", "+48"],
	["Portugalia", "+351"],
	["Qatar", "+974"],
	["România", "+40"],
	["Rusia", "+7"],
	["Rwanda", "+250"],
	["Sfântul Kitts și Nevis", "+1-869"],
	["Sfânta Lucia", "+1-758"],
	["Sfântul Vicențiu și Grenadinele", "+1-784"],
	["Samoa", "+685"],
	["San Marino", "+378"],
	["São Tomé și Príncipe", "+239"],
	["Arabia Saudită", "+966"],
	["Senegal", "+221"],
	["Serbia", "+381"],
	["Seychelles", "+248"],
	["Sierra Leone", "+232"],
	["Singapore", "+65"],
	["Slovacia", "+421"],
	["Slovenia", "+386"],
	["Insulele Solomon", "+677"],
	["Somalia", "+252"],
	["Africa de Sud", "+27"],
	["Coreea de Sud", "+82"],
	["Sudanul de Sud", "+211"],
	["Spania", "+34"],
	["Sri Lanka", "+94"],
	["Sudan", "+249"],
	["Suriname", "+597"],
	["Suedia", "+46"],
	["Elveția", "+41"],
	["Siria", "+963"],
	["Taiwan", "+886"],
	["Tajikistan", "+992"],
	["Tanzania", "+255"],
	["Thailanda", "+66"],
	["Timorul de Est", "+670"],
	["Togo", "+228"],
	["Tonga", "+676"],
	["Trinidad și Tobago", "+1-868"],
	["Tunisia", "+216"],
	["Turcia", "+90"],
	["Turkmenistan", "+993"],
	["Tuvalu", "+688"],
	["Uganda", "+256"],
	["Ucraina", "+380"],
	["Emiratele Arabe Unite", "+971"],
	["Regatul Unit", "+44"],
	["Statele Unite ale Americii", "+1"],
	["Uruguay", "+598"],
	["Uzbekistan", "+998"],
	["Vanuatu", "+678"],
	["Vatican", "+379"],
	["Venezuela", "+58"],
	["Vietnam", "+84"],
	["Yemen", "+967"],
	["Zambia", "+260"],
	["Zimbabwe", "+263"],
];

export type AssociatedAccountData = {
	isMain: boolean;
	provider: Provider;
};

export type PartialClient = {
	codPartialClient: string;
	provider: string;
	providerContCod: string;
	numeProvider: string;
	numeClient: string;
	email: string;
};

export type Provider = {
	codProvider: number;
	numeProvider: string;
	asociatCu: string;
	creatPe: Date;
	actualizatPe: Date;
	providerContCod: string;
	providerEmail: string;
	providerContNume: string;
	client?: Client | null;
	codClient: number;
};

export type AdresaFacturare = {
	codAdresa: number;
	tara: string;
	oras: string;
	adresa: string;
	codPostal: string;
	observatii?: string;
	client?: Client | null;
	codClient: number;
};

export type Spectacol = {
	codSpectacol: number;
	imagine: string;
	titlu: string;
	oraIncepere: string;
	oraTerminare: string;
	director: string;
	actorii: string;
	creatPe: Date;
	actualizatPe: Date;
	descriereScurta: string;
	continut: string;
	sezon?: Sezon | null;
	codSezon: number;
	tipSpectacol?: TipSpectacol | null;
	codTipSpectacol: number;
	salaSpectacol?: SalaSpectacol | null;
	codSalaSpectacol: number;
	bileteVandute?: BiletSpectacol[] | null;
	bonuriFiscale?: BonFiscal[] | null;
};

export type TipSpectacol = {
	codTipSpectacol: number;
	numeTip: string;
	creatPe: Date;
	actualizatPe: Date;
	spectacole?: Spectacol[] | null;
};

export type Sezon = {
	codSezon: number;
	numeSezon: string;
	creatPe: Date;
	actualizatPe: Date;
	spectacole?: Spectacol[] | null;
};

export type SalaSpectacol = {
	codSalaSpectacol: number;
	numarSala: string;
	observatii?: string | null;
	creatPe: Date;
	actualizatPe: Date;
	locuriSala?: LocSalaSpectacol[] | null;
	bileteVandute?: BiletSpectacol[] | null;
	spectacole?: Spectacol[] | null;
};

export type LocSalaSpectacol = {
	codLocSala: number;
	tipLoc: string;
	pretLoc: number;
	rand: string;
	numarLoc: string;
	salaSpectacol?: SalaSpectacol | null;
	codSalaSpectacol: number;
	creatPe: Date;
	actualizatPe: Date;
	bileteVandute?: BiletSpectacol[] | null;
};

export type BiletSpectacol = {
	codBiletSpectacol: number;
	pretVanzare: number;
	numarBilet: string;
	biletVerificat: boolean;
	spectacol?: Spectacol | null;
	codSpectacol: number;
	client?: Client | null;
	codClient: number;
	salaSpectacol?: SalaSpectacol | null;
	codSalaSpectacol: number;
	locSalaSpectacol?: LocSalaSpectacol | null;
	codLocSalaSpectacol: number;
	plata?: Plata | null;
	codPlata: number;
	creatPe: Date;
	actualizatPe: Date;
	bonFiscal?: BonFiscal | null;
	factura?: FacturaFiscala | null;
	codBonFiscal?: number | null;
	codFacturaFiscala?: number | null;
};

export type BileteAchizitionate = {
	pretTotal: number;
	numarLocuri: number;
	locuriAlese: LocSalaSpectacol[];
};

export type Plata = {
	codPlata: number;
	sumaPlatita: number;
	platitPe: Date;
	tipPlata: TipPlata;
	starePlata: StarePlata;
	creatPe: Date;
	actualizatPe: Date;
	client?: Client | null;
	codClient: number;
	bileteAsociate?: BiletSpectacol[] | null;
	bonFiscal?: BonFiscal | null;
	factura?: FacturaFiscala | null;
};

export type BonFiscal = {
	codBonFiscal: number;
	numarBonFiscal: string;
	serieBonFiscal: string;
	creatPe: Date;
	actualizatPe: Date;
	spectacol?: Spectacol | null;
	codSpectacol: number;
	plata?: Plata | null;
	codPlata: number;
	client?: Client | null;
	codClient: number;
	factura?: FacturaFiscala | null;
	bileteSpectacol?: BiletSpectacol[] | null;
};

export type FacturaFiscala = {
	codFactura: number;
	serieFactura: string;
	numarFactura: string;
	dataIntocmiri: Date;
	dataScadentei: Date;
	sumaPlatita: number;
	costuriExtra: number;
	totalSumaPlatita: number;
	creatPe: Date;
	actualizatPe: Date;
	adresaFacturare: string;
	numeClient: string;
	telefon: string;
	email: string;
	client?: Client | null;
	codClient: number;
	plata?: Plata | null;
	codPlata: number;
	bonFiscal?: BonFiscal | null;
	codBonFiscal: number;
	bileteSpectacol?: BiletSpectacol[] | null;
};

export enum LocSalaSpectacolCategorie {
	STANDARD = "Standard",
	PREMIUM = "Premium",
	VIP = "VIP",
}

export const categoriLocuriSala: LocSalaSpectacolCategorie[] = [
	LocSalaSpectacolCategorie.STANDARD,
	LocSalaSpectacolCategorie.PREMIUM,
	LocSalaSpectacolCategorie.VIP,
];

export const listaTipPlata = Object.values(TipPlata);
