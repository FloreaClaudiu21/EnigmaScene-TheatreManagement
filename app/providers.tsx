/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { PartialClient, currencyArray } from "@/lib/types";
import {
	useAuth,
	useCarsRefresh,
	useCurrency,
	useFirstTimeAccountModal,
	useLoadingScreen,
} from "@/services/StateProvider";
import stripePromise from "@/stripe";
import { CircularProgress, NextUIProvider } from "@nextui-org/react";
import { Elements } from "@stripe/react-stripe-js";
import { getCookie } from "cookies-next";
import { User } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { PrimeReactProvider } from "primereact/api";
import { useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { usePathname } from "next/navigation";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useFiltersHook } from "@/services/FiltersProvider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
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
								<ProgressBar
									height="5px"
									color="red"
									shallowRouting
									options={{ showSpinner: false }}
								/>
								<AuthWrapper>{children}</AuthWrapper>
								<Toaster />
							</ThemeProvider>
						</NextUIProvider>
					</SessionProvider>
				</Elements>
			</AppRouterCacheProvider>
		</PrimeReactProvider>
	);
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
	const auth = useAuth();
	const useCur = useCurrency();
	const pathName = usePathname();
	const loadingScreen = useLoadingScreen();
	const refreshScreen = useCarsRefresh();
	const filterState = useFiltersHook();
	const firstTimeModal = useFirstTimeAccountModal();
	const { data: userData, status } = useSession();
	const checkSession = async () => {
		if (status === "loading") {
			loadingScreen.setLoading(true);
			return;
		}
		const session = userData;
		if (!session) {
			auth.setUser(undefined);
			loadingScreen.setLoading(false);
			return;
		}
		if (session.firstTime) {
			auth.setUser(undefined);
			firstTimeModal.setUser(session.user as PartialClient);
			await signOut({ redirect: false });
			firstTimeModal.setVisible(true);
			loadingScreen.setLoading(false);
			return;
		} else {
			if (status === "authenticated" && session.user === undefined) {
				await signOut({ redirect: false });
				auth.setUser(undefined);
				loadingScreen.setLoading(false);
				return;
			} else {
				auth.setUser(session.user as User);
				loadingScreen.setLoading(false);
				return;
			}
		}
	};
	useEffect(() => {
		checkSession();
	}, [status]);
	useEffect(() => {
		const currency = getCookie("selectedCurrency");
		/////////////////////////////////////////////
		const cur = currency ?? currencyArray[0][1];
		useCur.setCurrency(cur);
		if (
			pathName.includes("buy-tickets") ||
			pathName.includes("favorite-shows")
		) {
			filterState.updateStateFromURL();
		}
	}, []);
	return (
		<>
			{children}
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
			{refreshScreen.loading && (
				<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex rounded-md flex-col justify-center place-items-center z-[999999] pointer-events-auto">
					<CircularProgress
						size="lg"
						color="secondary"
						className="bg-[rgba(0,0,0,0.5)] rounded-md p-1"
					/>
				</div>
			)}
			<ScrollToTop smooth top={500} className="rounded-md" />
		</>
	);
}
