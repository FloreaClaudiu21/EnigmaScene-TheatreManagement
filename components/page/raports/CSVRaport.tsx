import React from "react";
import { mkConfig, generateCsv, download, ColumnHeader } from "export-to-csv";
import { Button } from "@nextui-org/react";
import { FileType2 } from "lucide-react";
import { RaportModal } from "@/services/StateProvider";
import { validRowsAndCols } from "@/lib/utils";

export default function CSVRaport({
	dict,
	title,
	loadingRaport,
	raportModal,
}: {
	dict: any;
	title: string;
	loadingRaport: boolean;
	raportModal: RaportModal;
}) {
	const data: any[] = [];
	const headers: ColumnHeader[] = [];
	const { rows, cols } = validRowsAndCols(raportModal);
	cols.map((col) => {
		headers.push({
			key: col.id,
			displayLabel: col.id,
		});
	});
	rows.map((row) => {
		let map = {};
		cols.map((column) => {
			const value = row.original[column.id];
			const type = typeof value;
			map = {
				...map,
				[column.id]: type == "string" ? value.replace("\n", "") : value,
			};
		});
		if (Object.keys(map).length > 0) {
			data.push(map);
		}
	});
	const csvConfig = mkConfig({
		columnHeaders: headers,
		filename: `${title}"-${new Date().toISOString().replace("T", "-")}`,
	});
	const csv = generateCsv(csvConfig)(data);
	return (
		<Button
			size="sm"
			radius="md"
			color="primary"
			isDisabled={loadingRaport}
			onClick={() => download(csvConfig)(csv)}
		>
			<FileType2 className="h-10 w-10" />
			{dict.buttons.saveCSV}
		</Button>
	);
}
