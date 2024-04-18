import React from "react";
import {
	Button,
	Heading,
	Hr,
	Html,
	Text,
	Img,
	Container,
} from "@react-email/components";
import { Locale } from "@/i18n.config";

export default function ForgotPasswordEmail({
	lang,
	name,
	url,
}: {
	lang: Locale;
	name: string;
	url: string;
}) {
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
					<Heading as="h2">{name},</Heading>
					<Text>
						{lang === "en"
							? "We recently received a request to reset your account password."
							: "Am primit recent o cerere de a reseta parola contului dvs."}
					</Text>
					<Text>
						{lang === "en"
							? "If you requested this change, click on this link to reset your password:"
							: "Dacă ați cerut această schimbare, faceți clic pe acest link pentru a vă reseta parola:"}
						<Button
							href={url}
							style={{ color: "black", fontStyle: "oblique", fontWeight: 700 }}
						>
							{url}
						</Button>
					</Text>
					<Text>
						{lang === "en"
							? "If you are unable to click the link, copy and paste it into your browser. The reset link will expire in 12 hours from receipt."
							: "Dacă nu puteți face clic pe link, copiați-l și lipiți-l în browser. Link-ul de resetare va expira în 12 ore de la primire."}
					</Text>
					<Text>
						{lang === "en"
							? "If you did not make this request, you can ignore this message, and your password will remain unchanged."
							: "Dacă nu ați făcut această cerere, puteți ignora acest mesaj, iar parola dvs. va rămâne neschimbată."}
					</Text>
					<Hr />
				</Container>
				<Container style={{ backgroundColor: "lightgray" }}>
					<Text style={{ textAlign: "center" }}>
						{lang === "en"
							? "Thank you, Enigma Scene"
							: "Vă mulțumim, Enigma Scene"}
					</Text>
				</Container>
			</Container>
		</Html>
	);
}
