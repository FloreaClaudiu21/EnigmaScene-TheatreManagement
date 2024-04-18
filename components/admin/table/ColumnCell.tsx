import { Button } from "@nextui-org/react";
import React from "react";

export default function ColumnCell({ data }: { data: any }) {
	return (
		<div className="flex flex-row items-center justify-center text-center">
			<Button
				radius="md"
				variant="light"
				onClick={() => navigator.clipboard.writeText(data)}
			>
				{data}
			</Button>
		</div>
	);
}
