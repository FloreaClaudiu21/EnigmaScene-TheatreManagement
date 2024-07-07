import { BiletSpectacol, BonFiscal } from "@/lib/tipuri";

const BonFiscalHartie: React.FC<{
	data: BonFiscal;
}> = ({ data }) => {
	const bilete: BiletSpectacol[] = data.bileteSpectacol ?? [];
	let priceConvertedTotal = data.plata?.sumaPlatita ?? 0;
	const priceTotalWithoutVAT = priceConvertedTotal / 1.19;
	const vatAmountTotal = priceConvertedTotal - priceTotalWithoutVAT;
	return (
		<>
			<style type="text/css" media="print">
				{`
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            height: 100%;
						margin: 0 !important;
            padding: 0 !important;
						overflow: initial !important; 
          }
        `}
				1
			</style>
			<div className="flex flex-col w-[210mm] max-w-[210mm] min-h-[297mm] border-2">
				<div className="flex flex-col w-[90mm] min-h-[150mm] h-auto p-4 border-2">
					<div className="flex flex-col justify-center text-xs text-center">
						<p>SC ENIGMA SCENE SRL</p>
						<p>Teatrul Enigma Scene</p>
						<p>
							Primăria Municipiului București, Sectorul 2, Bulevardul
							Imaginației Nr. 123
						</p>
						<p>C.I.F.: RO15608527</p>
					</div>
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
								<p>{(priceTotalWithoutVAT + vatAmountTotal).toFixed(2)}</p>
							</div>
							<hr />
							<div className="flex flex-row justify-between py-2">
								<p>BRUT B</p>
								<p>{priceTotalWithoutVAT.toFixed(2)}</p>
							</div>
							<hr />
							<div className="flex flex-row justify-between py-2">
								<p>TOTAL TAXE:</p>
								<p>{vatAmountTotal.toFixed(2)}</p>
							</div>
							<hr />
							<p className="text-center pt-2">
								Vă dorim o vizionare plăcută a spectacolului. Dacă aveți nevoie
								de ceva în plus, nu ezitați să întrebați.
							</p>
						</div>
					</div>
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
							<p>
								{data.plata?.platitPe.toISOString().split("T")[1].split(".")[0]}
							</p>
						</div>
						<div className="mt-4">
							<p className="text-center">
								PLATA-
								{data.bileteSpectacol ? data.bileteSpectacol[0].numarBilet : ""}
							</p>
							<p className="font-bold text-center">BON FISCAL</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BonFiscalHartie;
