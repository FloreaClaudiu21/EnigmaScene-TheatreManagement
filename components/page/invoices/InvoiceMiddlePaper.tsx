"use client";
import { Invoice, LanguageData } from "@/lib/types";

function InvoiceMiddle({
	invoice,
	langData,
}: {
	invoice: Invoice;
	langData: LanguageData;
}) {
	const cur = invoice.currency;
	const lang = langData.language;
	const dictionary = langData.dictionary;
	let priceConverted = invoice.totalAmount;
	if (cur != "RON") {
		priceConverted /= invoice.currencyAmount;
	}
	const priceWithoutVAT = priceConverted / 1.19;
	const vatAmount = priceConverted - priceWithoutVAT;
	const ticket = invoice.ticketId != null ? invoice.ticket : undefined;
	return (
		<div className="flex flex-1 mx-8 border-2 bg-white">
			<div className="flex flex-col w-full">
				<table className="invoice-table">
					<tr className="text-center break-normal place-items-center bg-red-500 text-white text-[13px] font-bold">
						<th>
							<span>{dictionary.invoice.table.number}</span>
						</th>
						<th>
							<span>{dictionary.invoice.table.productService}</span>
						</th>
						<th>
							<span>{dictionary.invoice.table.unitMeasure}</span>
						</th>
						<th>
							<span>{dictionary.invoice.table.quantity}</span>
						</th>
						<th>
							<span>
								{dictionary.invoice.table.unitPriceExVAT} <br /> --{cur}--
							</span>
						</th>
						<th>
							<span>
								{dictionary.invoice.table.value} <br /> --{cur}--
							</span>
						</th>
						<th>
							<span>
								{dictionary.invoice.table.vatValue} <br /> --{cur}--
							</span>
						</th>
						<th>
							<span>
								{dictionary.invoice.table.unitPriceIncVAT} <br /> --{cur}--
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
						<tr className="border-y-2 min-h-11 h-11">
							<td className="border-r-2">1</td>
							<td className="max-w-[200px] border-r-2">
								{dictionary.invoice.middle.text
									.replace(
										"{title}",
										lang == "ro" ? ticket?.show?.title : ticket?.show?.title_en
									)
									.replace("{number}", ticket?.seat?.number)
									.replace("{type}", ticket?.showRoom?.number)}
							</td>
							<td className="border-r-2 min-w-10">
								{dictionary.invoice.table.show}
							</td>
							<td className="border-r-2">1</td>
							<td className="border-r-2">{priceWithoutVAT.toFixed(2)}</td>
							<td className="border-r-2">{priceWithoutVAT.toFixed(2)}</td>
							<td className="border-r-2">{vatAmount.toFixed(2)}</td>
							<td>{(priceWithoutVAT + vatAmount).toFixed(2)}</td>
						</tr>
						<tr></tr>
						{Array.from({ length: 8 }).map((v, index) => {
							return (
								<tr key={index} className="border-y-2 min-h-11 h-11">
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
								{(priceWithoutVAT + vatAmount).toFixed(2)}
							</p>
							<p className="font-bold flex-1 text-center text-xs">
								{priceWithoutVAT.toFixed(2)}
							</p>
							<div className="font-bold flex flex-col justify-center place-items-center text-xs">
								<p>{vatAmount.toFixed(2)}</p>
								<p>{dictionary.invoice.table.vatOnCollection}</p>
							</div>
						</div>
					</div>
					<div className="flex flex-row w-full bg-gray-200 py-1 flex-1">
						<div className="w-1/2"></div>
						<div className="flex flex-row justify-evenly w-1/2 p-1 place-items-center text-red-500">
							<p className="font-bold text-sm">
								{dictionary.invoice.totalPayment}
							</p>
							<p className="font-bold flex-1 text-right text-sm">
								{(priceWithoutVAT + vatAmount).toFixed(2)}
							</p>
						</div>
					</div>
					<div className="flex flex-row w-full flex-1 px-2">
						<div className="flex flex-col w-1/2">
							<p className="font-bold text-sm">
								{dictionary.invoice.dispatchDate}
							</p>
							<p className="text-xs">
								{dictionary.invoice.by} {invoice.firstName} {invoice.lastName}
							</p>
							<p className="text-xs">
								{dictionary.invoice.dispatchedInOurPresence}{" "}
								{new Date().toLocaleDateString()}
							</p>
							<p className="text-xs">{dictionary.invoice.signatures}</p>
						</div>
						<div className="flex flex-col w-1/2 place-items-end">
							<p className="font-bold text-sm">
								{dictionary.invoice.receivingSignature}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InvoiceMiddle;
