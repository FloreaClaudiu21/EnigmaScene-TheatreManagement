"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type PaginaTab = {
	nume: string;
	valoare: string;
	continut: any;
};

export default function PaginiTab({
	taburi,
	valoareDef,
}: {
	taburi: PaginaTab[];
	valoareDef: string;
}) {
	const istoric = useRouter();
	const parametriCautare = useSearchParams();
	const parametri = Array.from(parametriCautare.keys());
	const gestioneazaSchimbareaTab = (nouaValoare: string) => {
		istoric.push(`?tab=${nouaValoare}`);
	};
	const verificaValoareInTab = () => {
		if (!parametri.includes("tab")) {
			return valoareDef;
		}
		const valoareTab = parametriCautare.get("tab") ?? "";
		const numeTaburi = taburi.map((tab) => tab.valoare);
		if (numeTaburi.includes(valoareTab)) return valoareTab;
		return valoareDef;
	};
	return (
		<Tabs
			defaultValue={valoareDef}
			value={verificaValoareInTab()}
			onValueChange={(val) => gestioneazaSchimbareaTab(val)}
		>
			<TabsList>
				{taburi.map((tab) => {
					return (
						<TabsTrigger key={tab.valoare} value={tab.valoare}>
							{tab.nume}
						</TabsTrigger>
					);
				})}
			</TabsList>
			{taburi.map((tab) => {
				return (
					<TabsContent value={tab.valoare} key={tab.valoare + "cn"}>
						{tab.continut}
					</TabsContent>
				);
			})}
		</Tabs>
	);
}
