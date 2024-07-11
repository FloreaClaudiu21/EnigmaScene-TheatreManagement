"use client";
import { useToast } from "../../ui/use-toast";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { deleteCookie } from "cookies-next";
import { signIn, signOut, useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { schemaLogareAdmin } from "@/lib/schemeFormulare";
import { ecranIncarcare } from "@/services/general/FurnizorStare";
import { linkURL } from "@/lib/metodeUtile";
import { obtineClientDupaEmail } from "@/services/backend/client/obtineClientDupaEmail";

export default function AdminSignInFormular() {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const { data, status } = useSession();
  const loadingScreen = ecranIncarcare();
  const [showPassLogin, setShowPassLogin] = useState(false);
  const loginForm = useForm<z.infer<typeof schemaLogareAdmin>>({
    resolver: zodResolver(schemaLogareAdmin),
  });
  useEffect(() => {
    if (status === "loading") return;
    if (status != "authenticated" && !pathname.endsWith("/dashboard")) {
      router.replace(linkURL(pathname));
    }
  }, [data, status]);
  async function onLoginProvider(prov: string) {
    deleteCookie("signInProviderLinkParams");
    await signIn(prov, {
      redirect: false,
    });
  }
  async function onSubmitLogin(values: z.infer<typeof schemaLogareAdmin>) {
    loadingScreen.setIncarcare(true);
    const data = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.parola,
    });
    if (data && data.ok) {
      loginForm.reset();
      const user = await obtineClientDupaEmail(values.email);
      if (!user?.utlizatorAdmin) {
        toast({
          variant: "destructive",
          title: "Accesare cont administrator",
          description: `Trebuie să fii administrator pentru a accesa panoul de control.`,
        });
        await signOut();
        return;
      }
      document.body.style.overflowY = "auto";
      toast({
        title: "Accesare cont administrator",
        description: `Autentificare cu succes. Bun venit ${user.email}!`,
      });
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      toast({
        title: "Accesare cont administrator",
        variant: "destructive",
        description: data?.error,
      });
    }
    loadingScreen.setIncarcare(false);
  }
  return (
    <Modal
      radius="md"
      backdrop="opaque"
      isOpen={status != "loading" && (!data || !data.user)}
      placement={"bottom-center"}
      onOpenChange={() => {
        document.body.style.overflowY = "auto";
      }}
      classNames={{
        wrapper: "!z-[99998]",
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center pb-1 text-black">
              <p>
                Autentifică-te la{" "}
                <span className="text-red-500">Teatrul EnigmaScene</span>
                <br /> Panoul de Administrare
              </p>
            </ModalHeader>
            <ModalBody>
              <Form {...loginForm}>
                <form
                  className="space-y-2 border-t-1 py-2"
                  onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            radius="md"
                            placeholder="youremail@gmail.com"
                            variant="bordered"
                            required
                            endContent={
                              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="parola"
                    control={loginForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parola*</FormLabel>
                        <FormControl>
                          <Input
                            required
                            radius="md"
                            placeholder="*******"
                            endContent={
                              !showPassLogin ? (
                                <EyeIcon
                                  onClick={() => {
                                    setShowPassLogin(true);
                                  }}
                                  className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
                                />
                              ) : (
                                <EyeOffIcon
                                  onClick={() => {
                                    setShowPassLogin(false);
                                  }}
                                  className="text-2xl text-default-400 flex-shrink-0 hover:cursor-pointer"
                                />
                              )
                            }
                            type={showPassLogin ? "text" : "password"}
                            variant="bordered"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="flex-shrink mx-4 text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <Button
                      radius="md"
                      variant="faded"
                      onClick={() => onLoginProvider("google")}
                      className="bg-black text-white"
                      startContent={
                        <Image
                          src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
                          alt=""
                          width={24}
                          height={24}
                        />
                      }
                    >
                      Logare cu cont Google
                    </Button>
                  </div>
                  <div className="flex flex-row justify-end gap-4 !mt-6">
                    <Button
                      radius="md"
                      type="submit"
                      className="bg-black font-bold text-white"
                    >
                      Logare
                    </Button>
                  </div>
                </form>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
