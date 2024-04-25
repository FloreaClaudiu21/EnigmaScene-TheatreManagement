"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
	ArmchairIcon,
	BarChart3,
	BarChart3Icon,
	CircleUserIcon,
	DramaIcon,
	FileArchiveIcon,
	Home,
	MoonIcon,
	PaintRollerIcon,
	PiggyBankIcon,
	Settings,
	StickyNoteIcon,
	SunIcon,
	TicketIcon,
} from "lucide-react";
import { Button, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { urlLink } from "@/lib/utils";
import { useTheme } from "next-themes";

function SidebarLink({
	url,
	title,
	pathName,
	include,
	icon,
}: {
	include: string;
	pathName: string;
	url: string;
	title: string;
	icon: any;
}) {
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
		<Tooltip radius="sm" content={title} placement="right" showArrow>
			<Link
				href={url}
				className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
					isActive()
						? " bg-red-500 text-white hover:text-foreground-300 "
						: " text-muted-foreground hover:text-red-500 "
				}`}
			>
				{icon}
			</Link>
		</Tooltip>
	);
}

export default function SidebarAdminComponent() {
	const pathname = usePathname();
	const theme = useTheme();
	return (
		<aside className="fixed inset-y-0 left-0 hidden w-14 flex-col border-r bg-background md:flex z-[999]">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
				<SidebarLink
					icon={<BarChart3Icon size={20} />}
					include="dashboard"
					pathName={pathname}
					title="Dashboard"
					url={urlLink(pathname)}
				/>
				<SidebarLink
					icon={<CircleUserIcon size={20} />}
					include="clients"
					pathName={pathname}
					title="Clients"
					url={urlLink(pathname) + "clients"}
				/>
				<SidebarLink
					icon={<DramaIcon size={20} />}
					include="shows"
					pathName={pathname}
					title="Shows"
					url={urlLink(pathname) + "shows"}
				/>
				<SidebarLink
					icon={<ArmchairIcon size={20} />}
					include="showRooms"
					pathName={pathname}
					title="Show Rooms"
					url={urlLink(pathname) + "showRooms"}
				/>
				<SidebarLink
					icon={<TicketIcon size={20} />}
					include="tickets"
					pathName={pathname}
					title="Tickets"
					url={urlLink(pathname) + "tickets"}
				/>
				<SidebarLink
					icon={<PaintRollerIcon size={20} />}
					include="materials"
					pathName={pathname}
					title="Decoration Materials"
					url={urlLink(pathname) + "materials"}
				/>
				<SidebarLink
					icon={<PiggyBankIcon size={20} />}
					include="payments"
					pathName={pathname}
					title="Payments"
					url={urlLink(pathname) + "payments"}
				/>
				<SidebarLink
					icon={<StickyNoteIcon size={20} />}
					include="fiscalreceipt"
					pathName={pathname}
					title="Fiscal Receipt"
					url={urlLink(pathname) + "fiscalReceipt"}
				/>
				<SidebarLink
					icon={<FileArchiveIcon size={20} />}
					include="invoices"
					pathName={pathname}
					title="Invoices"
					url={urlLink(pathname) + "invoices"}
				/>
			</nav>
			<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
				<Tooltip
					radius="sm"
					content={"Toggle Theme"}
					placement="right"
					showArrow
				>
					<Button
						isIconOnly
						radius="md"
						variant="bordered"
						onClick={() =>
							theme.setTheme(theme.theme === "light" ? "dark" : "light")
						}
						className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors`}
					>
						{theme.theme === "light" ? (
							<MoonIcon size={20} />
						) : (
							<SunIcon size={20} />
						)}
					</Button>
				</Tooltip>
			</nav>
		</aside>
	);
}
