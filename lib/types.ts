import { Client } from "next-auth";
import { PaymentStatus, PaymentType } from "@prisma/client";
import { Locale } from "@/i18n.config";

export enum TableTypes {
	CLIENT = "Client",
	SHOW = "Show",
	SHOW_CATEGORY = "Show Category",
	SHOW_SEASON = "Show Season",
	SHOWROOM = "Show Room",
	SHOWROOM_SEAT = "Show Room Seat",
	TICKET_SOLD = "Ticket",
	TICKET_VERIFIED = "Ticket Verified",
	MATERIAL = "Decoration Material",
	MATERIAL_USED = "Decoration Material Used",
	MATERIAL_CATEGORY = "Decoration Material Category",
	PAYMENT = "Payment",
	FISCAL_RECEIPT = "Fiscal Receipt",
	INVOICE = "Invoice",
}

export type BuySession = {
	token: string;
	userId: string;
	showId: string;
};

export type SignInProviderParams = {
	url: string;
	linkWith: string;
	response?: MailSendResponse;
};

export type SelectedFilters = {
	page: number;
	models: string[];
	manufacturers: string[];
	locationType: string[];
	fuelPolicy: string[];
	categories: string[];
	fuelTypes: string[];
	transmissions: string[];
	specs: string[];
	doors?: string | null;
	seats?: string | null;
	ratings?: string | null;
};

export const defaultFilters = {
	categories: [],
	fuelPolicy: [],
	fuelTypes: [],
	manufacturers: [],
	locationType: [],
	specs: [],
	models: [],
	transmissions: [],
	page: 1,
} as SelectedFilters;

export type RegisterData = {
	email: string;
	firstName: string;
	password: string;
	lastName: string;
	phone: string;
	birthDate: string;
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

export type RegisterResponse = {
	ok: boolean;
	error: string;
	status: number;
	client: Client | undefined;
};

export type ResetPasswordResponse = {} & RegisterResponse;

export const menuItems = ["Inchiriere Auto", "Servicii", "FAQ", "Despre Noi"];

export const countries: string[] = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"Andorra",
	"Angola",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bhutan",
	"Bolivia",
	"Bosnia and Herzegovina",
	"Botswana",
	"Brazil",
	"Brunei",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Central African Republic",
	"Chad",
	"Chile",
	"China",
	"Colombia",
	"Comoros",
	"Congo",
	"Costa Rica",
	"Croatia",
	"Cuba",
	"Cyprus",
	"Czech Republic",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Fiji",
	"Finland",
	"France",
	"Gabon",
	"Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Greece",
	"Grenada",
	"Guatemala",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Honduras",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran",
	"Iraq",
	"Ireland",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Korea, North",
	"Korea, South",
	"Kosovo",
	"Kuwait",
	"Kyrgyzstan",
	"Laos",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands",
	"Mauritania",
	"Mauritius",
	"Mexico",
	"Micronesia",
	"Moldova",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"North Macedonia",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Poland",
	"Portugal",
	"Qatar",
	"Romania",
	"Russia",
	"Rwanda",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"Sudan",
	"Suriname",
	"Sweden",
	"Switzerland",
	"Syria",
	"Taiwan",
	"Tajikistan",
	"Tanzania",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom",
	"United States",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Vatican City",
	"Venezuela",
	"Vietnam",
	"Yemen",
	"Zambia",
	"Zimbabwe",
];

export const currencyMap = new Map<string, string>([
	["Euro", "EUR"],
	["Great British Pound", "GBP"],
	["Romanian Leu", "RON"],
	["United States Dollar", "USD"],
]);

export const currencyArray: [string, string][] = Array.from(
	currencyMap.entries()
);

export const mapLanguage = {
	en: {
		text: "English",
	},
	ro: {
		text: "Romanian",
	},
};

