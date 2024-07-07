"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
	ArmchairIcon,
	BarChart3Icon,
	CircleUserIcon,
	DramaIcon,
	FileArchiveIcon,
	MoonIcon,
	PiggyBankIcon,
	StickyNoteIcon,
	SunIcon,
	TicketIcon,
} from "lucide-react";
import { Button, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { linkURL } from "@/lib/metodeUtile";

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
	const theme = useTheme();
	const pathname = usePathname();
	return (
		<aside className="fixed inset-y-0 left-0 hidden w-14 flex-col border-r bg-background md:flex z-[999]">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
				<SidebarLink
					icon={<BarChart3Icon size={20} />}
					include="dashboard"
					pathName={pathname}
					title="Dashboard"
					url={linkURL(pathname)}
				/>
				<SidebarLink
					icon={<CircleUserIcon size={20} />}
					include="clientii"
					pathName={pathname}
					title="Clienți"
					url={linkURL(pathname) + "clientii"}
				/>
				<SidebarLink
					icon={<DramaIcon size={20} />}
					include="spectacole"
					pathName={pathname}
					title="Spectacole"
					url={linkURL(pathname) + "spectacole"}
				/>
				<SidebarLink
					icon={<ArmchairIcon size={20} />}
					include="camereSpectacol"
					pathName={pathname}
					title="Sălii Spectacole"
					url={linkURL(pathname) + "camereSpectacol"}
				/>
				<SidebarLink
					icon={<TicketIcon size={20} />}
					include="bilete"
					pathName={pathname}
					title="Bilete"
					url={linkURL(pathname) + "bilete"}
				/>
				<SidebarLink
					icon={<PiggyBankIcon size={20} />}
					include="platii"
					pathName={pathname}
					title="Plății"
					url={linkURL(pathname) + "platii"}
				/>
				<SidebarLink
					icon={<StickyNoteIcon size={20} />}
					include="bonulFiscal"
					pathName={pathname}
					title="Bonuri Fiscale"
					url={linkURL(pathname) + "bonulFiscal"}
				/>
				<SidebarLink
					icon={<FileArchiveIcon size={20} />}
					include="facturi"
					pathName={pathname}
					title="Facturi Fiscale"
					url={linkURL(pathname) + "facturi"}
				/>
			</nav>
			<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
				<Tooltip
					radius="sm"
					content={"Schimba tema"}
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
