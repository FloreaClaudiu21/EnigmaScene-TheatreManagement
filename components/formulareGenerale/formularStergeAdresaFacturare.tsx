"use client";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next-nprogress-bar";
import {
	ecranIncarcare,
	formularStergereAdresa,
} from "@/services/general/FurnizorStare";
import { stergeAdresaFacturare } from "@/services/backend/adreseFacturare/adreseFacturare";

export default function FormularStergeAdresaFacturare() {
	const router = useRouter();
	const { toast } = useToast();
	const ecranIncarcareV = ecranIncarcare();
	const formularStergereAdresaV = formularStergereAdresa();
	///////////////////////////////////////////////
	const stergeAdresa = async () => {
		ecranIncarcareV.setIncarcare(true);
		const adresa = await stergeAdresaFacturare(
			formularStergereAdresaV.codAdresa ?? 0
		);
		if (!adresa) {
			toast({
				variant: "destructive",
				title: "Ștergere adresă de facturare",
				description: `Adresa de facturare nu a fost ștearsă.`,
			});
			return;
		}
		const adresaString =
			adresa.adresa + ", " + adresa.oras + ", " + adresa.tara;
		ecranIncarcareV.setIncarcare(false);
		formularStergereAdresaV.onToggle(null);
		router.refresh();
		toast({
			title: "Ștergere adresă de facturare",
			description: `Adresa de facturare '${adresaString}' a fost ștearsă cu succes.`,
		});
	};
	return (
		<Modal
			radius="md"
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				formularStergereAdresaV.onToggle(null);
				document.body.style.overflowY = "auto";
			}}
			isOpen={formularStergereAdresaV.codAdresa != null}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Șterge adresă de facturare
						</ModalHeader>
						<ModalBody>
							Ești sigur că dorești să ștergi adresa de facturare cu codul de
							identificare `{formularStergereAdresaV.codAdresa}`?
						</ModalBody>
						<ModalFooter>
							<Button variant="light" radius="md" onPress={onClose}>
								NU
							</Button>
							<Button
								radius="md"
								className="bg-black text-red-400"
								onClick={() => stergeAdresa()}
							>
								DA
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
