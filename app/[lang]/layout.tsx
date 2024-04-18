import DeleteModalGeneral from "@/components/admin/modals/DeleteModal";
import AdminSignInModal from "@/components/admin/modals/SignInModal";
import DictionaryProvider from "@/components/dictionary-provider";
import AddAdressModal from "@/components/page/addAddressModal";
import DeleteAddressModal from "@/components/page/deleteAddressModal";
import InvoiceModal from "@/components/page/invoices/invoiceModal";
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
			<InvoiceModal langData={dict} />
			<AdminSignInModal langData={dict} />
			<AddAdressModal langData={dict} />
			<DeleteAddressModal langData={dict} />
			<DeleteModalGeneral langData={dict} />
		</>
	);
}
