import { Invoice, LanguageData } from "@/lib/types";
import InvoiceMiddle from "./InvoiceMiddlePaper";
import InvoiceHeader from "./InvoiceHeader";

const InvoiceFooter = ({ dict }: { dict: any }) => {
	return (
		<>
			<p className="text-xs text-gray-500 py-1 ml-8">
				{dict.invoice.footer.nosignature}
			</p>
			<div className="pt-1 h-10 text-center text-sm font-semibold">
				{dict.invoice.footer.title}
			</div>
		</>
	);
};

const InvoicePrintPaper: React.FC<{
	data: Invoice;
	langData: LanguageData;
}> = ({ data, langData }) => {
	const dict = langData.dictionary;
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
			<div className="flex flex-col w-[210mm] max-w-[210mm] h-[297mm] invoice-bg border-2 border-red-500">
				<InvoiceHeader invoice={data} langData={langData} />
				<InvoiceMiddle invoice={data} langData={langData} />
				<InvoiceFooter dict={dict} />
			</div>
		</>
	);
};
export default InvoicePrintPaper;
