"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type TabPage = {
	name: string;
	value: string;
	content: any;
};

export default function TabsPages({
	tabs,
	defVal,
}: {
	tabs: TabPage[];
	defVal: string;
}) {
	const history = useRouter();
	const searchParams = useSearchParams();
	const params = Array.from(searchParams.keys());
	const handleTabChange = (newValue: string) => {
		history.push(`?tab=${newValue}`);
	};
	const checkValueInTab = () => {
		if (!params.includes("tab")) {
			return defVal;
		}
		const tabVal = searchParams.get("tab") ?? "";
		const tabsName = tabs.map((tab) => tab.value);
		if (tabsName.includes(tabVal)) return tabVal;
		return defVal;
	};
	return (
		<Tabs
			defaultValue={defVal}
			value={checkValueInTab()}
			onValueChange={(val) => handleTabChange(val)}
		>
			<TabsList>
				{tabs.map((tab) => {
					return (
						<TabsTrigger key={tab.value} value={tab.value}>
							{tab.name}
						</TabsTrigger>
					);
				})}
			</TabsList>
			{tabs.map((tab) => {
				return (
					<TabsContent value={tab.value} key={tab.value + "cn"}>
						{tab.content}
					</TabsContent>
				);
			})}
		</Tabs>
	);
}
