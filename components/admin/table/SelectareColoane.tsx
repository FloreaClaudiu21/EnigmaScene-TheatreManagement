import { Checkbox } from "@nextui-org/react";
import React from "react";

export function ColoanaSelecteazaCapTabel({ table }: { table: any }) {
	return (
		<div className="flex flex-row items-center justify-center text-center">
			<Checkbox
				radius="md"
				onChange={(event) => {
					table.toggleAllPageRowsSelected(event.target.checked);
				}}
				isIndeterminate={table.getIsSomePageRowsSelected()}
				isSelected={table.getIsAllPageRowsSelected()}
			/>
		</div>
	);
}

export function ColoanaSelecteazaRand({ row }: { row: any }) {
	return (
		<div className="flex flex-row items-center justify-center text-center">
			<Checkbox
				radius="md"
				onChange={(event) => {
					row.toggleSelected(event.target.checked);
				}}
				isSelected={row.getIsSelected()}
			/>
		</div>
	);
}