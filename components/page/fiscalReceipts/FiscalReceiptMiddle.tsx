import { BiletSpectacol, BonFiscal } from "@/lib/types";
import React from "react";

export default function FiscalReceiptMiddle({
	data,
	vatAmountTotal,
	priceConvertedTotal,
	priceTotalWithoutVat,
}: {
	data: BonFiscal;
	vatAmountTotal: number;
	priceTotalWithoutVat: number;
	priceConvertedTotal: number;
}) {
	const bilete: BiletSpectacol[] = data.bileteSpectacol ?? [];
	return (
		<div className="flex flex-col text-sm">
			<div className="text-center my-6">
				<p className="font-bold">--------- BON FISCAL ---------</p>
				<p>ZILNIC 08:00 - 22:00</p>
				<p>BUN VENIT LA TEATRUL NOSTRU!</p>
			</div>
			<div className="flex flex-col gap-1 mb-4">
				{bilete.map((bilet) => {
					let priceConverted = bilet.locSalaSpectacol?.pretLoc ?? 0;
					return (
						<div
							key={bilet.codBiletSpectacol}
							className="flex flex-row gap-1 place-items-center"
						>
							<p className="flex-1">
								Bilet Spectacol `{bilet.spectacol?.titlu}` Sala `
								{bilet.salaSpectacol?.numarSala}` Loc `
								{bilet.locSalaSpectacol?.numarLoc} -{" "}
								{bilet.locSalaSpectacol?.tipLoc}`
							</p>
							<p>1 BUC x {priceConverted.toFixed(2)}</p>
						</div>
					);
				})}
			</div>
			<div>
				<div className="flex flex-row justify-between py-2">
					<p>SUBTOTAL</p>
					<p>{priceConvertedTotal.toFixed(2)}</p>
				</div>
				<hr />
				<div className="flex flex-col justify-between py-2">
					<p>TOTAL: {priceConvertedTotal.toFixed(2)}</p>
					<p>
						{data.plata?.tipPlata} {priceConvertedTotal.toFixed(2)} RON
					</p>
				</div>
				<hr />
				<div className="flex flex-row justify-between py-2">
					<p>TVA</p>
					<p>VALUARE</p>
					<p>TOTAL</p>
				</div>
				<hr />
				<div className="flex flex-row justify-between py-2">
					<p>TVA 19%</p>
					<p>{vatAmountTotal.toFixed(2)}</p>
					<p>{(priceTotalWithoutVat + vatAmountTotal).toFixed(2)}</p>
				</div>
				<hr />
				<div className="flex flex-row justify-between py-2">
					<p>BRUT B</p>
					<p>{priceTotalWithoutVat.toFixed(2)}</p>
				</div>
				<hr />
				<div className="flex flex-row justify-between py-2">
					<p>TOTAL TAXE:</p>
					<p>{vatAmountTotal.toFixed(2)}</p>
				</div>
				<hr />
				<p className="text-center pt-2">
					Vă dorim o vizionare plăcută a spectacolului. Dacă aveți nevoie de
					ceva în plus, nu ezitați să întrebați.
				</p>
			</div>
		</div>
	);
}