export const countryCodesArray: [string, string][] = [
	["Afghanistan", "+93"],
	["Albania", "+355"],
	["Algeria", "+213"],
	["Andorra", "+376"],
	["Angola", "+244"],
	["Antigua and Barbuda", "+1-268"],
	["Argentina", "+54"],
	["Armenia", "+374"],
	["Australia", "+61"],
	["Austria", "+43"],
	["Azerbaijan", "+994"],
	["Bahamas", "+1-242"],
	["Bahrain", "+973"],
	["Bangladesh", "+880"],
	["Barbados", "+1-246"],
	["Belarus", "+375"],
	["Belgium", "+32"],
	["Belize", "+501"],
	["Benin", "+229"],
	["Bhutan", "+975"],
	["Bolivia", "+591"],
	["Bosnia and Herzegovina", "+387"],
	["Botswana", "+267"],
	["Brazil", "+55"],
	["Brunei", "+673"],
	["Bulgaria", "+359"],
	["Burkina Faso", "+226"],
	["Burundi", "+257"],
	["Cabo Verde", "+238"],
	["Cambodia", "+855"],
	["Cameroon", "+237"],
	["Canada", "+1"],
	["Central African Republic", "+236"],
	["Chad", "+235"],
	["Chile", "+56"],
	["China", "+86"],
	["Colombia", "+57"],
	["Comoros", "+269"],
	["Costa Rica", "+506"],
	["Croatia", "+385"],
	["Cuba", "+53"],
	["Cyprus", "+357"],
	["Czech Republic", "+420"],
	["Denmark", "+45"],
	["Djibouti", "+253"],
	["Dominica", "+1-767"],
	["Ecuador", "+593"],
	["Egypt", "+20"],
	["El Salvador", "+503"],
	["Equatorial Guinea", "+240"],
	["Eritrea", "+291"],
	["Estonia", "+372"],
	["Eswatini", "+268"],
	["Ethiopia", "+251"],
	["Fiji", "+679"],
	["Finland", "+358"],
	["France", "+33"],
	["Gabon", "+241"],
	["Gambia", "+220"],
	["Georgia", "+995"],
	["Germany", "+49"],
	["Ghana", "+233"],
	["Greece", "+30"],
	["Grenada", "+1-473"],
	["Guatemala", "+502"],
	["Guinea", "+224"],
	["Guinea-Bissau", "+245"],
	["Guyana", "+592"],
	["Haiti", "+509"],
	["Honduras", "+504"],
	["Hungary", "+36"],
	["Iceland", "+354"],
	["India", "+91"],
	["Indonesia", "+62"],
	["Iran", "+98"],
	["Iraq", "+964"],
	["Ireland", "+353"],
	["Israel", "+972"],
	["Italy", "+39"],
	["Jamaica", "+1-876"],
	["Japan", "+81"],
	["Jordan", "+962"],
	["Kazakhstan", "+7"],
	["Kenya", "+254"],
	["Kiribati", "+686"],
	["Kuwait", "+965"],
	["Kyrgyzstan", "+996"],
	["Laos", "+856"],
	["Latvia", "+371"],
	["Lebanon", "+961"],
	["Lesotho", "+266"],
	["Liberia", "+231"],
	["Libya", "+218"],
	["Liechtenstein", "+423"],
	["Lithuania", "+370"],
	["Luxembourg", "+352"],
	["Madagascar", "+261"],
	["Malawi", "+265"],
	["Malaysia", "+60"],
	["Maldives", "+960"],
	["Mali", "+223"],
	["Malta", "+356"],
	["Marshall Islands", "+692"],
	["Mauritania", "+222"],
	["Mauritius", "+230"],
	["Mexico", "+52"],
	["Micronesia", "+691"],
	["Moldova", "+373"],
	["Monaco", "+377"],
	["Mongolia", "+976"],
	["Montenegro", "+382"],
	["Morocco", "+212"],
	["Mozambique", "+258"],
	["Myanmar", "+95"],
	["Namibia", "+264"],
	["Nauru", "+674"],
	["Nepal", "+977"],
	["Netherlands", "+31"],
	["New Zealand", "+64"],
	["Nicaragua", "+505"],
	["Niger", "+227"],
	["Nigeria", "+234"],
	["North Korea", "+850"],
	["North Macedonia", "+389"],
	["Norway", "+47"],
	["Oman", "+968"],
	["Pakistan", "+92"],
	["Palau", "+680"],
	["Panama", "+507"],
	["Papua New Guinea", "+675"],
	["Paraguay", "+595"],
	["Peru", "+51"],
	["Philippines", "+63"],
	["Poland", "+48"],
	["Portugal", "+351"],
	["Qatar", "+974"],
	["Romania", "+40"],
	["Russia", "+7"],
	["Rwanda", "+250"],
	["Saint Kitts and Nevis", "+1-869"],
	["Saint Lucia", "+1-758"],
	["Saint Vincent and the Grenadines", "+1-784"],
	["Samoa", "+685"],
	["San Marino", "+378"],
	["Sao Tome and Principe", "+239"],
	["Saudi Arabia", "+966"],
	["Senegal", "+221"],
	["Serbia", "+381"],
	["Seychelles", "+248"],
	["Sierra Leone", "+232"],
	["Singapore", "+65"],
	["Slovakia", "+421"],
	["Slovenia", "+386"],
	["Solomon Islands", "+677"],
	["Somalia", "+252"],
	["South Africa", "+27"],
	["South Korea", "+82"],
	["South Sudan", "+211"],
	["Spain", "+34"],
	["Sri Lanka", "+94"],
	["Sudan", "+249"],
	["Suriname", "+597"],
	["Sweden", "+46"],
	["Switzerland", "+41"],
	["Syria", "+963"],
	["Taiwan", "+886"],
	["Tajikistan", "+992"],
	["Tanzania", "+255"],
	["Thailand", "+66"],
	["Timor-Leste", "+670"],
	["Togo", "+228"],
	["Tonga", "+676"],
	["Trinidad and Tobago", "+1-868"],
	["Tunisia", "+216"],
	["Turkey", "+90"],
	["Turkmenistan", "+993"],
	["Tuvalu", "+688"],
	["Uganda", "+256"],
	["Ukraine", "+380"],
	["United Arab Emirates", "+971"],
	["United Kingdom", "+44"],
	["United States", "+1"],
	["Uruguay", "+598"],
	["Uzbekistan", "+998"],
	["Vanuatu", "+678"],
	["Vatican City", "+379"],
	["Venezuela", "+58"],
	["Vietnam", "+84"],
	["Yemen", "+967"],
	["Zambia", "+260"],
	["Zimbabwe", "+263"],
];

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

