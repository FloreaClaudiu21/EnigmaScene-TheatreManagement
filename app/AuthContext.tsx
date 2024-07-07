"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
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
import Image from "next/image";
import { AutentificareSesiune } from "@/lib/tipuri";
import { ecranIncarcare } from "@/services/general/FurnizorStare";
import FormularAdaugaAdresaFacturare from "@/components/formulareGenerale/formularAdaugaAdresaFacturare";
import FormularStergeAdresaFacturare from "@/components/formulareGenerale/formularStergeAdresaFacturare";
import GeneralChartFormular from "@/components/admin/dashboard/GeneralChartFormular";
import FormularRaport from "@/components/rapoarte/FormularRaport";
import ModalBilet from "@/components/bileteSpectacol/BiletFormular";
import FacturaFormular from "@/components/facturaFiscala/FacturaFormular";
import BonFiscalFormular from "@/components/bonuriFiscale/BonFiscalFormular";
import ArataImagineaFormular from "@/components/admin/modals/ArataImagineaFormular";
import StergereGeneralFormular from "@/components/admin/modals/StergereFormular";

export const AuthContext = createContext<AutentificareSesiune>({
	primaData: false,
	sesiune: null,
	utilizator: null,
	esteLogat: false,
});

export default function AutentificareProvider({
	children,
	session,
}: {
	children: any;
	session: Session | null;
}) {
	const { toast } = useToast();
	const loadingScreen = ecranIncarcare();
	const authValue = useMemo(
		() =>
			({
				esteLogat:
					session && session.user != undefined && session.user != null
						? true
						: false,
				primaData: session?.firstTime ?? false,
				sesiune: session,
				utilizator: session?.user,
			} as AutentificareSesiune),
		[session]
	);
	const checkSession = async (authValue: AutentificareSesiune) => {
		if (authValue.primaData) {
			toast({
				variant: "destructive",
				title: "Autentificare Membru: Accesează-ți Contul",
				description: `Utilizatorul cu emailul '${authValue.utilizator?.email}' nu a fost găsit!`,
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
										height="7px"
										color="red"
										shallowRouting
										options={{ showSpinner: false }}
									/>
									{children}
									{loadingScreen.incarcare && (
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
									<Toaster />
									<ScrollToTop smooth top={500} className="rounded-md" />
									<AdminSignInModal />
									<FormularAdaugaAdresaFacturare />
									<FormularStergeAdresaFacturare />
									<StergereGeneralFormular />
									<GeneralChartFormular />
									<FormularRaport />
									<ModalBilet />
									<FacturaFormular />
									<BonFiscalFormular />
									<ArataImagineaFormular />
								</ThemeProvider>
							</NextUIProvider>
						</SessionProvider>
					</Elements>
				</AppRouterCacheProvider>
			</PrimeReactProvider>
		</AuthContext.Provider>
	);
}
