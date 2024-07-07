"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ChartDateSelector from "../ChartDateSelector";
import { formularGrafic } from "@/services/general/FurnizorStare";
import { capitalizeazaPrima } from "@/lib/metodeUtile";

type BodyLine = {
	titlu: string;
	content: string;
};

export type BodyContents = {
	titlu: string;
	leftContent?: string;
	content: BodyLine[];
};

export function GeneralStatLine(content: BodyLine) {
	return (
		<div>
			<span className="font-semibold text-sm">{content.titlu}</span>
			<span className="text-sm text-muted-foreground">{content.content}</span>
		</div>
	);
}

export function GeneralStatBody({ body }: { body: BodyContents[] }) {
	if (body.length <= 0) return <>Nu au fost găsite înregistrări.</>;
	return body.map((v) => {
		return (
			<div
				key={v.titlu + v.content}
				className="flex items-start gap-4 border-b-1 pb-2"
			>
				<div className="grid gap-1 overflow-hidden break-all">
					<p className="text-lg font-semibold leading-none text-red-500">
						{v.titlu}
					</p>
					<div className="flex flex-col">
						{v.content.map((v) => {
							return (
								<GeneralStatLine
									key={v.titlu + v.content}
									content={v.content}
									titlu={v.titlu}
								/>
							);
						})}
					</div>
				</div>
				<div className="ml-auto font-medium text-right">{v.leftContent}</div>
			</div>
		);
	});
}

export default function GeneralStatCard({
	icon,
	title,
	subtitle,
	body,
	searchParams,
	queryKey,
	selectedRangeLabel,
	bodyGeneralChart,
}: {
	icon: any;
	title: string;
	subtitle: string;
	body: string;
	queryKey: string;
	searchParams: any;
	selectedRangeLabel: any;
	bodyGeneralChart: BodyContents[];
}) {
	const chartModel = formularGrafic();
	return (
		<Card className="w-full shadow-md">
			<CardHeader className="gap-2">
				<div className="flex gap-4 justify-between items-center">
					{icon}
					<CardTitle>{title}</CardTitle>
					<ChartDateSelector
						queryKey={queryKey}
						searchParams={searchParams}
						selectedRange={selectedRangeLabel}
					/>
				</div>
				<CardDescription>{subtitle}</CardDescription>
			</CardHeader>
			<CardContent>
				<p
					title="Arata continutul"
					className="hover:cursor-pointer"
					onClick={() => {
						chartModel.setTitlu(
							title +
								" - " +
								capitalizeazaPrima(selectedRangeLabel.eticheta1.trim())
						);
						chartModel.setContinut(bodyGeneralChart);
						chartModel.setVizibil(true);
					}}
				>
					{body}
				</p>
			</CardContent>
		</Card>
	);
}