type FAQ = {
	question: string;
	answer: string;
};

export const HomeFaqs: FAQ[] = [
	{
		question:
			"What types of vehicles does Euro Cars Business offer for rental?",
		answer:
			"Euro Cars Business offers a wide range of vehicles, including compact cars, sedans, SUVs, luxury cars, and premium vehicles.",
	},
	{
		question: "Do you provide both short-term and long-term rental options?",
		answer:
			"Yes, we offer both short-term and long-term rental options to cater to various customer needs and durations of use.",
	},
	{
		question: "What are your requirements for renting a car?",
		answer:
			"To rent a car from Euro Cars Business, you typically need a valid driver's license, a credit card for payment and deposit, and meeting the minimum age requirement, usually 21 years old.",
	},
	{
		question: "Do you offer delivery and pick-up services for rental cars?",
		answer:
			"Yes, we provide delivery and pick-up services for rental cars, making the rental process more convenient for our customers. Additional charges may apply based on location and distance.",
	},
	{
		question:
			"Are there any age restrictions for renting a car from Euro Cars Business?",
		answer:
			"Yes, the minimum age requirement to rent a car from Euro Cars Business is typically 21 years old. However, specific age restrictions may vary depending on the location and type of vehicle.",
	},
	{
		question: "What insurance options do you offer for rental cars?",
		answer:
			"We offer various insurance options, including collision damage waiver (CDW), theft protection, and liability coverage. Customers can choose the insurance package that best suits their needs.",
	},
	{
		question: "Do you have any special discounts or promotions available?",
		answer:
			"Yes, we frequently offer special discounts and promotions on our rental cars. Customers can check our website or contact us directly for current offers.",
	},
	{
		question: "What happens if I need to extend my rental period?",
		answer:
			"If you need to extend your rental period, please contact our customer service team as soon as possible. We will do our best to accommodate your request, subject to vehicle availability.",
	},
	{
		question:
			"Are there any additional fees or charges not included in the rental price?",
		answer:
			"Additional fees or charges may include taxes, surcharges, optional insurance coverage, fuel, and additional equipment or accessories. These will be clearly outlined in the rental agreement.",
	},
	{
		question:
			"Do you offer GPS navigation systems or other add-on accessories?",
		answer:
			"Yes, we offer GPS navigation systems, child seats, and other add-on accessories for an additional fee. These can be requested at the time of booking or pickup.",
	},
	{
		question: "What is your policy on fueling the rental car upon return?",
		answer:
			"We require customers to return the rental car with the same level of fuel as when it was picked up. Failure to do so may result in additional refueling charges.",
	},
	{
		question:
			"What should I do in case of a breakdown or accident with the rental car?",
		answer:
			"In case of a breakdown or accident, please contact our 24/7 roadside assistance hotline immediately for guidance and support. We will assist you in arranging repairs or a replacement vehicle as needed.",
	},
	{
		question: "Can I rent a car for travel outside of the country?",
		answer:
			"Yes, depending on the terms and conditions, you may be able to rent a car for travel outside of the country. Please check with our staff for specific details and any additional requirements.",
	},
	{
		question: "Do you have a loyalty program for frequent renters?",
		answer:
			"Yes, we have a loyalty program for frequent renters, offering benefits such as discounts, upgrades, and exclusive offers. Customers can enroll in the loyalty program to start earning rewards.",
	},
	{
		question: "How far in advance should I book a rental car?",
		answer:
			"It is recommended to book a rental car as early as possible, especially during peak travel seasons or for specific vehicle types. Booking in advance ensures availability and may also qualify for early booking discounts.",
	},
	{
		question: "What payment methods do you accept for rental?",
		answer:
			"We accept various payment methods, including credit cards, debit cards, and cash deposits. However, a valid credit card is typically required for booking and security deposit purposes.",
	},
];

