"use client";
import { FacturaFiscala } from "@/lib/types";

function InvoiceMiddle({ invoice }: { invoice: FacturaFiscala }) {
	const cur = invoice.plata?.rataDeSchimbValutar;
	let priceConvertedTotal = invoice.sumaPlatita;
	if (cur ?? "RON" != "RON") {
		priceConvertedTotal /= invoice.plata?.rataDeSchimbValutar?.valuare ?? 1;
	}
	const priceTotalWithoutVAT = priceConvertedTotal / 1.19;
	const vatAmountTotal = priceConvertedTotal - priceTotalWithoutVAT;
	const bilete = invoice.bileteSpectacol ?? [];
	return (
		<div className="flex flex-1 mx-8 border-2 bg-white">
			<div className="flex flex-col w-full">
				<table className="invoice-table">
					<tr className="text-center break-normal place-items-center bg-red-500 text-white text-[13px] font-bold">
						<th>
							<span>Nr. crt</span>
						</th>
						<th>
							<span>Descriere Produs/Serviciu</span>
						</th>
						<th>
							<span>U.M.</span>
						</th>
						<th>
							<span>Cantitate</span>
						</th>
						<th>
							<span>
								Preț Unitar (Fără TVA) <br /> --{cur?.moneda}--
							</span>
						</th>
						<th>
							<span>
								Valoare <br /> --{cur?.moneda}--
							</span>
						</th>
						<th>
							<span>
								Valoare TVA <br /> --{cur?.moneda}--
							</span>
						</th>
						<th>
							<span>
								Preț Unitar (Incl. TVA) <br /> --{cur?.moneda}--
							</span>
						</th>
					</tr>
					<tbody className="h-full text-center text-xs">
						<tr>
							<td>
								<span>0</span>
							</td>
							<td>
								<span>1</span>
							</td>
							<td>
								<span>2</span>
							</td>
							<td>
								<span>3</span>
							</td>
							<td>
								<span>4</span>
							</td>
							<td>
								<span>5(3x4)</span>
							</td>
							<td>
								<span>6</span>
							</td>
							<td>
								<span>7(5+6)</span>
							</td>
						</tr>
						{bilete.map((bilet, index) => {
							let priceConverted = bilet.locSalaSpectacol?.pretLoc ?? 0;
							if (cur ?? "RON" != "RON") {
								priceConverted /=
									invoice.plata?.rataDeSchimbValutar?.valuare ?? 1;
							}
							const priceWithoutVAT = priceConverted / 1.19;
							const vatAmount = priceConverted - priceWithoutVAT;
							return (
								<tr
									key={bilet.codBiletSpectacol}
									className="border-y-2 min-h-12 h-auto"
								>
									<td className="border-r-2">{index + 1}</td>
									<td className="max-w-[200px] border-r-2 break-words p-1">
										Bilet Spectacol `{bilet.spectacol?.titlu}`, in sala
										spectacol `{bilet.salaSpectacol?.numarSala}`, locul `
										{bilet.locSalaSpectacol?.numarLoc} -{" "}
										{bilet.locSalaSpectacol?.tipLoc}`.
									</td>
									<td className="border-r-2 min-w-10">BUC</td>
									<td className="border-r-2">1</td>
									<td className="border-r-2">{priceWithoutVAT.toFixed(2)}</td>
									<td className="border-r-2">{priceWithoutVAT.toFixed(2)}</td>
									<td className="border-r-2">{vatAmount.toFixed(2)}</td>
									<td>{(priceWithoutVAT + vatAmount).toFixed(2)}</td>
								</tr>
							);
						})}
						{Array.from({ length: 10 - bilete.length }).map((v, index) => {
							return (
								<tr key={index} className="border-y-2 min-h-10 h-10">
									<td className="border-r-2"></td>
									<td className="max-w-[200px] border-r-2"></td>
									<td className="border-r-2 min-w-10"></td>
									<td className="border-r-2"></td>
									<td className="border-r-2"></td>
									<td className="border-r-2"></td>
									<td className="border-r-2"></td>
									<td></td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className="flex-1 min-w-full">
					<div className="flex flex-row">
						<div className="w-1/2"></div>
						<div className="flex flex-row justify-evenly w-1/2 p-1 place-items-center">
							<p className="font-bold text-sm">
								{(priceTotalWithoutVAT + vatAmountTotal).toFixed(2)}
							</p>
							<p className="font-bold flex-1 text-center text-xs">
								{priceTotalWithoutVAT.toFixed(2)}
							</p>
							<div className="font-bold flex flex-col justify-center place-items-center text-xs">
								<p>{vatAmountTotal.toFixed(2)}</p>
								<p>TVA la colectare</p>
							</div>
						</div>
					</div>
					<div className="flex flex-row w-full bg-gray-200 py-1 flex-1">
						<div className="w-1/2"></div>
						<div className="flex flex-row justify-evenly w-1/2 p-1 place-items-center text-red-500">
							<p className="font-bold text-sm">Total Plată</p>
							<p className="font-bold flex-1 text-right text-sm">
								{(priceTotalWithoutVAT + vatAmountTotal).toFixed(2)}
							</p>
						</div>
					</div>
					<div className="flex flex-row w-full flex-1 px-2">
						<div className="flex flex-col w-1/2">
							<p className="font-bold text-sm">Data Expedierii</p>
							<p className="text-xs">De: {invoice.numeClient}</p>
							<p className="text-xs">
								Expediat în prezența noastră la{" "}
								{new Date().toLocaleDateString()}
							</p>
							<p className="text-xs">Semnături</p>
						</div>
						<div className="flex flex-col w-1/2 place-items-end">
							<p className="font-bold text-sm">Semnătura de primire</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InvoiceMiddle;
