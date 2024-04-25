import { FiscalReceipt, LanguageData } from "@/lib/types";
import FiscalReceiptHeader from "./FiscalReceiptHeader";
import FiscalReceiptMiddle from "./FiscalReceiptMiddle";
import FiscalReceiptFooter from "./FiscalReceiptFooter";

const FiscalReceiptPaper: React.FC<{
	data: FiscalReceipt;
	langData: LanguageData;
}> = ({ data, langData }) => {
	const lang = langData.language;
	const dict = langData.dictionary;
	const cur = data.payment?.currency;
	let priceConverted = data.invoice?.totalAmount ?? 0;
	if (cur != "RON") {
		priceConverted /= data.invoice?.currencyAmount ?? 0;
	}
	const priceWithoutVAT = priceConverted / 1.19;
	const vatAmount = priceConverted - priceWithoutVAT;
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
			<div className="flex flex-col w-[210mm] max-w-[210mm] h-[297mm] border-2">
				<div className="flex flex-col w-[90mm] min-h-[150mm] h-auto p-4 border-2">
					<FiscalReceiptHeader dict={dict} />
					<FiscalReceiptMiddle
						lang={lang}
						data={data}
						dict={dict}
						priceConverted={priceConverted}
						priceWithoutVat={priceWithoutVAT}
						vatAmount={vatAmount}
					/>
					<FiscalReceiptFooter data={data} dict={dict} />
				</div>
			</div>
		</>
	);
};

export default FiscalReceiptPaper;
