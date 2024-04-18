import { Button } from "@nextui-org/react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";

export default function ColumnHeader({
	column,
	title,
}: {
	column: any;
	title: string;
}) {
	return (
		<div className="text-center">
			<Button
				radius="md"
				variant="light"
				className="font-bold"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{title}
				{column.getIsSorted() ? (
					column.getIsSorted() === "asc" ? (
						<ArrowUpIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownIcon className="ml-2 h-4 w-4" />
					)
				) : (
					""
				)}
			</Button>
		</div>
	);
}
