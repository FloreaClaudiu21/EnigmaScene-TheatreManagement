import React from "react";
import {
	Heading,
	Hr,
	Html,
	Text,
	Img,
	Container,
} from "@react-email/components";
import { z } from "zod";
import { messageSchema } from "@/lib/schemas";
import { Locale } from "@/i18n.config";

export default function GuestMessageEmail({
	lang,
	values,
}: {
	lang: Locale;
	values: z.infer<typeof messageSchema>;
}) {
	const isEnglish = lang === "en";
	return (
		<Html
			style={{
				maxWidth: "320px",
			}}
		>
			<Container
				style={{
					border: "1px solid lightgray",
				}}
			>
				<Container style={{ padding: "1rem" }}>
					<Img
						src={"https://i.imgur.com/e5SEjO8.png"}
						alt="Enigma Scene LOGO"
						width={"auto"}
						height={300}
					/>
					<Heading as="h2">
						{isEnglish
							? `${values.firstName} ${values.lastName}`
							: `${values.lastName} ${values.firstName}`}
						,
					</Heading>
					<Text>
						{isEnglish
							? "He left a message, sent from the contact page:"
							: "A lăsat un mesaj, trimis de pe pagina de contact:"}
					</Text>
					<Text style={{ textDecoration: "italic" }}>{values.message}</Text>
					<Text>
						{isEnglish
							? `You can contact them back at the phone number '${values.phone}' or at the email address '${values.email}'.`
							: `Îl poți contacta înapoi la numărul de telefon '${values.phone}' sau la adresa de email '${values.email}'.`}
					</Text>
					<Hr />
				</Container>
				<Container style={{ backgroundColor: "lightgray" }}>
					<Text style={{ textAlign: "center" }}>
						{isEnglish
							? "Thank you, Enigma Scene"
							: "Vă mulțumim, Enigma Scene"}
					</Text>
				</Container>
			</Container>
		</Html>
	);
}
