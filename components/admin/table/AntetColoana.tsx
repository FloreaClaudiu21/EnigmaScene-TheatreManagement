import { Button } from "@nextui-org/react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export default function AntetColoana({
	coloana,
	titlu,
}: {
	coloana: any;
	titlu: string;
}) {
	return (
		<div className="text-center overflow-hidden">
			<Button
				radius="md"
				variant="light"
				className="font-bold text-sm text-red-500"
				onClick={() => coloana.toggleSorting(coloana.getIsSorted() === "asc")}
			>
				{titlu}
				{coloana.getIsSorted() ? (
					coloana.getIsSorted() === "asc" ? (
						<ArrowUpIcon className="h-4 w-4" />
					) : (
						<ArrowDownIcon className="h-4 w-4" />
					)
				) : (
					""
				)}
			</Button>
		</div>
	);
}
