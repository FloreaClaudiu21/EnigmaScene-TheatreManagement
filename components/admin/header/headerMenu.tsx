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
	Home,
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
						include="clients"
						pathName={pathname}
						title="Clients"
						url={urlLink(pathname) + "clients"}
					/>
					<MenuLinkAdmin
						icon={<DramaIcon size={20} />}
						include="shows"
						pathName={pathname}
						title="Shows"
						url={urlLink(pathname) + "shows"}
					/>
					<MenuLinkAdmin
						icon={<ArmchairIcon size={20} />}
						include="showRooms"
						pathName={pathname}
						title="Show Rooms"
						url={urlLink(pathname) + "showRooms"}
					/>
					<MenuLinkAdmin
						icon={<TicketIcon size={20} />}
						include="tickets"
						pathName={pathname}
						title="Tickets"
						url={urlLink(pathname) + "tickets"}
					/>
					<MenuLinkAdmin
						icon={<PaintRollerIcon size={20} />}
						include="materials"
						pathName={pathname}
						title="Decoration Materials"
						url={urlLink(pathname) + "materials"}
					/>
					<MenuLinkAdmin
						icon={<PiggyBankIcon size={20} />}
						include="payments"
						pathName={pathname}
						title="Payments"
						url={urlLink(pathname) + "payments"}
					/>
					<MenuLinkAdmin
						icon={<StickyNoteIcon size={20} />}
						include="fiscalreceipt"
						pathName={pathname}
						title="Fiscal Receipt"
						url={urlLink(pathname) + "fiscalReceipt"}
					/>
					<MenuLinkAdmin
						icon={<FileArchiveIcon size={20} />}
						include="invoices"
						pathName={pathname}
						title="Invoices"
						url={urlLink(pathname) + "invoices"}
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
						Toggle Theme
					</Button>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
