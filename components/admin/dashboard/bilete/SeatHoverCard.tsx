"use client";
import { LocSalaSpectacol } from "@/lib/types";
import React from "react";

export default function SeatHoverCard({
	loc,
	locOcupat,
}: {
	loc: LocSalaSpectacol;
	locOcupat: boolean;
}) {
	return (
		<div className="flex flex-col gap-2 text-sm">
			<div className="flex flex-row gap-1">
				<p className="text-red-500 font-bold">Cod Loc:</p>
				<p className="flex-1 text-right text-sm">{loc.codLocSala}</p>
			</div>
			<div className="flex flex-row gap-1">
				<p className="text-red-500 font-bold">Numar Loc:</p>
				<p className="flex-1 text-right text-sm">{loc.numarLoc}</p>
			</div>
			<div className="flex flex-row gap-1">
				<p className="text-red-500 font-bold">Rand Loc:</p>
				<p className="flex-1 text-right text-sm">{loc.rand}</p>
			</div>
			<div className="flex flex-row gap-1">
				<p className="text-red-500 font-bold">Pret Loc:</p>
				<p className="flex-1 text-right text-sm">{loc.pretLoc} RON</p>
			</div>
			<div className="flex flex-row gap-1">
				<p className="text-red-500 font-bold">Tip Loc:</p>
				<p className="flex-1 text-right text-sm">{loc.tipLoc}</p>
			</div>
			<div className="flex flex-row gap-1">
				<p className="text-red-500 font-bold">Ocupat:</p>
				<p className="flex-1 text-right text-sm">{locOcupat ? "DA" : "NU"}</p>
			</div>
		</div>
	);
}
