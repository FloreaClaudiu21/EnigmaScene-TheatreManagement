"use client";
import { HomeBrands, LanguageData, featuredModels } from "@/lib/types";
import { useFiltersHook } from "@/services/FiltersProvider";
import { Button, Divider } from "@nextui-org/react";
import {
	DotIcon,
	FacebookIcon,
	InstagramIcon,
	LinkedinIcon,
	TwitterIcon,
} from "lucide-react";
import Link from "next/link";

function FooterComponent({ langData }: { langData: LanguageData }) {
	const lang = langData.language;
	const dict = langData.dictionary;
	const { handleFilterChangeOtherPage } = useFiltersHook();
	return (
		<footer className="w-full bg-[#050B20]">
			<div className="w-full items-center justify-start flex flex-col md:justify-between text-white max-w-[1520px] mx-auto">
				<div className="w-full grid grid-cols-2 md:flex md:flex-row flex-wrap gap-6 items-start justify-center md:justify-between py-10 px-4">
					<div className="flex flex-col items-start justify-start gap-4 place-self-center md:place-self-start">
						<p className="text-lg font-semibold">
							{dict.footer.section_company}
						</p>
						<div className="flex flex-col items-start justify-between gap-2">
							<Link
								href={"/" + lang + "/rent-cars"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.rent}
							</Link>
							<Link
								href={"/" + lang + "/home#services"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.services}
							</Link>
							<Link
								href={"/" + lang + "/home#faqs"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.faqs}
							</Link>
							<Link
								href={"/" + lang + "/terms-and-conditions"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.terms}
							</Link>
							<Link
								href={"/" + lang + "/privacy-notice"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.privacy}
							</Link>
						</div>
					</div>
					<div className="flex flex-col items-start justify-start gap-4 place-self-center self-start">
						<p className="text-lg font-semibold">{dict.footer.section_quick}</p>
						<div className="flex flex-col items-start justify-between gap-2">
							<Link
								href={"/" + lang + "/home"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.home}
							</Link>
							<Link
								href={"/" + lang + "/home#aboutus"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.about}
							</Link>
							<Link
								href={"/" + lang + "/home#contact"}
								className="text-white text-sm hover:underline"
							>
								{dict.navbar.links.contact}
							</Link>
						</div>
					</div>
					<div className="flex flex-col items-start justify-center gap-4 mr-6 md:mr-0 place-self-center md:place-self-start">
						<p className="text-lg font-semibold">
							{dict.footer.section_ourBrands}
						</p>
						<div className="flex flex-col items-start justify-between gap-2">
							{HomeBrands.map((brand, index) => {
								return (
									<Link
										key={brand.name}
										href={"./rent-cars?page=1&manufacturers=" + brand.name}
										onClick={() =>
											handleFilterChangeOtherPage("manufacturers", brand.name)
										}
										className="text-white text-sm hover:underline"
									>
										{brand.name}
									</Link>
								);
							})}
						</div>
					</div>
					<div className="flex flex-col items-start justify-center gap-4 ml-1 sm:ml-0 place-self-center md:place-self-start">
						<p className="text-lg font-semibold">
							{dict.footer.section_vehicleType}
						</p>
						<div className="flex flex-col items-start justify-between gap-2">
							{featuredModels.map((model, index) => {
								return (
									<Link
										key={model.name}
										href={
											"./rent-cars?page=1&categories=" +
											model.name.toUpperCase()
										}
										onClick={() =>
											handleFilterChangeOtherPage(
												"categories",
												model.name.toUpperCase()
											)
										}
										className="text-white text-sm hover:underline"
									>
										{model.name}
									</Link>
								);
							})}
						</div>
					</div>
					<Divider className="w-full col-span-2 bg-gray-300 mt-8 mb-2 md:mt:0 md:hidden" />
					<div className="flex flex-col col-span-2 items-center md:items-start justify-center gap-4">
						<p className="text-lg font-semibold">
							{dict.footer.section_connect}
						</p>
						<div className="flex flex-row items-center justify-start gap-2">
							<Button
								className="text-white"
								variant="light"
								radius="full"
								isIconOnly
							>
								<FacebookIcon size={18} />
							</Button>
							<Button
								className="text-white"
								variant="light"
								radius="full"
								isIconOnly
							>
								<LinkedinIcon size={18} />
							</Button>
							<Button
								className="text-white"
								variant="light"
								radius="full"
								isIconOnly
							>
								<TwitterIcon size={18} />
							</Button>
						</div>
					</div>
				</div>
			</div>
			<Divider className="bg-white bg-opacity-15" />
			<div className="w-full flex flex-row items-center justify-between text-white py-7 max-w-[1520px] mx-auto">
				<p className="text-sm pl-6 text-center">
					© 2024 Euro Cars Business. All rights reserved.
				</p>
			</div>
		</footer>
	);
}

export default FooterComponent;
