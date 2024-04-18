"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { urlLink } from "@/lib/utils";
import {
	ArmchairIcon,
	CircleUserIcon,
	DramaIcon,
	FileArchiveIcon,
	Home,
	MenuIcon,
	PaintRollerIcon,
	PiggyBankIcon,
	Settings,
	StickyNoteIcon,
	TicketIcon,
} from "lucide-react";
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
		if (include === "dashboard" && pn.endsWith(include)) {
			return true;
		} else if (include != "dashboard" && pn.includes(include)) {
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
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size="icon" variant="outline" className="md:hidden">
					<MenuIcon className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="sm:max-w-xs overflow-y-auto">
				<nav className="grid gap-6 text-lg font-medium">
					<MenuLinkAdmin
						icon={<CircleUserIcon size={20} />}
						include="clients"
						pathName={pathname}
						title="Clients"
						url={urlLink(pathname) + "clients"}
					/>
					<MenuLinkAdmin
						icon={<Home size={20} />}
						include="dashboard"
						pathName={pathname}
						title="Dashboard"
						url={urlLink(pathname)}
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
					<MenuLinkAdmin
						icon={<Settings size={20} />}
						include="settings"
						pathName={pathname}
						title="Settings"
						url={urlLink(pathname) + "settings"}
					/>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
