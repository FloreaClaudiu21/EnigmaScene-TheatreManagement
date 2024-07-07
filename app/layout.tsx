import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@smastrom/react-rating/style.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getServerSession } from "next-auth";
import { AuthOption } from "./api/auth/authOptions";
import AutentificareProvider from "./AuthContext";

const roboto = Roboto({
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Teatrul Scenei Enigma - O Călătorie Teatrală Dincolo de Imaginație",
	description:
		"Intră în regatul misterului și al minunii în timp ce cortinele se ridică pe scena enigmatică. Scena Enigma te invită să începi o călătorie teatrală care transcende imaginația. Pătrunde într-o lume a intrigii, luxului și aventurii, unde fiecare scenă se desfășoară ca un enigmă fascinant așteptând să fie rezolvată.",
	keywords: [
		"Scenă Enigmatică",
		"Călătorie Teatrală",
		"Mister și Minune",
		"Spectacol ENIGMA SCENE",
		"Aventură de Lux",
		"Enigmă Fascinantă",
		"Spectacol Teatral",
		"Dincolo de Imaginație",
		"Intrigă și Excitare",
		"Descoperirea Misterelor",
	],
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(AuthOption);
	return (
		<html lang="ro">
			<body className={roboto.className}>
				<AutentificareProvider session={session}>
					{children}
				</AutentificareProvider>
			</body>
		</html>
	);
}
