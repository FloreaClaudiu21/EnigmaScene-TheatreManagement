import DeleteModalGeneral from "@/components/admin/modals/DeleteModal";
import AdminSignInModal from "@/components/admin/modals/SignInModal";
import DictionaryProvider from "@/components/dictionary-provider";
import AddAdressModal from "@/components/page/addAddressModal";
import DeleteAddressModal from "@/components/page/deleteAddressModal";
import FiscalReceiptModal from "@/components/page/fiscalReceipts/FiscalReceiptModal";
import InvoiceModal from "@/components/page/invoices/InvoiceModal";
import RaportModal from "@/components/page/raports/RaportModal";
import TicketModal from "@/components/page/ticket/TicketModal";
import { generateDictionary } from "@/lib/dictionary";
import React from "react";

export default async function LangLayout({
	params,
	children,
}: {
	params: any;
	children: any;
}) {
	const dict = await generateDictionary(params);
	return (
		<>
			<DictionaryProvider dictionary={dict.dictionary}>
				{children}
			</DictionaryProvider>
			<TicketModal langData={dict} />
			<InvoiceModal langData={dict} />
			<RaportModal langData={dict} />
			<FiscalReceiptModal langData={dict} />
			<AdminSignInModal langData={dict} />
			<AddAdressModal langData={dict} />
			<DeleteAddressModal langData={dict} />
			<DeleteModalGeneral langData={dict} />
		</>
	);
}
