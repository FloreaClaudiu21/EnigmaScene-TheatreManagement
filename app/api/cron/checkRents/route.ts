import { prisma } from "@/lib/prismaClient";
import { hoursDiff } from "@/lib/utils";
import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import RentAlmostDoneMail from "@/services/emails/RentPeriodAlmostDone";
import { sendEmail } from "@/services/general/EmailProvider";
import RentPeriodEndedEmail from "@/services/emails/RentPeriodEnded";
import { Rent } from "@/lib/types";
import { deleteRentForCar } from "@/services/CarProvider";

export async function GET() {
	const dateNow = new Date();
	const rents: Rent[] = await prisma.rent.findMany({
		include: {
			user: true,
			car: {
				include: {
					brand: true,
					fuelPolicy: true,
					locationType: true,
					specifications: true,
				},
			},
			invoice: true,
			payment: true,
		},
	});
	const promises = rents.map(async (v) => {
		const dateEnd = new Date(v.dropOffDate.replace("|", " "));
		const hoursLeft = hoursDiff(dateNow, dateEnd);
		const userName = v.user?.firstName + " " + v.user?.lastName;
		if (hoursLeft === 12 || hoursLeft === 8 || hoursLeft === 4) {
			const html = render(
				RentAlmostDoneMail({
					lang: "en",
					name: userName,
					rent: v,
					hours: hoursLeft,
				})
			);
			const res = await sendEmail(
				"en",
				v.user?.email ?? "",
				html,
				`Rent #${v.id} almost done`,
				""
			);
			return res.ok;
		} else if (hoursLeft <= 0) {
			const html = render(
				RentPeriodEndedEmail({ lang: "en", name: userName, rent: v })
			);
			const res = await sendEmail(
				"en",
				v.user?.email ?? "",
				html,
				`Rent #${v.id} has finished, return the car to the drop-off location.`,
				""
			);
			if (res.ok) {
				await deleteRentForCar("en", v.id);
				return true;
			}
		}
		return false;
	});
	const results = await Promise.all(promises);
	return NextResponse.json({ results });
}
