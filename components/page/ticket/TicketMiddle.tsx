import { formatDateFull } from "@/lib/rangeOptions";
import { BiletSpectacol } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import React from "react";

export default function TicketMiddle({ data }: { data: BiletSpectacol }) {
	return (
		<div className="flex-1 flex-col gap-1 py-4 my-2 border-y-2 border-red-500">
			<div className="flex flex-col justify-between px-3">
				<p className="text-red-500 font-lg font-bold">SPECTACOL:</p>
				<p className="text-left text-sm">
					`{data.spectacol?.titlu}`{" "}
					{capitalizeFirstLetter(
						formatDateFull(new Date(data.spectacol?.oraIncepere ?? ""))
					)}
				</p>
			</div>
			<div className="flex flex-col mt-1">
				<table>
					<thead className="text-red-500 text-lg">
						<th>SALA</th>
						<th>RANDUL</th>
						<th>NUMAR LOC</th>
					</thead>
					<tbody>
						<tr className="text-center">
							<td>{data.salaSpectacol?.numarSala}</td>
							<td>{data.locSalaSpectacol?.rand}</td>
							<td>
								{data.locSalaSpectacol?.numarLoc}{" "}
								{data.locSalaSpectacol?.tipLoc}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
