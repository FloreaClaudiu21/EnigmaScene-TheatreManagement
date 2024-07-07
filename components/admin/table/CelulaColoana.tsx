import { ParametruFiltru } from "@/lib/tipuri";
import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function CelulaColoana({
	date,
	clasa,
	filtre,
}: {
	date: any;
	clasa?: string;
	filtre?: ParametruFiltru[];
}) {
	if (filtre && filtre.length > 0) {
		return (
			<AplicaFiltru clasa={clasa} filtre={filtre}>
				<div
					className={`flex flex-row items-start gap-1 justify-center text-center h-full break-all`}
				>
					{date}
				</div>
			</AplicaFiltru>
		);
	}
	return (
		<div
			className={`flex flex-row items-start gap-1 justify-center text-center h-full break-all`}
		>
			{date}
		</div>
	);
}

export function AplicaFiltru({
	children,
	clasa,
	filtre,
}: {
	children: any;
	filtre: ParametruFiltru[];
	clasa?: string;
}) {
	const parametriCautare = useSearchParams();
	const params = new URLSearchParams(parametriCautare);
	const eticheta = filtre.length > 0 ? filtre[0].eticheta : "";
	const aplicaFiltrele = () => {
		if (filtre.length <= 0) return "";
		filtre.map((filtru) => {
			if (
				params.has(filtru.coloana) &&
				params.get(filtru.coloana) == filtru.valoare
			) {
				params.delete(filtru.coloana);
			} else {
				params.set(filtru.coloana, filtru.valoare);
			}
		});
		return "./" + filtre[0].pagina + "?" + params.toString();
	};
	return (
		<Link href={aplicaFiltrele()} className="cursor-pointer">
			<Tooltip size="sm" showArrow content={`Filtrează după '${eticheta}'`}>
				<p className={clasa}>{children}</p>
			</Tooltip>
		</Link>
	);
}
