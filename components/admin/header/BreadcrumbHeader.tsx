import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalizeazaPrimaLitera, linkURL } from "@/lib/metodeUtile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function BreadcrumbHeader() {
	const pathName = usePathname();
	const pathNames = pathName.split("/");
	let link = linkURL(pathName);
	return (
		<Breadcrumb className="hidden md:flex">
			<BreadcrumbList>
				{pathNames.map((val: string, index: number) => {
					if (index < 2) return <></>;
					const isLast = index === pathNames.length - 1;
					if (val != "dashboard") {
						link += val + "/";
					}
					return (
						<BreadcrumbItem key={uuidv4()}>
							{!isLast ? (
								<>
									<BreadcrumbLink key={uuidv4()} asChild>
										<Link href={link}>{capitalizeazaPrimaLitera(val)}</Link>
									</BreadcrumbLink>
									<BreadcrumbSeparator />
								</>
							) : (
								<BreadcrumbPage
									key={uuidv4()}
									className="text-red-500 cursor-pointer"
								>
									{capitalizeazaPrimaLitera(val)}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
