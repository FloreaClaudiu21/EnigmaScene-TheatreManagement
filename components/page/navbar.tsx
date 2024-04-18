"use client";
import {
	Avatar,
	Badge,
	Button,
	Divider,
	Image,
	Link,
	Navbar,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	useDisclosure,
} from "@nextui-org/react";
import { HeartIcon, UserRoundIcon, LogOutIcon, GlobeIcon } from "lucide-react";
import NextImage from "next/image";
import { signOut } from "next-auth/react";
import {
	useActiveLink,
	useAuth,
	useCurrency,
	useLoginModal,
	useShipModal,
} from "@/services/StateProvider";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";
import { LanguageData } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminKey } from "@/services/general/AuthProvider";

function NavbarComponent({ langData }: { langData: LanguageData }) {
	const auth = useAuth();
	const path = usePathname();
	const useCur = useCurrency();
	const { toast } = useToast();
	const shipModal = useShipModal();
	const loginModal = useLoginModal();
	const activeLink = useActiveLink();
	const { language: lang } = langData;
	const dict = langData.dictionary;
	const [adminkey, setAdminKey] = useState("null");
	const { onClose, isOpen, onOpenChange } = useDisclosure();
	const [scrollPosition, setScrollPosition] = useState(0);
	const logOutUser = async () => {
		try {
			await signOut({
				redirect: false,
			});
			toast({
				title: dict.snackbar.titles.logoutAccount,
				description: dict.snackbar.desc.accountLogoutok,
			});
		} catch (e) {
			toast({
				title: dict.snackbar.titles.logoutAccount,
				description: dict.messages.error.unknownError,
			});
		}
	};
	const isActiveLink = (link: string) => {
		if (!path.includes("home")) {
			return path.includes(link);
		}
		if (activeLink.active.includes(link)) {
			return true;
		} else if (activeLink.active == "" && path.includes(link)) {
			return true;
		}
		return false;
	};
	const handleIntersection = (entries: any) => {
		entries.forEach((entry: any) => {
			if (entry.isIntersecting) {
				activeLink.setActive(entry.target.id);
			}
		});
	};
	const findAdminKey = async () => {
		const key = await getAdminKey();
		setAdminKey(key ?? "null");
	};
	useEffect(() => {
		findAdminKey();
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: 0.3,
		});
		document.querySelectorAll(".section").forEach((section) => {
			observer.observe(section);
		});
		return () => {
			observer.disconnect();
		};
	}, []);
	const urlLink = () => {
		const pathNames = path.split("/");
		if (pathNames.length < 5) {
			return "./";
		} else if (pathNames.length == 5) {
			return "../../";
		} else if (pathNames.length == 6) {
			return "../../../";
		} else if (pathNames.length == 7) {
			return "../../../../";
		} else {
			return "../../../../";
		}
	};
	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash;
			activeLink.setActive(hash);
		};
		window.addEventListener("hashchange", handleHashChange);
		return () => {
			window.removeEventListener("hashchange", handleHashChange);
		};
	}, []);
	return (
		<Navbar
			maxWidth="2xl"
			isBlurred={false}
			isMenuOpen={isOpen}
			onMenuOpenChange={onOpenChange}
			position="sticky"
			className={`fixed min-w-0 shadow-lg top-0 z-[999] transition-background delay-75 ${
				scrollPosition < 100
					? "bg-[rgba(0,0,0,0.25)]"
					: "bg-[#050B20] border-b-1 border-b-slate-800"
			}`}
		>
			<NavbarContent className="md:flex-1">
				<NavbarContent justify="start">
					<NavbarMenuToggle
						as={"span"}
						className="lg:hidden hover:cursor-pointer text-gray-500"
					/>
					<Link
						href={"/" + lang}
						className="hidden sm:flex w-[100px] lg:w-24 h-full"
					>
						<Image
							as={NextImage}
							width={100}
							height={24}
							alt="Logo"
							removeWrapper
							className="object-fill h-full w-full"
							src="/images/logo.webp"
						/>
					</Link>
				</NavbarContent>
				<NavbarContent justify="end" className="flex flex-1 gap-3 w-full">
					<div className="hidden lg:flex gap-6">
						<NavbarItem>
							<Link
								href={"/" + lang + "/home"}
								className={`text-white ${
									isActiveLink("home") && "text-blue-300 font-semibold"
								}`}
							>
								{dict.navbar.links.home}
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href={"/" + lang + "/rent-cars"}
								className={`text-white ${
									isActiveLink("rent-cars") && "text-blue-300 font-semibold"
								}`}
							>
								{dict.navbar.links.rent}
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href={"/" + lang + "/home#services"}
								className={`text-white ${
									isActiveLink("services") && "text-blue-300 font-semibold"
								}`}
							>
								{dict.navbar.links.services}
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href={"/" + lang + "/home#faqs"}
								className={`text-white ${
									isActiveLink("faqs") && "text-blue-300 font-semibold"
								}`}
							>
								{dict.navbar.links.faqs}
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href={"/" + lang + "/home#aboutus"}
								className={`text-white ${
									isActiveLink("aboutus") && "text-blue-300 font-semibold"
								}`}
							>
								{dict.navbar.links.about}
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href={"/" + lang + "/home#contact"}
								className={`text-white ${
									isActiveLink("contact") && "text-blue-300 font-semibold"
								}`}
							>
								{dict.navbar.links.contact}
							</Link>
						</NavbarItem>
					</div>
					<NavbarItem>
						<Button
							size="sm"
							radius="none"
							variant="light"
							onClick={() => {
								shipModal.setVisible(true);
								document.body.style.overflowY = "hidden";
							}}
							className="flex justify-center place-items-center text-white"
						>
							<GlobeIcon size={18} />
							<span className="hidden text-sm xs:flex">
								{lang.toUpperCase()} | {useCur.currency.toUpperCase()}
							</span>
						</Button>
					</NavbarItem>
					<NavbarItem>
						{auth.isLogged ? (
							<div className="flex flex-row gap-4">
								<Badge
									size="sm"
									shape="circle"
									color="default"
									variant="faded"
									content={auth.user?.favorites?.length}
								>
									<Link href={"/" + lang + "/favorite-cars"}>
										<Button isIconOnly radius="none" variant="light">
											<HeartIcon
												size={24}
												fill={
													auth.user?.favorites?.length! > 0 ? "red" : "white"
												}
											/>
										</Button>
									</Link>
								</Badge>
								<HoverCard>
									<HoverCardTrigger asChild>
										<Avatar
											size="sm"
											src={""}
											className="hover:cursor-pointer"
										/>
									</HoverCardTrigger>
									<HoverCardContent
										side="bottom"
										className="flex flex-col w-auto space-y-3"
									>
										<div className="flex justify-between space-x-4">
											<Avatar src={""} />
											<div className="space-y-2">
												<h4 className="text-sm font-semibold">
													{auth.user?.firstName + " " + auth.user?.lastName}
												</h4>
												<p className="text-sm">{auth.user?.email}</p>
											</div>
										</div>
										<Divider />
										<div className="flex flex-col gap-1 place-items-start">
											<p className="font-semibold underline text-md">
												{dict.navbar.details}
											</p>
											<Link
												href={urlLink() + "admin/" + adminkey + "/users"}
												className={`font-medium text-sm hover:font-semibold hover:text-red-800 ${
													!auth.user?.adminUser && "hidden"
												}`}
											>
												➤ ADMIN
											</Link>
											<Link
												href={urlLink() + "account/details/settings"}
												className={`font-medium text-sm hover:font-semibold hover:text-blue-800`}
											>
												➤ {dict.accountPage.nav_links.accountSettings}
											</Link>
											<Link
												href={urlLink() + "account/details/my-rents"}
												className={`font-medium text-sm hover:font-semibold hover:text-blue-800`}
											>
												➤ {dict.accountPage.nav_links.myRents}
											</Link>
											<Link
												href={urlLink() + "account/details/my-payments"}
												className={`font-medium text-sm hover:font-semibold hover:text-blue-800`}
											>
												➤ {dict.accountPage.nav_links.myPayments}
											</Link>
											<Link
												href={urlLink() + "account/details/my-invoices"}
												className={`font-medium text-sm hover:font-semibold hover:text-blue-800`}
											>
												➤ {dict.accountPage.nav_links.myInvoices}
											</Link>
										</div>
										<Divider />
										<Button
											size="sm"
											radius="md"
											variant="flat"
											onClick={logOutUser}
											className="place-self-end bg-black text-white"
										>
											<LogOutIcon size={18} />
											{dict.forms.labels.signOut}
										</Button>
									</HoverCardContent>
								</HoverCard>
							</div>
						) : (
							<Button
								size="sm"
								radius="full"
								variant="solid"
								aria-label="Login"
								onClick={() => loginModal.setVisible(true)}
								className="bg-white font-medium"
							>
								<UserRoundIcon size={18} />
								<span className="text-md hidden md:block">
									{dict.forms.labels.signIn}
								</span>
							</Button>
						)}
					</NavbarItem>
				</NavbarContent>
				<NavbarMenu className="z-[999999]">
					<NavbarMenuItem>
						<Link
							href={"/" + lang + "/home"}
							className="text-xl"
							onClick={onClose}
							style={{
								textDecoration: isActiveLink("home") ? "underline" : "",
							}}
						>
							{dict.navbar.links.home}
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							href={"/" + lang + "/rent-cars"}
							className="text-xl"
							onClick={onClose}
							style={{
								textDecoration: isActiveLink("rent-cars") ? "underline" : "",
							}}
						>
							{dict.navbar.links.rent}
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							href={"/" + lang + "/home#services"}
							className="text-xl"
							onClick={onClose}
							style={{
								textDecoration: isActiveLink("services") ? "underline" : "",
							}}
						>
							{dict.navbar.links.services}
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							href={"/" + lang + "/home#faqs"}
							className="text-xl"
							onClick={onClose}
							style={{
								textDecoration: isActiveLink("faqs") ? "underline" : "",
							}}
						>
							{dict.navbar.links.faqs}
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							href={"/" + lang + "/home#aboutus"}
							className="text-xl"
							onClick={onClose}
							style={{
								textDecoration: isActiveLink("aboutus") ? "underline" : "",
							}}
						>
							{dict.navbar.links.about}
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							href={"/" + lang + "/home#contact"}
							className="text-xl"
							onClick={onClose}
							style={{
								textDecoration: isActiveLink("contact") ? "underline" : "",
							}}
						>
							{dict.navbar.links.contact}
						</Link>
					</NavbarMenuItem>
				</NavbarMenu>
			</NavbarContent>
		</Navbar>
	);
}

export default NavbarComponent;
