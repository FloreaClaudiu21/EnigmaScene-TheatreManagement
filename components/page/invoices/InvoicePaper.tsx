import InvoiceMiddle from "./InvoiceMiddlePaper";
import InvoiceHeader from "./InvoiceHeader";
import { FacturaFiscala } from "@/lib/types";

const InvoiceFooter = () => {
	return (
		<>
			<p className="text-xs text-gray-500 py-1 ml-8">
				Factura este valabilă fără semnătură și ștampilă, conform Articolului
				319 alineatul 29 din Legea 227/2015.
			</p>
			<div className="pt-1 h-10 text-center text-sm font-semibold">
				Pagina 1 din 1
			</div>
		</>
	);
};

const InvoicePrintPaper: React.FC<{
	data: FacturaFiscala;
}> = ({ data }) => {
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
			<div className="flex flex-col w-[210mm] max-w-[210mm] min-h-[297mm] invoice-bg border-2 border-red-500">
				<InvoiceHeader invoice={data} />
				<InvoiceMiddle invoice={data} />
				<InvoiceFooter />
			</div>
		</>
	);
};
export default InvoicePrintPaper;
