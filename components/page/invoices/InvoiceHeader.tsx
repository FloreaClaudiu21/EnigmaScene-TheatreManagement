import { FacturaFiscala } from "@/lib/types";
import Image from "next/image";

const InvoiceHeader = ({ invoice }: { invoice: FacturaFiscala }) => {
	return (
		<div className="flex flex-col h-[95.0mm] mx-8 my-2 mt-4 border-2 bg-white">
			<div className="flex flex-row gap-2">
				<div className="flex flex-1 flex-col text-center">
					<div className="flex flex-col border-2 w-[55%] text-xs m-1">
						<p className="text-lg font-bold">FACTURĂ</p>
						<p>#{invoice.numarFactura}</p>
						<p>Serie: noua nr. {invoice.serieFactura}</p>
						<p>Data: {invoice.dataIntocmiri.toLocaleDateString()}</p>
						<p>Rată TVA: 19%</p>
						<p>TVA la încasare</p>
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
					<p className="font-bold text-sm">Furnizor</p>
					<p className="font-bold text-md text-red-500">SC ENIGMA SCENE SRL</p>
					<p className="text-xs text-left">CIF: RO15608527</p>
					<p className="text-xs text-left">Reg. com.: J40/5967/2000</p>
					<p className="text-xs text-left">
						Adresă: Primăria Municipiului București, Sectorul 2, Bulevardul
						Imaginației Nr. 123
					</p>
					<p className="text-xs text-left">IBAN: RO35BTRLRONCRT0296182901</p>
					<p className="text-xs text-left">Bancă: BANCA TRANSILVANIA</p>
					<p className="text-xs text-left">Telefon: +40072642113</p>
					<p className="text-xs">Email: contact@enigmascene.website</p>
					<p className="text-xs">Capital social: 23200 lei</p>
				</div>
				<div className="flex flex-col w-1/2 p-2 place-items-end">
					<p className="font-bold text-sm">Client</p>
					<p className="font-bold text-md text-red-500 text-right">
						{invoice.numeClient}
					</p>
					<p className="text-xs text-right">
						Adresă de facturare: {invoice.adresaFacturare}
					</p>
					<p className="text-xs text-right">Telefon: {invoice.telefon}</p>
					<p className="text-xs text-right">Email: {invoice.email}</p>
				</div>
			</div>
		</div>
	);
};

export default InvoiceHeader;
