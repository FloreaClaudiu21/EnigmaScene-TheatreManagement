import React from "react";

export default function TicketMiddle({
	data,
	langData,
}: {
	data: any;
	langData: any;
}) {
	const dict = langData.dictionary;
	return (
		<div className="flex-1 flex-col gap-1 py-4 my-2 border-y-2 border-red-500">
			<div className="flex flex-col justify-between px-3">
				<p className="text-red-500 font-lg font-bold">
					{dict.ticket.middle.show}
				</p>
				<p className="text-left text-sm">
					`{langData.language == "ro" ? data.show?.title : data.show?.title_en}`{" "}
					{new Date(data.show?.startTime ?? "")
						.toUTCString()
						.replace(" GMT", "")}
				</p>
			</div>
			<div className="flex flex-col mt-1">
				<table>
					<thead className="text-red-500 text-lg">
						<th>{dict.ticket.middle.room}</th>
						<th>{dict.ticket.middle.row}</th>
						<th>{dict.ticket.middle.seat}</th>
					</thead>
					<tbody>
						<tr className="text-center">
							<td>{data.showRoom?.number}</td>
							<td>{data.seat?.row}</td>
							<td>
								{data.seat?.number} {data.seat?.type}
							</td>
						</tr>
					</tbody>
				</table>
				{/* <div className="flex flex-row text-red-500 font-lg font-bold justify-between">
					<span>{dict.ticket.middle.room}</span>
					<span>{dict.ticket.middle.row}</span>
					<span>{dict.ticket.middle.seat}</span>
				</div>
				<div className="flex flex-row font-md justify-between">
					<span>{data.showRoom?.number}</span>
					<span>{data.seat?.row}</span>
					<span>
						{data.seat?.number} {data.seat?.type}
					</span>
				</div> */}
			</div>
		</div>
	);
}
