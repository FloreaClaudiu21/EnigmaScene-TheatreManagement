import DataTable from "@/components/admin/table/Table";
import { prisma } from "@/lib/prismaClient";
import { Distribution, Season, Show, ShowType, TableTypes } from "@/lib/types";
import TabsPages from "@/components/admin/table/TabsPages";
import { columnsShow } from "./columnsShow";
import { columnsSeason } from "./columnsSeason";
import { columnsDistributin } from "./columnsDistribution";
import { columnsShowType } from "./columnsShowType";

export default async function AdminShows({ params }: { params: any }) {
	const seasons: Season[] = await prisma.season.findMany({});
	const categories: ShowType[] = await prisma.showType.findMany({});
	const distibutions: Distribution[] = await prisma.distribution.findMany({});
	const shows: Show[] = await prisma.show.findMany({
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
			season: true,
			showType: true,
			distribution: true,
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
							type={TableTypes.SHOWS}
							create_title="Add Show"
							create_link="shows/create"
							subtitle="Manage your shows and view their decoration materials."
							filters={[
								{ column: "id", label: "ID" },
								{ column: "title", label: "Title" },
								{ column: "title_en", label: "Title EN" },
								{ column: "date", label: "Show Date" },
								{ column: "ticketsSold", label: "Tickets Sold" },
								{ column: "showTypeId", label: "ShowType Id" },
								{ column: "seasonId", label: "Season Id" },
								{ column: "distributionId", label: "Distribution Id" },
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
							type={TableTypes.SHOWS_SEASON}
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
					name: "Distributions",
					value: "showsDistribution",
					content: (
						<DataTable
							data={distibutions}
							params={params}
							showControlBtns={true}
							title="Shows Distributions"
							columns={columnsDistributin}
							type={TableTypes.SHOWS_DISTRIBUTION}
							create_title="Add Show Distibution"
							create_link="shows/create-distribution"
							subtitle="Manage your shows distibutions."
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
							type={TableTypes.SHOWS_CATEGORY}
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
