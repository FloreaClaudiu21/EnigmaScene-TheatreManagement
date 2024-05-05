"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ChartDateSelector from "../ChartDateSelector";
import { useGeneralChartModal } from "@/services/StateProvider";
import { capitalizeFirst } from "@/lib/utils";

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
	bodyGeneralChart: any;
	selectedRangeLabel: any;
}) {
	const chartModel = useGeneralChartModal();
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
						chartModel.setTitle(
							title + " - " + capitalizeFirst(selectedRangeLabel.label1.trim())
						);
						chartModel.setBody(bodyGeneralChart);
						chartModel.setVisible(true);
					}}
				>
					{body}
				</p>
			</CardContent>
		</Card>
	);
}
