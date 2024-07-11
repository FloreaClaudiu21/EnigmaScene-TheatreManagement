"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NextUIProvider } from "@nextui-org/react";
import { Session } from "next-auth";
import { SessionProvider, signOut } from "next-auth/react";
import { AppProgressBar } from "next-nprogress-bar";
import { useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
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
import AdminSignInFormular from "@/components/admin/modals/LogareFormular";

export default function AutentificareProvider({
  children,
  session,
}: {
  children: any;
  session: Session | null;
}) {
  const { toast } = useToast();
  const loadingScreen = ecranIncarcare();
  const checkSession = async () => {
    if (!session) {
      return;
    }
    if (session.firstTime) {
      toast({
        variant: "destructive",
        title: "Accesare cont administrator",
        description: `Utilizatorul cu emailul '${session.user.email}' nu a fost găsit!`,
      });
      await signOut();
    }
  };
  useEffect(() => {
    checkSession();
  }, [session]);
  return (
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
            options={{ showSpinner: true }}
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
          <AdminSignInFormular />
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
  );
}
