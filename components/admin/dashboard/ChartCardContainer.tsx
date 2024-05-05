"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/rangeOptions";
import { ChartDataType, ChartTip } from "@/lib/types";
import { isNumeric } from "@/lib/utils";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import ChartDateSelector from "./ChartDateSelector";

export function ChartCardContainer({
	title,
	searchParams,
	queryKey,
	chartData,
	chartType,
	selectedRangeLabel,
}: {
	title: string;
	queryKey: string;
	chartType: ChartTip;
	chartData: ChartDataType | undefined;
	selectedRangeLabel: any;
	searchParams: any;
}) {
	const chartOptions = Object.values(ChartTip);
	const returnChart = (val: any) => {
		const charType = chartType.toString();
		if (val.toString() !== charType) return <></>;
		if (charType == "LINE") {
			return (
				<ResponsiveContainer width="100%" minHeight={300}>
					<LineChart data={chartData?.data}>
						<CartesianGrid stroke="hsl(var(--muted))" />
						<XAxis dataKey="nameKey" stroke="hsl(var(--primary))" />
						<YAxis
							stroke="hsl(var(--primary))"
							tickFormatter={(value) =>
								isNumeric(value) ? formatNumber(value) : value
							}
						/>
						<Tooltip
							formatter={(value) =>
								isNumeric(value.toString())
									? formatNumber(value as number) + " RON"
									: value
							}
						/>
						<Line
							dot={false}
							name={title}
							type="monotone"
							dataKey="dataKey"
							stroke="hsl(var(--primary))"
						/>
					</LineChart>
				</ResponsiveContainer>
			);
		} else if (charType == "BAR") {
			return (
				<ResponsiveContainer width="100%" minHeight={300}>
					<BarChart data={chartData?.data}>
						<CartesianGrid stroke="hsl(var(--muted))" />
						<XAxis dataKey="nameKey" stroke="hsl(var(--primary))" />
						<YAxis
							stroke="hsl(var(--primary))"
							tickFormatter={(value) =>
								isNumeric(value) ? formatNumber(value) : value
							}
						/>
						<Tooltip
							cursor={{ fill: "hsl(var(--muted))" }}
							formatter={(value) =>
								isNumeric(value.toString())
									? formatNumber(value as number)
									: value
							}
						/>
						<Bar dataKey="dataKey" name={title} stroke="hsl(var(--primary))" />
					</BarChart>
				</ResponsiveContainer>
			);
		} else {
			return (
				<ResponsiveContainer width="100%" minHeight={300}>
					<PieChart>
						<Tooltip
							cursor={{ fill: "hsl(var(--muted))" }}
							formatter={(value) =>
								isNumeric(value.toString())
									? formatNumber(value as number)
									: value
							}
						/>
						<Pie
							data={chartData?.data}
							label={(item: any) => item.name + ""}
							dataKey="dataKey"
							nameKey="nameKey"
							fill="hsl(var(--primary))"
						/>
					</PieChart>
				</ResponsiveContainer>
			);
		}
	};
	return (
		<Card className="shadow-md">
			<CardHeader>
				<div className="flex gap-4 justify-between items-center">
					<CardTitle>{title}</CardTitle>
					<ChartDateSelector
						queryKey={queryKey}
						searchParams={searchParams}
						selectedRange={selectedRangeLabel}
					/>
				</div>
			</CardHeader>
			<CardContent>
				{chartOptions.map((val) => {
					return returnChart(val);
				})}
			</CardContent>
		</Card>
	);
}
