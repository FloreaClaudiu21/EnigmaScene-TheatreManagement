import React from "react";

export default function FiscalReceiptFooter({
	dict,
	data,
}: {
	dict: any;
	data: any;
}) {
	return (
		<div className="flex flex-col mt-4 gap-1 text-xs">
			<div className="flex flex-row justify-between">
				<p>{dict.receipt.footer.cashier}</p>
				<p>RADU POPA</p>
			</div>
			<div className="flex flex-row justify-between">
				<p>{dict.receipt.footer.home}</p>
				<p>1</p>
			</div>
			<div className="flex flex-row justify-between">
				<p>{dict.receipt.footer.receiptNO}</p>
				<p>
					{data.receiptSeries}-{data.receiptNumber}
				</p>
			</div>
			<div className="flex flex-row justify-between">
				<p>{data.payment?.paidAt.toISOString().split("T")[0]}</p>
				<p>{data.payment?.paidAt.toISOString().split("T")[1].split(".")[0]}</p>
			</div>
			<div className="mt-4">
				<p className="text-center">TICKET-{data.ticket?.number}</p>
				<p className="font-bold text-center">{dict.receipt.footer.receipt}</p>
			</div>
		</div>
	);
}
