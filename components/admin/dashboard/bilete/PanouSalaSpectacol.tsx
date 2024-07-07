"use client";
import React, { useMemo } from "react";
import SeatHoverCard from "./ScaunHoverCard";
import { Divider } from "@nextui-org/react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SofaIcon } from "lucide-react";
import { BiletSpectacol, LocSalaSpectacol, Spectacol } from "@/lib/tipuri";

export default function PanouSalaSpectacol({
	toast,
	locuriAlese,
	setLocuriAlese,
	spectacolSelectat,
}: {
	toast: any;
	setLocuriAlese: any;
	spectacolSelectat: Spectacol | null;
	locuriAlese: LocSalaSpectacol[];
}) {
	const locuriSala: LocSalaSpectacol[] = useMemo(() => {
		return spectacolSelectat?.salaSpectacol?.locuriSala ?? [];
	}, [spectacolSelectat]);
	const bileteVandute: BiletSpectacol[] = useMemo(() => {
		return spectacolSelectat?.bileteVandute ?? [];
	}, [spectacolSelectat]);
	const locRezervat = (loc: LocSalaSpectacol) =>
		bileteVandute.filter(
			(bilet) =>
				bilet.spectacol?.codSalaSpectacol == loc.codSalaSpectacol &&
				bilet.locSalaSpectacol?.codLocSala == loc.codLocSala &&
				bilet.locSalaSpectacol.numarLoc == loc.numarLoc
		).length > 0;
	const randuri = [...new Set(locuriSala.map((loc) => loc.rand))].reverse();
	const locuriRand = (rand: string) =>
		locuriSala.filter((loc) => loc.rand == rand);
	const selectSeatMethod = (loc: LocSalaSpectacol, locOcupat: boolean) => {
		if (locOcupat) {
			toast({
				variant: "destructive",
				title: "Selectare loc spectacol",
				description: "Nu poti selecta un loc deja ocupat.",
			});
			return;
		}
		const index = locuriAlese.findIndex(
			(item) => item.codLocSala === loc.codLocSala
		);
		if (index === -1) {
			if (locuriAlese.length >= 6) {
				toast({
					variant: "destructive",
					title: "Selectare loc spectacol",
					description: "Nu poti selecta mai mult de 6 locuri la spectacol.",
				});
				return;
			}
			const newList = [...locuriAlese, loc];
			setLocuriAlese(newList);
		} else {
			const newList = locuriAlese.filter(
				(item) => item.codLocSala !== loc.codLocSala
			);
			setLocuriAlese(newList);
		}
	};
	return (
		<div className="flex flex-col gap-2 w-full md:w-1/2 border-1 p-4 justify-start bg-gray-100 rounded-md overflow-x-auto">
			<div className="flex justify-center min-h-6 gap-4 flex-wrap">
				<div className="flex flex-row gap-2">
					<div className="bg-red-400 h-6 w-6"></div>
					<p className="font-semibold">Loc Ocupat</p>
				</div>
				<div className="flex flex-row gap-2">
					<div className="bg-green-400 h-6 w-6"></div>
					<p className="font-semibold">Loc Selectat</p>
				</div>
				<div className="flex flex-row gap-2">
					<div className="bg-gray-200 h-6 w-6"></div>
					<p className="font-semibold">Loc Standard</p>
				</div>
				<div className="flex flex-row gap-2">
					<div className="bg-orange-400 h-6 w-6"></div>
					<p className="font-semibold">Loc VIP</p>
				</div>
				<div className="flex flex-row gap-2">
					<div className="bg-blue-400 h-6 w-6"></div>
					<p className="font-semibold">Loc PREMIUM</p>
				</div>
			</div>
			<Divider className="my-2 mb-2" />
			{randuri.length > 0 && (
				<div className="mb-2">
					<p>
						Locuri selectate:{" "}
						{locuriAlese.map((loc) => loc.numarLoc).join(", ")}
					</p>
				</div>
			)}
			{randuri.length <= 0 && (
				<p className="text-lg text-center text-red-500">
					Nu a fost selectat nici un spectacol!
				</p>
			)}
			{randuri.map((rand, index) => {
				if (index < 3) return <></>;
				return (
					<div key={rand} className={`flex flex-row gap-2`}>
						<div className="w-10 place-self-start">
							<p className="text-red-500">R{rand}</p>
						</div>
						<div className="flex flex-row gap-4 md:gap-8 justify-center place-items-center flex-1">
							{locuriRand(rand).map((loc) => {
								let locOcupat = locRezervat(loc);
								const locAles =
									locuriAlese.filter(
										(locAles) => locAles.codLocSala == loc.codLocSala
									).length > 0;
								const bgLoc = () => {
									if (locOcupat) return "bg-red-400 text-white";
									if (locAles) return "bg-green-400 text-white";
									if (loc.tipLoc == "PREMIUM") return "bg-blue-400 text-white";
									if (loc.tipLoc == "VIP") return "bg-orange-400 text-white";
									return "bg-gray-200";
								};
								const hoverLoc = () => {
									if (locOcupat) return "hover:bg-red-600 hover:text-white";
									if (locAles) return "hover:bg-green-600 hover:text-white";
									if (loc.tipLoc == "PREMIUM")
										return "hover:bg-blue-600 hover:text-white";
									if (loc.tipLoc == "VIP")
										return "hover:bg-orange-600 hover:text-white";
									return "hover:bg-gray-300 hover:text-black";
								};
								return (
									<HoverCard
										key={loc.codLocSala}
										openDelay={200}
										closeDelay={150}
									>
										<HoverCardTrigger>
											<div
												key={loc.codLocSala}
												onClick={() => selectSeatMethod(loc, locOcupat)}
												className={`flex flex-col min-w-10 gap-1 border-1 p-1 shadow-sm rounded-md place-items-center justify-center hover:shadow-md hover:cursor-pointer hover:scale-105 duration-300 ease-in-out ${bgLoc()} ${hoverLoc()}`}
											>
												<SofaIcon size={20} className="hidden md:block" />
												<p className="text-xs font-semibold">{loc.numarLoc}</p>
											</div>
										</HoverCardTrigger>
										<HoverCardContent
											side="top"
											arrowPadding={1}
											className="!z-[99999] max-w-40"
										>
											<SeatHoverCard loc={loc} locOcupat={locOcupat} />
										</HoverCardContent>
									</HoverCard>
								);
							})}
						</div>
					</div>
				);
			})}
			{randuri.length > 0 && (
				<div className="flex place-items-center justify-center bg-gray-500 shadow-md w-full h-14 mt-10 text-white text-sm">
					SCENA SALĂ SPECTACOL {spectacolSelectat?.salaSpectacol?.numarSala}
				</div>
			)}
		</div>
	);
}
