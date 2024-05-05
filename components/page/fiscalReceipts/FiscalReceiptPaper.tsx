import FiscalReceiptHeader from "./FiscalReceiptHeader";
import FiscalReceiptMiddle from "./FiscalReceiptMiddle";
import FiscalReceiptFooter from "./FiscalReceiptFooter";
import { BonFiscal } from "@/lib/types";

const FiscalReceiptPaper: React.FC<{
	data: BonFiscal;
}> = ({ data }) => {
	const cur = data.plata?.rataDeSchimbValutar;
	let priceConvertedTotal = data.plata?.sumaPlatita ?? 0;
	if (cur ?? "RON" != "RON") {
		priceConvertedTotal /= data.plata?.rataDeSchimbValutar?.valuare ?? 1;
	}
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
					<FiscalReceiptHeader />
					<FiscalReceiptMiddle
						data={data}
						priceConvertedTotal={priceConvertedTotal}
						priceTotalWithoutVat={priceTotalWithoutVAT}
						vatAmountTotal={vatAmountTotal}
					/>
					<FiscalReceiptFooter data={data} />
				</div>
			</div>
		</>
	);
};

export default FiscalReceiptPaper;
