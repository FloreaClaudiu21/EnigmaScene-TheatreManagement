import DataTable from "@/components/admin/table/Table";
import { prisma } from "@/lib/prismaClient";
import { Season, Show, ShowType, TableTypes } from "@/lib/types";
import TabsPages from "@/components/admin/table/TabsPages";
import { columnsShow } from "./columnsShow";
import { columnsSeason } from "./columnsSeason";

import { columnsShowType } from "./columnsShowType";

export default async function AdminShows({ params }: { params: any }) {
	const seasons: Season[] = await prisma.season.findMany({});
	const categories: ShowType[] = await prisma.showType.findMany({});
	const shows: Show[] = await prisma.show.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			favorites: {
				include: {
					client: true,
				},
			},
			ticketsSold: true,
			materials: {
				include: {
					material: {
						include: {
							category: true,
						},
					},
				},
			},
			fiscalReceipts: {
				include: {
					show: {
						include: {
							season: true,
							showType: true,
							showRoom: true,
						},
					},
					ticket: true,
					client: true,
					invoice: true,
					payment: true,
				},
			},
			season: true,
			showType: true,
			showRoom: {
				include: {
					seats: true,
				},
			},
		},
	});
	return (
		<TabsPages
			defVal="showsAll"
			tabs={[
				{
					name: "All Shows",
					value: "showsAll",
					content: (
						<DataTable
							params={params}
							title="Shows"
							data={shows}
							columns={columnsShow}
							showControlBtns={true}
							type={TableTypes.SHOW}
							create_title="Add Show"
							create_link="shows/create"
							subtitle="Manage your shows and view their decoration materials."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "title", label: "Title" },
								{ column: "title_en", label: "Title EN" },
								{ column: "startTime", label: "Start Time" },
								{ column: "endTime", label: "End Time" },
								{ column: "showRoomId", label: "Show Room Id" },
								{ column: "showTypeId", label: "ShowType Id" },
								{ column: "seasonId", label: "Season Id" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
				{
					name: "Seasons",
					value: "showsSeasons",
					content: (
						<DataTable
							data={seasons}
							params={params}
							title="Shows Season"
							columns={columnsSeason}
							showControlBtns={true}
							type={TableTypes.SHOW_SEASON}
							create_title="Add Show Season"
							create_link="shows/create-season"
							subtitle="Manage your shows seasons."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "name", label: "Name" },
								{ column: "name_en", label: "Name EN" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
				{
					name: "Categories",
					value: "showsCategory",
					content: (
						<DataTable
							data={categories}
							params={params}
							showControlBtns={true}
							title="Shows Category"
							columns={columnsShowType}
							type={TableTypes.SHOW_CATEGORY}
							create_title="Add Show Category"
							create_link="shows/create-category"
							subtitle="Manage your shows categories."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "name", label: "Name" },
								{ column: "name_en", label: "Name EN" },
								{ column: "createdAt", label: "Created At" },
							]}
						/>
					),
				},
			]}
		/>
	);
}
