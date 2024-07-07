"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";
import HeaderMenuAdmin from "./headerMenu";
import BreadcrumbHeader from "./BreadcrumbHeader";
import { URLAcasa } from "@/lib/metodeUtile";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";

const HeaderComponent = () => {
	const pathName = usePathname();
	const { data, status } = useSession();
	return (
		<header
			className={`fixed top-0 flex h-14 w-full items-center gap-4 border-b bg-background px-4 py-6 sm:px-6 md:px-20 sm:py-2 md:pr-6 sm:h-auto sm:border-0 z-[99] sm:bg-white sm:dark:bg-background sm:shadow-sm sm:border-b`}
		>
			<div className="flex flex-grow items-center justify-between gap-3">
				<div className="flex items-center gap-4 md:hidden">
					<HeaderMenuAdmin />
					<Link className="block flex-shrink-0 md:hidden" href="/">
						<p className="font-bold text-md">Teatrul Enigma Scene</p>
						<p className="text-gray-400 text-sm">
							Călătoria Teatrală Dincolo de Imaginație
						</p>
					</Link>
				</div>
				<div className="flex-1 flex-row flex gap-4">
					<Link href={URLAcasa(pathName) + "home"} className="hidden md:flex">
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
					{status == "authenticated" && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="flex flex-row gap-4 justify-center place-items-center hover:cursor-pointer">
									<span className="hidden text-right lg:block">
										<span className="block text-sm font-medium text-foreground">
											{data.user.numeClient}
										</span>
										<span className="block text-xs text-red-300">
											Administrator
										</span>
									</span>
									<Button
										size="icon"
										variant="outline"
										className="overflow-hidden rounded-full"
									>
										<User2 size={30} />
									</Button>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Contul Meu</DropdownMenuLabel>
								<DropdownMenuItem className="text-red-500 font-semibold hover:text-red-800">
									{data.user.numeClient}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={async () => {
										await signOut();
									}}
									className="group hover:cursor-pointer"
								>
									<span className="group-hover:text-red-500">Deconectare</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
};

export default HeaderComponent;
