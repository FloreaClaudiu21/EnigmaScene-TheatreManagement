import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
const prisma = new PrismaClient();
const algorithm = "aes-256-cbc";
const secretKey = process.env.AUTH_SECRET ?? "";

async function main() {
	const encryptPassword = (password: string) => {
		const cipher = crypto.createCipher(algorithm, secretKey);
		let encryptedPassword = cipher.update(password, "utf-8", "hex");
		encryptedPassword += cipher.final("hex");
		return encryptedPassword;
	};

	// const mainAdminUser = await prisma.client.create({
	// 	data: {
	// 		numeClient: "Admin User",
	// 		email: "adminuser@enigmatheatre.ro",
	// 		parola: encryptPassword(process.env.ADMIN_KEY ?? ""),
	// 		telefon: "+400729714106",
	// 		utlizatorAdmin: true,
	// 		dataNasterii: new Date("13-01-1998").toDateString(),
	// 	},
	// });
	const seatsData = [];
	let currentRow = "C";
	let curRowNumber = 3;
	for (let i = 1; i <= 90; i++) {
		seatsData.push({
			codSalaSpectacol: 1,
			rand: curRowNumber + "",
			numarLoc: currentRow + i,
			pretLoc: 30,
			tipLoc: "STANDARD",
		});
		if (i % 9 === 0) {
			curRowNumber += 1;
			currentRow = String.fromCharCode(currentRow.charCodeAt(0) + 1); // Increment row letter
		}
	}
	const seats = await prisma.locSalaSpectacol.createMany({
		data: seatsData,
	});
	console.log(seats.count);
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
