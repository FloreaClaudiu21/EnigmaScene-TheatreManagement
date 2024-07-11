import { FacturaFiscala } from "@/lib/tipuri";
import Image from "next/image";

const FacturaHartie: React.FC<{
  data: FacturaFiscala;
}> = ({ data }) => {
  let sumaFactura = data.sumaPlatita;
  const pretFaraTVA = sumaFactura / 1.19;
  const sumaTVA = sumaFactura - pretFaraTVA;
  const bilete = data.bileteSpectacol ?? [];
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
        <div className="flex flex-col h-[95.0mm] mx-8 my-2 mt-4 border-2 bg-white">
          <div className="flex flex-row gap-2">
            <div className="flex flex-1 flex-col text-center">
              <div className="flex flex-col border-2 w-[55%] text-xs m-1">
                <p className="text-lg font-bold">FACTURĂ</p>
                <p>#{data.numarFactura}</p>
                <p>Serie: nr. {data.serieFactura}</p>
                <p>Data: {data.dataIntocmiri.toLocaleDateString()}</p>
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
              <p className="font-bold text-md text-red-500">
                SC ENIGMA SCENE SRL
              </p>
              <p className="text-xs text-left">CIF: RO15608527</p>
              <p className="text-xs text-left">Reg. com.: J40/5967/2000</p>
              <p className="text-xs text-left">
                Adresă: Primăria Municipiului București, Sectorul 2, Bulevardul
                Imaginației Nr. 123
              </p>
              <p className="text-xs text-left">
                IBAN: RO35BTRLRONCRT0296182901
              </p>
              <p className="text-xs text-left">Bancă: BANCA TRANSILVANIA</p>
              <p className="text-xs text-left">Telefon: +40072642113</p>
              <p className="text-xs">Email: contact@enigmascene.website</p>
              <p className="text-xs">Capital social: 23200 lei</p>
            </div>
            <div className="flex flex-col w-1/2 p-2 place-items-end">
              <p className="font-bold text-sm">Client</p>
              <p className="font-bold text-md text-red-500 text-right">
                {data.numeClient}
              </p>
              <p className="text-xs text-right">
                Adresă de facturare: {data.adresaFacturare}
              </p>
              <p className="text-xs text-right">Telefon: {data.telefon}</p>
              <p className="text-xs text-right">Email: {data.email}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 mx-8 border-2 bg-white">
          <div className="flex flex-col w-full">
            <table className="invoice-table">
              <tr className="text-center break-normal place-items-center bg-red-500 text-white text-[13px] font-bold">
                <th>
                  <span>Nr. crt</span>
                </th>
                <th>
                  <span>Descriere Produs/Serviciu</span>
                </th>
                <th>
                  <span>U.M.</span>
                </th>
                <th>
                  <span>Cantitate</span>
                </th>
                <th>
                  <span>
                    Preț Unitar (Fără TVA) <br /> --RON--
                  </span>
                </th>
                <th>
                  <span>
                    Valoare <br /> --RON--
                  </span>
                </th>
                <th>
                  <span>
                    Valoare TVA <br /> --RON--
                  </span>
                </th>
                <th>
                  <span>
                    Preț Unitar (Incl. TVA) <br /> --RON--
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
                {bilete.map((bilet, index) => {
                  let priceConverted = bilet.locSalaSpectacol?.pretLoc ?? 0;
                  const priceWithoutVAT = priceConverted / 1.19;
                  const vatAmount = priceConverted - priceWithoutVAT;
                  return (
                    <tr
                      key={bilet.codBiletSpectacol}
                      className="border-y-2 min-h-12 h-auto"
                    >
                      <td className="border-r-2">{index + 1}</td>
                      <td className="max-w-[200px] border-r-2 break-words p-1">
                        Bilet Spectacol `{bilet.spectacol?.titlu}`, in sala
                        spectacol `{bilet.salaSpectacol?.numarSala}`, locul `
                        {bilet.locSalaSpectacol?.numarLoc} -{" "}
                        {bilet.locSalaSpectacol?.tipLoc}`.
                      </td>
                      <td className="border-r-2 min-w-10">BUC</td>
                      <td className="border-r-2">1</td>
                      <td className="border-r-2">
                        {priceWithoutVAT.toFixed(2)}
                      </td>
                      <td className="border-r-2">
                        {priceWithoutVAT.toFixed(2)}
                      </td>
                      <td className="border-r-2">{vatAmount.toFixed(2)}</td>
                      <td>{(priceWithoutVAT + vatAmount).toFixed(2)}</td>
                    </tr>
                  );
                })}
                {Array.from({ length: 10 - bilete.length }).map((v, index) => {
                  return (
                    <tr key={index} className="border-y-2 min-h-10 h-10">
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
                    {(pretFaraTVA + sumaTVA).toFixed(2)}
                  </p>
                  <p className="font-bold flex-1 text-center text-xs">
                    {pretFaraTVA.toFixed(2)}
                  </p>
                  <div className="font-bold flex flex-col justify-center place-items-center text-xs">
                    <p>{sumaTVA.toFixed(2)}</p>
                    <p>TVA la colectare</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full bg-gray-200 py-1 flex-1">
                <div className="w-1/2"></div>
                <div className="flex flex-row justify-evenly w-1/2 p-1 place-items-center text-red-500">
                  <p className="font-bold text-sm">Total Plată</p>
                  <p className="font-bold flex-1 text-right text-sm">
                    {(pretFaraTVA + sumaTVA).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex flex-row w-full flex-1 px-2">
                <div className="flex flex-col w-1/2">
                  <p className="font-bold text-sm">Data Expedierii</p>
                  <p className="text-xs">De: {data.numeClient}</p>
                  <p className="text-xs">
                    Expediat în prezența noastră la{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-xs">Semnături</p>
                </div>
                <div className="flex flex-col w-1/2 place-items-end">
                  <p className="font-bold text-sm">Semnătura de primire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 py-1 ml-8">
          Factura este valabilă fără semnătură și ștampilă, conform Articolului
          319 alineatul 29 din Legea 227/2015.
        </p>
        <div className="pt-1 h-10 text-center text-sm font-semibold">
          Pagina 1 din 1
        </div>
      </div>
    </>
  );
};
export default FacturaHartie;
