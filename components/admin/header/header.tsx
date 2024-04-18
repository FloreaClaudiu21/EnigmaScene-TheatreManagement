"use client";
import Link from "next/link";
import { useAuth } from "@/services/StateProvider";
import DropdownUser from "@/components/admin/header/DropdownMenuUser";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";
import { capitalizeFirstLetter, homeUrl, urlLink } from "@/lib/utils";
import HeaderMenuAdmin from "./headerMenu";

const HeaderComponent = () => {
	const auth = useAuth();
	const pathName = usePathname();
	const pathNames = pathName.split("/");
	return (
		<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-6 sm:px-6 md:px-20 md:pr-6 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
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
							className="h-12 w-24"
						/>
					</Link>
					<Breadcrumb className="hidden md:flex">
						<BreadcrumbList>
							{pathNames.map((val: string, index: number) => {
								if (index < 4) return <></>;
								const isLast = index === pathNames.length - 1;
								return (
									<BreadcrumbItem key={val + index}>
										{!isLast ? (
											<>
												<BreadcrumbLink asChild>
													<Link
														href={
															urlLink(pathName) + val != "dashboard" ? val : ""
														}
													>
														{capitalizeFirstLetter(val)}
													</Link>
												</BreadcrumbLink>
												<BreadcrumbSeparator />
											</>
										) : (
											<BreadcrumbPage>
												<Link
													className="text-red-500"
													href={
														urlLink(pathName) + val != "dashboard" ? val : ""
													}
												>
													{capitalizeFirstLetter(val)}
												</Link>
											</BreadcrumbPage>
										)}
									</BreadcrumbItem>
								);
							})}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="flex items-center gap-3 sm:gap-7">
					<DropdownUser user={auth.user!} />
				</div>
			</div>
		</header>
	);
};

export default HeaderComponent;
