"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RANGE_OPTIONS, setRange } from "@/lib/rangeOptions";
import { subDays } from "date-fns";
import { CalendarClockIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

export default function ChartDateSelector({
	searchParams,
	queryKey,
	selectedRange,
}: {
	selectedRange: any;
	searchParams: any;
	queryKey: string;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: subDays(new Date(), 30),
		to: new Date(),
	});
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="sm"
					variant={"default"}
					className="justify-items-center ml-auto gap-1"
				>
					{selectedRange.label}
					<CalendarClockIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{Object.entries(RANGE_OPTIONS).map(([key, value]) => (
					<DropdownMenuItem
						onClick={() =>
							setRange(
								router,
								pathname,
								searchParams,
								queryKey,
								key as keyof typeof RANGE_OPTIONS
							)
						}
						key={key}
					>
						{value.label}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>Customizare</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<div>
							<Calendar
								mode="range"
								disabled={{ after: new Date() }}
								selected={dateRange}
								defaultMonth={dateRange?.from}
								onSelect={setDateRange}
								numberOfMonths={2}
							/>
							<DropdownMenuItem className="hover:bg-auto">
								<Button
									onClick={() => {
										if (dateRange == null) return;
										setRange(
											router,
											pathname,
											searchParams,
											queryKey,
											dateRange
										);
									}}
									disabled={dateRange == null}
									className="w-full"
								>
									Trimite
								</Button>
							</DropdownMenuItem>
						</div>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
