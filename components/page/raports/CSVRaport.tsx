import React from "react";
import { mkConfig, generateCsv, download, ColumnHeader } from "export-to-csv";
import { Button } from "@nextui-org/react";
import { FileType2 } from "lucide-react";
import { RaportModal } from "@/services/StateProvider";
import { isDateValue, validRowsAndCols } from "@/lib/utils";
import { formatDateFull } from "@/lib/rangeOptions";

export default function CSVRaport({
	title,
	loadingRaport,
	raportModal,
}: {
	title: string;
	loadingRaport: boolean;
	raportModal: RaportModal;
}) {
	const data: any[] = [];
	const headers: ColumnHeader[] = [];
	const { rows, cols } = validRowsAndCols(raportModal);
	if (cols.length <= 0) {
		return (
			<Button
				size="sm"
				radius="md"
				color="primary"
				isDisabled={true}
				title="Nu au fost gasite date in tabel"
			>
				<FileType2 size={18} />
				Salvare CSV
			</Button>
		);
	}
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
			const isDate = isDateValue(value);
			map = {
				...map,
				[column.id]: isDate
					? formatDateFull(new Date(value))
					: type == "string"
					? value.replace("\n", " ")
					: value,
			};
		});
		if (Object.keys(map).length > 0) {
			data.push(map);
		}
	});
	const csvConfig = mkConfig({
		columnHeaders: headers,
		fieldSeparator: ";",
		filename: `${title}"-${new Date()
			.toISOString()
			.replace("T", "-")
			.replace("Z", "")}`,
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
			<FileType2 size={18} />
			Salvare CSV
		</Button>
	);
}