export const HomeFaqsRO: FAQ[] = [
	{
		question:
			"Ce tipuri de vehicule oferă Euro Cars Business pentru închiriere?",
		answer:
			"Euro Cars Business oferă o gamă largă de vehicule, inclusiv mașini compacte, limuzine, SUV-uri, mașini de lux și vehicule premium.",
	},
	{
		question:
			"Oferiți atât opțiuni de închiriere pe termen scurt, cât și pe termen lung?",
		answer:
			"Da, oferim atât opțiuni de închiriere pe termen scurt, cât și pe termen lung pentru a satisface diverse nevoi ale clienților și duratele de utilizare.",
	},
	{
		question:
			"Care sunt cerințele dumneavoastră pentru închirierea unei mașini?",
		answer:
			"Pentru a închiria o mașină de la Euro Cars Business, de obicei aveți nevoie de un permis de conducere valabil, o carte de credit pentru plată și garanție, și să îndepliniți cerința de vârstă minimă, de obicei, 21 de ani.",
	},
	{
		question:
			"Oferiți servicii de livrare și preluare pentru mașinile de închiriat?",
		answer:
			"Da, oferim servicii de livrare și preluare pentru mașinile de închiriat, facilitând procesul de închiriere pentru clienții noștri. Pot exista taxe suplimentare în funcție de locație și distanță.",
	},
	{
		question:
			"Sunt restricții de vârstă pentru închirierea unei mașini de la Euro Cars Business?",
		answer:
			"Da, cerința de vârstă minimă pentru a închiria o mașină de la Euro Cars Business este de obicei de 21 de ani. Cu toate acestea, restricțiile specifice de vârstă pot varia în funcție de locație și tipul de vehicul.",
	},
	{
		question: "Ce opțiuni de asigurare oferiți pentru mașinile de închiriat?",
		answer:
			"Oferim diverse opțiuni de asigurare, inclusiv renunțarea la daunele de coliziune (CDW), protecție împotriva furtului și acoperirea răspunderii civile. Clienții pot alege pachetul de asigurare care li se potrivește cel mai bine.",
	},
	{
		question: "Aveți reduceri sau promoții speciale disponibile?",
		answer:
			"Da, oferim frecvent reduceri și promoții speciale pentru mașinile noastre de închiriat. Clienții pot verifica site-ul nostru web sau ne pot contacta direct pentru oferte curente.",
	},
	{
		question:
			"Ce se întâmplă dacă trebuie să prelungesc perioada de închiriere?",
		answer:
			"Dacă aveți nevoie să prelungiți perioada de închiriere, vă rugăm să contactați echipa noastră de servicii pentru clienți cât mai curând posibil. Vom face tot posibilul să vă satisfacem solicitarea, în funcție de disponibilitatea vehiculului.",
	},
	{
		question:
			"Sunt taxe sau costuri suplimentare care nu sunt incluse în prețul de închiriere?",
		answer:
			"Taxele sau costurile suplimentare pot include taxe, suprataxe, acoperirea opțională de asigurare, combustibilul și echipamentul sau accesoriile suplimentare. Acestea vor fi clar specificate în contractul de închiriere.",
	},
	{
		question:
			"Oferiți sisteme de navigație GPS sau alte accesorii suplimentare?",
		answer:
			"Da, oferim sisteme de navigație GPS, scaune pentru copii și alte accesorii suplimentare pentru o taxă suplimentară. Acestea pot fi solicitate la momentul rezervării sau la ridicare.",
	},
	{
		question:
			"Care este politica dumneavoastră privind alimentarea cu combustibil a mașinii de închiriat la returnare?",
		answer:
			"Solicităm clienților să returneze mașina de închiriat cu același nivel de combustibil ca și atunci când a fost ridicată. Nealimentarea corectă poate duce la taxe suplimentare pentru alimentare.",
	},
	{
		question:
			"Ce ar trebui să fac în cazul unei defecțiuni sau a unui accident cu mașina de închiriat?",
		answer:
			"În cazul unei defecțiuni sau accident, vă rugăm să contactați imediat linia noastră de asistență rutieră 24/7 pentru îndrumare și suport. Vom asista în aranjarea reparațiilor sau a unui vehicul de înlocuire, după cum este necesar.",
	},
	{
		question: "Pot să închiriez o mașină pentru călătorii în afara țării?",
		answer:
			"Da, în funcție de termenii și condițiile, puteți închiria o mașină pentru călătorii în afara țării. Vă rugăm să verificați cu personalul nostru pentru detalii specifice și eventuale cerințe suplimentare.",
	},
	{
		question: "Aveți un program de loialitate pentru clienții fideli?",
		answer:
			"Da, avem un program de loialitate pentru clienții fideli, oferind beneficii precum reduceri, upgrade-uri și oferte exclusive. Clienții se pot înscrie în programul de loialitate pentru a începe să acumuleze recompense.",
	},
	{
		question: "Cât de devreme ar trebui să rezerv o mașină de închiriat?",
		answer:
			"Se recomandă să rezervați o mașină de închiriat cât mai devreme posibil, mai ales în perioadele de vârf sau pentru tipuri specifice de vehicule. Rezervarea în avans asigură disponibilitatea și poate califica și pentru reduceri pentru rezervările timpurii.",
	},
	{
		question: "Ce metode de plată acceptați pentru închiriere?",
		answer:
			"Acceptăm diverse metode de plată, inclusiv carduri de credit, carduri de debit și depozite în numerar. Cu toate acestea, de obicei, este necesar un card de credit valid pentru rezervare și pentru depozitul de securitate.",
	},
];

