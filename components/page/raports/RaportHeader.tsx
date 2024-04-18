import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function RaportHeader({ title }: { title: string }) {
	const [date, setDate] = useState("");
	useEffect(() => {
		const dateSplit = new Date().toISOString().split("T");
		const time = dateSplit[1].split("z")[0].split(".")[0];
		setDate(dateSplit[0] + " " + time);
	}, []);
	return (
		<div className="flex flex-col min-h-[40.3mm] h-auto mx-6 my-4 mb-6 p-2 pb-4 border-2">
			<div className="flex flex-row gap-2 place-items-center">
				<div className="p-2 flex w-full flex-row gap-1 place-items-center">
					<Image
						alt=""
						width={120}
						height={80}
						src={"/images/logo.webp"}
						className="h-full w-44 max-h-[100px] object-cover"
					/>
					<div className="flex flex-col gap-1 flex-1">
						<p className="text-blue-500 font-bold text-2xl">
							Enigma Scene Threatre
						</p>
						<p className="text-gray-500 text-lg">Travel safe and cheap</p>
					</div>
					<div className="flex flex-col gap-1">
						<p>{date}</p>
					</div>
				</div>
			</div>
			<p className="text-center font-bold text-4xl break-words">{title}</p>
		</div>
	);
}
