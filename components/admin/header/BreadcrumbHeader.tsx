import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalizeFirstLetter, urlLink } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function BreadcrumbHeader() {
	const pathName = usePathname();
	const pathNames = pathName.split("/");
	let link = urlLink(pathName);
	return (
		<Breadcrumb className="hidden md:flex">
			<BreadcrumbList>
				{pathNames.map((val: string, index: number) => {
					if (index < 4) return <></>;
					const isLast = index === pathNames.length - 1;
					if (val != "dashboard") {
						link += val + "/";
					}
					return (
						<BreadcrumbItem key={link + pathName}>
							{!isLast ? (
								<>
									<BreadcrumbLink asChild>
										<Link href={link}>{capitalizeFirstLetter(val)}</Link>
									</BreadcrumbLink>
									<BreadcrumbSeparator />
								</>
							) : (
								<BreadcrumbPage className="text-red-500 cursor-pointer">
									{capitalizeFirstLetter(val)}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
