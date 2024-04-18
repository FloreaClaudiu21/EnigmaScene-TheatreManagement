import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Roboto } from "next/font/google";
import "@smastrom/react-rating/style.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const roboto = Roboto({
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Enigma Scene - A Theatrical Journey Beyond Imagination",
	description:
		"Step into the realm of mystery and wonder as the curtains rise on the enigmatic stage. Enigma Scene invites you to embark on a theatrical journey that transcends imagination. Delve into a world of intrigue, luxury, and adventure, where every scene unfolds like a mesmerizing enigma waiting to be solved.",
	keywords: [
		"Enigmatic Stage",
		"Theatrical Journey",
		"Mystery and Wonder",
		"ENIGMA SCENE Showcase",
		"Luxury Adventure",
		"Mesmerizing Enigma",
		"Theatrical Spectacle",
		"Beyond Imagination",
		"Intrigue and Excitement",
		"Unraveling Mysteries",
	],
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={roboto.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
