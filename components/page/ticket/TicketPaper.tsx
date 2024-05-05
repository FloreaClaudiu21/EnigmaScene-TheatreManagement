import QRCode from "react-qr-code";
import TicketHeader from "./TicketHeader";
import TicketMiddle from "./TicketMiddle";
import { BiletSpectacol } from "@/lib/types";

const TicketFooter = ({
	data,
	priceConverted,
}: {
	data: BiletSpectacol;
	priceConverted: any;
}) => {
	return (
		<div className="flex flex-row gap-2 w-full justify-between p-2">
			<div className="flex-1">
				{data.plata?.tipPlata}{" "}
				<span className="font-semibold">{data.bonFiscal?.numarBonFiscal}</span>{" "}
			</div>
			<p className="text-white font-semibold">
				{priceConverted.toFixed(0)} {data.plata?.rataDeSchimbValutar?.moneda}
			</p>
		</div>
	);
};

const TicketPrintPaper: React.FC<{
	data: BiletSpectacol;
}> = ({ data }) => {
	const cur = data.plata?.rataDeSchimbValutar;
	let priceConverted = data.plata?.sumaPlatita ?? 0;
	if (cur ?? "RON" != "RON") {
		priceConverted /= data.plata?.rataDeSchimbValutar?.valuare ?? 1;
	}
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
						<TicketHeader data={data} />
						<TicketMiddle data={data} />
						<TicketFooter data={data} priceConverted={priceConverted} />
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
export default TicketPrintPaper;
