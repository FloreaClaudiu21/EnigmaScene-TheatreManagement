import React from "react";

export default function FiscalReceiptMiddle({
	dict,
	data,
	lang,
	vatAmount,
	priceConverted,
	priceWithoutVat,
}: {
	lang: any;
	dict: any;
	data: any;
	vatAmount: number;
	priceWithoutVat: number;
	priceConverted: number;
}) {
	return (
		<div className="flex flex-col text-sm">
			<div className="text-center my-6">
				<p className="font-bold">{dict.receipt.middle.receipt}</p>
				<p>{dict.receipt.middle.daily}</p>
				<p>{dict.receipt.middle.welcome}</p>
			</div>
			<div className="mb-4">
				{dict.receipt.middle.show} `
				{lang == "ro" ? data.show?.title : data.show?.title_en}` 1{" "}
				{dict.receipt.middle.piece} x {priceConverted.toFixed(2)}
			</div>
			<div>
				<div className="flex flex-row justify-between py-2">
					<p>SUBTOTAL</p>
					<p>{priceConverted.toFixed(2)}</p>
				</div>
				<hr />
				<div className="flex flex-col justify-between py-2">
					<p>TOTAL: {priceConverted.toFixed(2)}</p>
					<p>
						{data.payment?.type} {priceConverted.toFixed(2)}{" "}
						{data.payment?.currency}
					</p>
				</div>
				<hr />
				<div className="flex flex-row justify-between py-2">
					<p>{dict.receipt.middle.vat}</p>
					<p>{dict.receipt.middle.value}</p>
					<p>TOTAL</p>
				</div>
				<hr />
				<div className="flex flex-row justify-between py-2">
					<p>{dict.receipt.middle.vat} 19%</p>
					<p>{vatAmount.toFixed(2)}</p>
					<p>{(priceWithoutVat + vatAmount).toFixed(2)}</p>
				</div>
				<hr />
				<div className="flex flex-row justify-between py-2">
					<p>{dict.receipt.middle.totalTaxes}</p>
					<p>{vatAmount.toFixed(2)}</p>
				</div>
				<hr />
				<p className="text-center pt-2">{dict.receipt.middle.ty}</p>
			</div>
		</div>
	);
}
