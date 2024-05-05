"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { urlLink } from "@/lib/utils";
import {
	ArmchairIcon,
	BarChart3Icon,
	CircleUserIcon,
	DramaIcon,
	FileArchiveIcon,
	MenuIcon,
	MoonIcon,
	PaintRollerIcon,
	PiggyBankIcon,
	StickyNoteIcon,
	SunIcon,
	TicketIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MenuLinkAdmin = ({
	icon,
	url,
	title,
	include,
	pathName,
}: {
	icon: any;
	url: any;
	title: any;
	include: string;
	pathName: string;
}) => {
	const isActive = () => {
		const pn = pathName.toLowerCase();
		if (include === "dashboard" && pn.endsWith(include.toLowerCase())) {
			return true;
		} else if (include != "dashboard" && pn.includes(include.toLowerCase())) {
			return true;
		}
		return false;
	};
	return (
		<Link
			href={url}
			className={`flex items-center gap-4 px-2.5 ${
				isActive()
					? " underline text-red-500 "
					: " text-muted-foreground hover:text-foreground "
			}`}
		>
			{icon}
			{title}
		</Link>
	);
};

export default function HeaderMenuAdmin() {
	const pathname = usePathname();
	const theme = useTheme();
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size="icon" variant="outline" className="md:hidden">
					<MenuIcon className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="sm:max-w-xs overflow-y-auto z-[9999]"
			>
				<nav className="grid gap-6 text-lg font-medium">
					<MenuLinkAdmin
						icon={<BarChart3Icon size={20} />}
						include="dashboard"
						pathName={pathname}
						title="Dashboard"
						url={urlLink(pathname)}
					/>
					<MenuLinkAdmin
						icon={<CircleUserIcon size={20} />}
						include="clientii"
						pathName={pathname}
						title="Clienții"
						url={urlLink(pathname) + "clientii"}
					/>
					<MenuLinkAdmin
						icon={<DramaIcon size={20} />}
						include="spectacole"
						pathName={pathname}
						title="Spectacole"
						url={urlLink(pathname) + "spectacole"}
					/>
					<MenuLinkAdmin
						icon={<ArmchairIcon size={20} />}
						include="camereSpectacol"
						pathName={pathname}
						title="Sălii Spectacole"
						url={urlLink(pathname) + "camereSpectacol"}
					/>
					<MenuLinkAdmin
						icon={<TicketIcon size={20} />}
						include="bilete"
						pathName={pathname}
						title="Bilete Vandute"
						url={urlLink(pathname) + "bilete"}
					/>
					<MenuLinkAdmin
						icon={<PaintRollerIcon size={20} />}
						include="materialeDecor"
						pathName={pathname}
						title="Materiale Decor"
						url={urlLink(pathname) + "materialeDecor"}
					/>
					<MenuLinkAdmin
						icon={<PiggyBankIcon size={20} />}
						include="platii"
						pathName={pathname}
						title="Plății"
						url={urlLink(pathname) + "platii"}
					/>
					<MenuLinkAdmin
						icon={<StickyNoteIcon size={20} />}
						include="bonulFiscal"
						pathName={pathname}
						title="Bonuri Fiscale"
						url={urlLink(pathname) + "bonulFiscal"}
					/>
					<MenuLinkAdmin
						icon={<FileArchiveIcon size={20} />}
						include="facturi"
						pathName={pathname}
						title="Facturi Fiscale"
						url={urlLink(pathname) + "facturi"}
					/>
					<Button
						variant="outline"
						onClick={() =>
							theme.setTheme(theme.theme === "light" ? "dark" : "light")
						}
						className={`flex gap-2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors`}
					>
						{theme.theme === "light" ? (
							<MoonIcon size={20} />
						) : (
							<SunIcon size={20} />
						)}
						Schimbă tema
					</Button>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
