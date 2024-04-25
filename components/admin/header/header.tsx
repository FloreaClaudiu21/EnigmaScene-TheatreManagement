"use client";
import Link from "next/link";
import { useAuth } from "@/services/StateProvider";
import DropdownUser from "@/components/admin/header/DropdownMenuUser";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";
import { homeUrl } from "@/lib/utils";
import HeaderMenuAdmin from "./headerMenu";
import { useEffect, useState } from "react";
import BreadcrumbHeader from "./BreadcrumbHeader";

const HeaderComponent = () => {
	const auth = useAuth();
	const pathName = usePathname();
	const [scrollPosition, setScrollPosition] = useState(0);
	useEffect(() => {
		setScrollPosition(window.scrollY);
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return (
		<header
			className={`fixed top-0 flex h-14 w-full items-center gap-4 border-b bg-background px-4 py-6 sm:px-6 md:px-20 sm:py-2 md:pr-6 sm:h-auto sm:border-0 z-[99] ${
				scrollPosition < 70
					? "sm:bg-muted/80"
					: "sm:bg-white sm:shadow-md sm:border-b"
			}`}
		>
			<div className="flex flex-grow items-center justify-between gap-4">
				<div className="flex items-center gap-4 md:hidden">
					<HeaderMenuAdmin />
					<Link className="block flex-shrink-0 md:hidden" href="/">
						<p className="font-bold text-md">Enigma Scene Theatre</p>
						<p className="text-gray-400 text-sm">
							Theatrical Journey Beyond Imagination
						</p>
					</Link>
				</div>
				<div className="flex-1 flex-row flex gap-4">
					<Link href={homeUrl(pathName) + "home"} className="hidden md:flex">
						<Image
							alt="Logo"
							radius="none"
							removeWrapper
							fetchPriority="high"
							src={"/images/logo.webp"}
							className="h-14 w-28"
						/>
					</Link>
					<BreadcrumbHeader />
				</div>
				<div className="flex items-center gap-3 sm:gap-7">
					<DropdownUser user={auth.user!} />
				</div>
			</div>
		</header>
	);
};

export default HeaderComponent;
