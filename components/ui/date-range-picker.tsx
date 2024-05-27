"use client";

import * as React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { formatDate } from "@/lib/rangeOptions";

export function DatePickerWithRange({
	className,
	date,
	setDate,
}: {
	className?: string;
	date: DateRange | undefined;
	setDate: any;
}) {
	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						size="sm"
						variant="outline"
						className={cn(
							"min-w-[270px] w-full justify-start text-left font-normal rounded-lg h-10 border-2",
							!date && "text-muted-foreground",
							className
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<span className="text-sm">
									{formatDate(date.from)} - {formatDate(date.to)}
								</span>
							) : (
								<span className="text-sm">{formatDate(date.from)}</span>
							)
						) : (
							<span className="text-sm">Alege o data</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0 z-[99999]" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
