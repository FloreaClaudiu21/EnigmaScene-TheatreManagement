import { BonFiscal } from "@/lib/types";
import React from "react";

export default function FiscalReceiptFooter({ data }: { data: BonFiscal }) {
	console.log(data);
	return (
		<div className="flex flex-col mt-4 gap-1 text-xs">
			<div className="flex flex-row justify-between">
				<p>CASIER: </p>
				<p>RADU POPA</p>
			</div>
			<div className="flex flex-row justify-between">
				<p>CASA:</p>
				<p>1</p>
			</div>
			<div className="flex flex-row justify-between">
				<p>NUMAR BON:</p>
				<p>
					{data.serieBonFiscal}-{data.numarBonFiscal}
				</p>
			</div>
			<div className="flex flex-row justify-between">
				<p>{data.plata?.platitPe.toISOString().split("T")[0]}</p>
				<p>{data.plata?.platitPe.toISOString().split("T")[1].split(".")[0]}</p>
			</div>
			<div className="mt-4">
				<p className="text-center">
					PLATA-
					{data.bileteSpectacol ? data.bileteSpectacol[0].numarBilet : ""}
				</p>
				<p className="font-bold text-center">BON FISCAL</p>
			</div>
		</div>
	);
}
