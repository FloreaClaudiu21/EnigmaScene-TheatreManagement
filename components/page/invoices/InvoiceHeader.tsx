import { Invoice, LanguageData } from "@/lib/types";
import Image from "next/image";

const InvoiceHeader = ({
	invoice,
	langData,
}: {
	invoice: Invoice;
	langData: LanguageData;
}) => {
	const dictionary = langData.dictionary;
	return (
		<div className="flex flex-col h-[95.0mm] mx-8 my-2 mt-4 border-2 bg-white">
			<div className="flex flex-row gap-2">
				<div className="flex flex-1 flex-col text-center">
					<div className="flex flex-col border-2 w-[55%] text-xs m-1">
						<p className="text-lg font-bold">
							{dictionary.invoice.labels.invoice}
						</p>
						<p>#{invoice.invoiceNumber}</p>
						<p>
							{dictionary.invoice.labels.series} {invoice.invoiceSeries}
						</p>
						<p>
							{dictionary.invoice.labels.date}{" "}
							{invoice.issueDate.toLocaleDateString()}
						</p>
						<p>{dictionary.invoice.labels.vatRate}</p>
						<p>{dictionary.invoice.labels.vatOnReceipt}</p>
					</div>
				</div>
				<div className="p-2">
					<Image
						src={"/images/logo.webp"}
						alt=""
						width={130}
						height={110}
						className="h-full w-44 max-h-[110px] object-fill"
					/>
				</div>
			</div>
			<div className="flex flex-row gap-2">
				<div className="flex flex-col w-1/2 p-2 place-items-start">
					<p className="font-bold text-sm">
						{dictionary.invoice.supplier.label}
					</p>
					<p className="font-bold text-md text-red-500">SC ENIGMA SCENE SRL</p>
					<p className="text-xs text-left">CIF: RO15608527</p>
					<p className="text-xs text-left">Reg. com.: J40/5967/2000</p>
					<p className="text-xs text-left">
						{dictionary.invoice.supplier.address}
					</p>
					<p className="text-xs text-left">IBAN: RO35BTRLRONCRT0296182901</p>
					<p className="text-xs text-left">
						{dictionary.invoice.supplier.bank}
					</p>
					<p className="text-xs text-left">
						{dictionary.invoice.supplier.phone}
					</p>
					<p className="text-xs">Email: contact@enigmascene.website</p>
					<p className="text-xs">{dictionary.invoice.supplier.socialCapital}</p>
				</div>
				<div className="flex flex-col w-1/2 p-2 place-items-end">
					<p className="font-bold text-sm">Client</p>
					<p className="font-bold text-md text-red-500 text-right">
						{invoice.firstName} {invoice.lastName}
					</p>
					<p className="text-xs text-right">
						{dictionary.invoice.client.billingAddress} {invoice.billingAddress}
					</p>
					<p className="text-xs text-right">
						{dictionary.invoice.client.phone} {invoice.phone}
					</p>
					<p className="text-xs text-right">
						{dictionary.invoice.client.email} {invoice.email}
					</p>
				</div>
			</div>
		</div>
	);
};

export default InvoiceHeader;
