"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionAuth } from "@/lib/types";
import stripePromise from "@/stripe";
import { NextUIProvider } from "@nextui-org/react";
import { PrimeReactProvider } from "primereact/api";
import { Session } from "next-auth";
import { SessionProvider, signOut } from "next-auth/react";
import { AppProgressBar } from "next-nprogress-bar";
import { createContext, useEffect, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import ScrollToTop from "react-scroll-to-top";
import AdminSignInModal from "@/components/admin/modals/SignInModal";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLoadingScreen } from "@/services/StateProvider";
import AddAdressModal from "@/components/page/modals/addAddressModal";
import DeleteAddressModal from "@/components/page/modals/deleteAddressModal";
import DeleteModalGeneral from "@/components/admin/modals/DeleteModal";
import GeneralChartModal from "@/components/admin/dashboard/GeneralChartModal";
import RaportModal from "@/components/page/raports/RaportModal";
import TicketModal from "@/components/page/ticket/TicketModal";
import InvoiceModal from "@/components/page/invoices/InvoiceModal";
import FiscalReceiptModal from "@/components/page/fiscalReceipts/FiscalReceiptModal";

export const AuthContext = createContext<SessionAuth>({
	firstTime: false,
	session: null,
	user: null,
	isLogged: false,
});

export default function AuthProvider({
	children,
	session,
}: {
	children: any;
	session: Session | null;
}) {
	const router = useRouter();
	const { toast } = useToast();
	const loadingScreen = useLoadingScreen();
	const authValue = useMemo(
		() =>
			({
				firstTime: session?.firstTime ?? false,
				session: session,
				user: session?.user,
				isLogged:
					session && session.user != undefined && session.user != null
						? true
						: false,
			} as SessionAuth),
		[session]
	);
	const checkSession = async (authValue: SessionAuth) => {
		if (authValue.firstTime) {
			toast({
				variant: "destructive",
				title: "Autentificare Membru: Accesează-ți Contul",
				description: `Utilizatorul cu emailul '${authValue.user?.email}' nu a fost găsit!`,
			});
			await signOut();
		}
	};
	useEffect(() => {
		checkSession(authValue);
	}, [authValue]);
	return (
		<AuthContext.Provider value={authValue}>
			<PrimeReactProvider>
				<AppRouterCacheProvider>
					<Elements stripe={stripePromise}>
						<SessionProvider>
							<NextUIProvider>
								<ThemeProvider
									enableSystem
									attribute="class"
									defaultTheme="light"
									disableTransitionOnChange
								>
									<AppProgressBar
										height="5px"
										color="red"
										shallowRouting
										options={{ showSpinner: false }}
									/>
									{children}
									<Toaster />
									{loadingScreen.loading && (
										<div className="fixed top-0 left-0 bottom-0 min-h-screen w-full h-full flex flex-1 flex-col gap-4 justify-center place-items-center bg-[rgba(0,0,0,0.45)] z-[999999]">
											<Image
												src="/images/loading.gif"
												priority
												alt=""
												width={128}
												height={128}
											/>
										</div>
									)}
									<ScrollToTop smooth top={500} className="rounded-md" />
									<AdminSignInModal />
									<AddAdressModal />
									<DeleteAddressModal />
									<DeleteModalGeneral />
									<GeneralChartModal />
									{/* <RaportModal /> */}
									<TicketModal />
									<InvoiceModal />
									<FiscalReceiptModal />
								</ThemeProvider>
							</NextUIProvider>
						</SessionProvider>
					</Elements>
				</AppRouterCacheProvider>
			</PrimeReactProvider>
		</AuthContext.Provider>
	);
}
