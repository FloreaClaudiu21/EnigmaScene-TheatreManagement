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

export default function VerifiyAccountEmail({
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
					{lang === "en" ? (
						<>
							<Text>Thank you for registering with Enigma Scene Threatre.</Text>
							<Text>
								To confirm your email address, please click the link below:
								<Button
									href={url}
									style={{
										color: "black",
										fontStyle: "oblique",
										fontWeight: 700,
									}}
								>
									{url}
								</Button>
							</Text>
							<Text>
								If you are unable to click the link, copy and paste it into your
								browser. The confirmation link is valid for 24 hours from
								registration, if you do not complete this your account will be
								deleted.
							</Text>
							<Text>
								If you did not make this request, you can ignore this message.
							</Text>
						</>
					) : (
						<>
							<Text>
								Vă mulțumim că v-ați înregistrat la Teatrul Enigma Scene.
							</Text>
							<Text>
								Pentru a confirma adresa de email, vă rugăm să faceți clic pe
								link-ul de mai jos:
								<Button
									href={url}
									style={{
										color: "black",
										fontStyle: "oblique",
										fontWeight: 700,
									}}
								>
									{url}
								</Button>
							</Text>
							<Text>
								Dacă nu puteți face clic pe link, copiați și lipiți-l în
								browser. Link-ul de confirmare este valabil pentru 24 de ore de
								la înregistrare, dacă nu efectuați acest lucru, contul dvs. va
								fi șters.
							</Text>
							<Text>
								Dacă nu ați făcut această cerere, puteți ignora acest mesaj.
							</Text>
						</>
					)}
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
