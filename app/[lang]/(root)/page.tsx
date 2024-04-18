"use client";
import { CircularProgress } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { useEffect } from "react";

export default function RootPage({ params }: { params: any }) {
	const router = useRouter();
	useEffect(() => {
		router.push(params.lang + "/home");
	}, []);
	return (
		<div className="min-h-screen w-full justify-center place-items-center flex flex-col gap-2">
			<Image
				width={140}
				height={140}
				src={"/images/logo.webp"}
				className="h-44 w-60"
				alt="Logo"
			/>
			<CircularProgress size="lg" />
		</div>
	);
}
