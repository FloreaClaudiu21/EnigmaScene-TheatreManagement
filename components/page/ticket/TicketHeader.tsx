import { BiletSpectacol } from "@/lib/types";
import { Image } from "@nextui-org/react";
import React from "react";

export default function TicketHeader({ data }: { data: BiletSpectacol }) {
	return (
		<div className="flex flex-row place-items-center justify-center px-2 pt-1 h-12">
			<Image src={"/images/logo.webp"} alt="No Image" className="w-56" />
			<div className="w-full text-right ">
				<p className="text-red-500 text-xl font-bold">Nr. Bilet</p>
				<p className="text-sm">#{data.numarBilet}</p>
			</div>
		</div>
	);
}
