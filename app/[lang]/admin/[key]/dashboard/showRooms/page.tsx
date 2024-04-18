import { columns } from "./columns";
import { prisma } from "@/lib/prismaClient";
import { ShowRoom, TableTypes } from "@/lib/types";

export default async function AdminShowRooms({ params }: { params: any }) {
	const showRooms: ShowRoom[] = await prisma.showRoom.findMany({
		include: {
			seats: true,
		},
	});
	return <></>;
}
