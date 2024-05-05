import HeaderComponent from "@/components/admin/header/header";
import SidebarComponent from "@/components/admin/sidebar";
import React from "react";

export default async function AdminPagesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-row min-h-screen h-auto overflow-hidden">
			<SidebarComponent />
			<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
				<HeaderComponent />
				<main className="rounded-t-3xl lg:rounded-tl-3xl h-full mt-16 sm:mt-24 flex flex-col justify-start">
					<div className="w-full h-full max-w-[1920px] mt-2 px-4 sm:px-6 md:px-20 md:pr-6">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
