import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Enigma Scene - Admin Control Panel",
	description:
		"Step into the realm of mystery and wonder as the curtains rise on the enigmatic stage. Enigma Scene invites you to embark on a theatrical journey that transcends imagination. Delve into a world of intrigue, luxury, and adventure, where every scene unfolds like a mesmerizing enigma waiting to be solved.",
};

export default async function AdminKeyLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		key: string;
	};
}) {
	if (params.key != process.env.ADMIN_KEY) {
		return notFound();
	}
	return <div className="bg-muted/30">{children}</div>;
}