export const featuredModels = [
	{ name: "Sedan", img: "/images/home/sedan.svg", link: "" },
	{ name: "Coupe", img: "/images/home/coupe.svg", link: "" },
	{ name: "SUV", img: "/images/home/suv.svg", link: "" },
	{ name: "Van", img: "/images/home/van.png", link: "" },
	{ name: "Electric", img: "/images/home/electric.svg", link: "" },
];

export const HomeBrands = [
	{ name: "Audi", img: "/images/home/audi.png" },
	{ name: "BMW", img: "/images/home/bmw.png" },
	{ name: "Dacia", img: "/images/home/dacia.png" },
	{ name: "Ford", img: "/images/home/ford.png" },
	{ name: "Mercedes", img: "/images/home/mercedes.png" },
	{ name: "Toyota", img: "/images/home/toyota.png" },
];

export const HomeChooses = [
	{
		img: "/images/home/choose-1.svg",
		title: "Special Financing Offers",
		description:
			"Explore our flexible rental plans tailored to suit your budget and needs.",
	},
	{
		img: "/images/home/choose-2.svg",
		title: "Trusted Car Rental Provider",
		description:
			"Rent with confidence from a reputable company dedicated to customer satisfaction.",
	},
	{
		img: "/images/home/choose-3.svg",
		title: "Transparent Pricing",
		description:
			"Enjoy straightforward pricing with no hidden fees, ensuring complete transparency.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Expert Car Service",
		description:
			"Experience top-notch maintenance and support services to keep your rental in peak condition throughout your journey.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Wide Vehicle Selection",
		description:
			"Choose from a diverse range of vehicles including compact cars, sedans, SUVs, vans, and more to meet your specific requirements.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "24/7 Customer Support",
		description:
			"Access round-the-clock assistance from our dedicated customer support team, ensuring peace of mind throughout your rental experience.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Convenient Online Booking",
		description:
			"Easily reserve your rental vehicle through our user-friendly online booking platform, allowing for seamless and hassle-free transactions.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Flexible Pickup and Drop-off Locations",
		description:
			"Select from multiple convenient pickup and drop-off locations, providing flexibility and convenience for your travel plans.",
	},
];

