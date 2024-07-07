"use client";
import QRCode from "react-qr-code";
import { BiletSpectacol } from "@/lib/tipuri";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import { capitalizeazaPrimaLitera } from "@/lib/metodeUtile";
import { Image } from "@nextui-org/react";

const BiletSpectacolHartie: React.FC<{
	data: BiletSpectacol;
}> = ({ data }) => {
	let priceConverted = data.plata?.sumaPlatita ?? 0;
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
			</style>
			<div className="flex flex-col w-[210mm] max-w-[210mm] h-[297mm] border-2">
				<div className="flex flex-row w-[155mm] min-h-[65mm] bg-[#eee] border-4 border-red-500 ticket-bg">
					<div className="flex flex-col w-[60%] border-r-2 border-red-500">
						<div className="flex flex-row place-items-center justify-center px-2 pt-1 h-12">
							<Image
								src={"/images/logo.webp"}
								alt="No Image"
								className="w-56"
							/>
							<div className="w-full text-right ">
								<p className="text-red-500 text-xl font-bold">Nr. Bilet</p>
								<p className="text-sm">#{data.numarBilet}</p>
							</div>
						</div>
						<div className="flex-1 flex-col gap-1 py-4 my-2 border-y-2 border-red-500">
							<div className="flex flex-col justify-between px-3">
								<p className="text-red-500 font-lg font-bold">SPECTACOL:</p>
								<p className="text-left text-sm">
									`{data.spectacol?.titlu}`{" "}
									{capitalizeazaPrimaLitera(
										formateazaDataComplet(
											new Date(data.spectacol?.oraIncepere ?? "")
										)
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
						<div className="flex flex-row gap-2 w-full justify-between p-2">
							<div className="flex-1">
								{data.plata?.tipPlata}{" "}
								<span className="font-semibold">
									{data.bonFiscal?.numarBonFiscal}
								</span>{" "}
							</div>
							<p className="text-white font-semibold">
								{priceConverted.toFixed(0)} RON
							</p>
						</div>
					</div>
					<div className="flex w-[40%] place-items-center px-4">
						<QRCode
							value={data.codBiletSpectacol + "|" + data.numarBilet}
							className="h-[65%]"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default BiletSpectacolHartie;
