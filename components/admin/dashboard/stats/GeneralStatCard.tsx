import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeneralStatCard({
	icon,
	title,
	subtitle,
	subtitle_lastmonth,
}: {
	icon: any;
	title: string;
	subtitle: string;
	subtitle_lastmonth: string;
}) {
	return (
		<Card className="w-full shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium text-red-500">
					{title}
				</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{subtitle}</div>
				<p className="text-xs text-muted-foreground">
					{subtitle_lastmonth}% from last month
				</p>
			</CardContent>
		</Card>
	);
}