export const HomeChoosesRO = [
	{
		img: "/images/home/choose-1.svg",
		title: "Oferte Speciale de Finanțare",
		description:
			"Explorați planurile noastre flexibile de închiriere adaptate pentru a se potrivi bugetului și nevoilor dvs.",
	},
	{
		img: "/images/home/choose-2.svg",
		title: "Furnizor de Închirieri Auto de Încredere",
		description:
			"Închiriați cu încredere de la o companie de încredere dedicată satisfacției clienților.",
	},
	{
		img: "/images/home/choose-3.svg",
		title: "Prețuri Transparente",
		description:
			"Bucurați-vă de prețuri clare fără taxe ascunse, asigurând transparență completă.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Servicii Auto Expert",
		description:
			"Experimentați servicii de întreținere și suport de top pentru a menține închirierea în condiții optime pe tot parcursul călătoriei dvs.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Selecție Largă de Vehicule",
		description:
			"Alegeți dintr-o gamă diversificată de vehicule, inclusiv mașini compacte, limuzine, SUV-uri, microbuze și multe altele pentru a satisface cerințele dvs. specifice.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Suport pentru Clienți 24/7",
		description:
			"Accesați asistență non-stop din partea echipei noastre dedicate de suport pentru clienți, asigurându-vă liniștea pe tot parcursul experienței dvs. de închiriere.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Rezervare Online Convenabilă",
		description:
			"Rezervați cu ușurință vehiculul dvs. de închiriat prin platforma noastră de rezervări online prietenoasă, permițând tranzacții fără probleme și fără bătăi de cap.",
	},
	{
		img: "/images/home/choose-4.svg",
		title: "Locații Flexibile pentru Ridicare și Predare",
		description:
			"Selectați din mai multe locații convenabile pentru ridicare și predare, oferind flexibilitate și confort pentru planurile dvs. de călătorie.",
	},
];

export type PartialClient = {
	id: string;
	name: string;
	email: string;
	lastName: string;
	provider: string;
	firstName: string;
	providerAccountId: string;
};

export type Provider = {
	id: number;
	name: string;
	linkedWith: string;
	createdAt: Date;
	updatedAt: Date;
	providerAccountId: string;
	providerEmail: string;
	providerFirstName: string;
	providerLastName: string;
	client?: Client | null;
};

export type BillingAddress = {
	id: number;
	country: string;
	city: string;
	address: string;
	zipCode: string;
	observations?: string | null;
	client?: Client | null;
};

export type ExchangeRate = {
	id: number;
	currency: string;
	value: number;
	multiplier: number;
	date: Date;
	createdAt: Date;
};

export type Show = {
	id: number;
	image: string;
	title: string;
	title_en: string;
	startTime: string;
	endTime: string;
	director: string;
	actors: string;
	createdAt: Date;
	updatedAt: Date;
	description_en: string;
	description: string;
	content: string;
	content_en: string;
	seasonId: number;
	season: Season;
	showTypeId: number;
	showType: ShowType;
	showRoom?: ShowRoom;
	showRoomId: number;
	favorites?: ShowFavorite[] | null;
	ticketsSold?: TicketSold[] | null;
	materials?: ShowMaterialDecorationUsed[] | null;
	fiscalReceipts?: FiscalReceipt[] | null;
};

export type ShowFavorite = {
	id: number;
	show?: Show;
	client: Client;
};

export type ShowType = {
	id: number;
	name: string;
	name_en: string;
	createdAt: Date;
	updatedAt: Date;
	shows?: Show[] | null;
};

export type Season = {
	id: number;
	name: string;
	name_en: string;
	createdAt: Date;
	updatedAt: Date;
	shows?: Show[] | null;
};

export type ShowRoom = {
	id: number;
	number: string;
	createdAt: Date;
	updatedAt: Date;
	observations?: string | null;
	seats?: ShowRoomSeat[] | null;
	ticketsSold?: TicketSold[] | null;
};

