import React from "react";

export default function FiscalReceiptHeader({ dict }: { dict: any }) {
	return (
		<div className="flex flex-col justify-center text-xs text-center">
			<p>SC ENIGMA SCENE SRL</p>
			<p>{dict.receipt.header.name}</p>
			<p>{dict.receipt.header.address}</p>
			<p>C.I.F.: RO15608527</p>
		</div>
	);
}
