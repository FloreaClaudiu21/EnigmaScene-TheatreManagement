import { FilterParams } from "@/lib/types";
import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function ColumnCell({
	data,
	className,
	filters,
}: {
	data: any;
	className?: string;
	filters?: FilterParams[];
}) {
	if (filters && filters.length > 0) {
		return (
			<PushFilter className={className} filters={filters}>
				<div
					className={`flex flex-row items-start gap-1 justify-center text-center h-full break-all`}
				>
					{data}
				</div>
			</PushFilter>
		);
	}
	return (
		<div
			className={`flex flex-row items-start gap-1 justify-center text-center h-full break-all`}
		>
			{data}
		</div>
	);
}

export function PushFilter({
	children,
	className,
	filters,
}: {
	children: any;
	className?: string;
	filters: FilterParams[];
}) {
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const label = filters.length > 0 ? filters[0].label : "";
	const pushFilters = () => {
		if (filters.length <= 0) return "";
		filters.map((filter) => {
			if (
				params.has(filter.column) &&
				params.get(filter.column) == filter.value
			) {
				params.delete(filter.column);
			} else {
				params.set(filter.column, filter.value);
			}
		});
		return "./" + filters[0].page + "?" + params.toString();
	};
	return (
		<Link href={pushFilters()} className="cursor-pointer">
			<Tooltip size="sm" showArrow content={`Filtrează după '${label}'`}>
				<p className={className}>{children}</p>
			</Tooltip>
		</Link>
	);
}