export type ShowRoomSeat = {
	id: number;
	row: string;
	number: string;
	showRoomId: number;
	showRoom?: ShowRoom | null;
	type: string;
	price: number;
	createdAt: Date;
	updatedAt: Date;
	ticketsSold?: TicketSold[] | null;
};

export enum ShowRoomSeatCategory {
	STANDARD = "Standard",
	PREMIUM = "Premium",
	VIP = "VIP",
}

export const seatCategories: ShowRoomSeatCategory[] = [
	ShowRoomSeatCategory.STANDARD,
	ShowRoomSeatCategory.PREMIUM,
	ShowRoomSeatCategory.VIP,
];

export type TicketSold = {
	id: number;
	number: string;
	showId: number;
	show?: Show | null;
	clientId: number;
	client?: Client | null;
	showRoomId: number;
	showRoom?: ShowRoom | null;
	seatId: number;
	seat?: ShowRoomSeat | null;
	soldPrice: number;
	createdAt: Date;
	updatedAt: Date;
	ticketVerified?: TicketVerified | null;
	payment?: Payment | null;
	invoice?: Invoice | null;
	fiscalReceipt?: FiscalReceipt | null;
};

export type TicketVerified = {
	id: number;
	verifiedAt: Date;
	updatedAt: Date;
	ticketSoldId: number;
	ticketSold?: TicketSold | null;
};

export type Payment = {
	id: number;
	amount: number;
	currency: string;
	currencyAmount: number;
	currencyDate: Date;
	status: PaymentStatus;
	paidAt: Date;
	type: PaymentType;
	createdAt: Date;
	updatedAt: Date;
	clientId: number;
	client?: Client | null;
	ticketId?: number | null;
	ticket?: TicketSold | null;
	invoice?: Invoice | null;
	fiscalReceipt?: FiscalReceipt | null;
};

export type FiscalReceipt = {
	id: number;
	receiptNumber: string;
	receiptSeries: string;
	amount: number;
	currency: string;
	currencyAmount: number;
	currencyDate: Date;
	paidAt: Date;
	showId: number;
	show?: Show | null;
	createdAt: Date;
	updatedAt: Date;
	paymentId: number;
	payment?: Payment | null;
	ticket?: TicketSold | null;
	ticketId?: number | null;
	clientId: number;
	client?: Client | null;
	invoice?: Invoice | null;
};

export type Invoice = {
	id: number;
	billingAddress: string;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	invoiceSeries: string;
	invoiceNumber: string;
	issueDate: Date;
	dueDate: Date;
	totalAmount: number;
	extraFees: number;
	amount: number;
	currency: string;
	currencyAmount: number;
	currencyDate: Date;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	paymentId: number;
	fiscalReceiptId: number;
	clientId: number;
	ticketId?: number | null;
	client?: Client | null;
	ticket?: TicketSold | null;
	payment?: Payment | null;
	fiscalReceipt?: FiscalReceipt | null;
};

export type ShowMaterialDecoration = {
	id: number;
	name: string;
	name_en: string;
	unit: string;
	stock: number;
	buyDate: string;
	buyPrice: number;
	producer: string;
	categoryId: number;
	createdAt: Date;
	updatedAt: Date;
	category?: ShowMaterialDecorationCategory | null;
	materialsUsed?: ShowMaterialDecorationUsed[] | null;
};

export type ShowMaterialDecorationCategory = {
	id: number;
	name: string;
	name_en: string;
	createdAt: Date;
	updatedAt: Date;
	materialDecorations?: ShowMaterialDecoration[] | null;
};

export type ShowMaterialDecorationUsed = {
	id: number;
	materialId: number;
	material?: ShowMaterialDecoration | null;
	showId: number;
	show?: Show | null;
	usedDate: string;
	quantity: number;
	leftQuantity: number;
	createdAt: Date;
	updatedAt: Date;
	observations?: string | null;
};

export type AssociatedAccountData = {
	isMain: boolean;
	provider: Provider;
};

export type LanguageData = {
	language: Locale;
	dictionary: any;
};

export type ErrorMsg = {
	error: {
		message: string;
	};
};

export enum ActionRating {
	UPDATE,
	CREATE,
	DELETE,
}

export const paymentTypesList = Object.values(PaymentType);
