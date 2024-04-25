/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { i18n } from "@/i18n.config";
import { useCurrency, useShipModal } from "@/services/StateProvider";
import {
	Autocomplete,
	AutocompleteItem,
	Card,
	CardBody,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Button,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LanguageData, currencyArray, mapLanguage } from "@/lib/types";
import { useRouter } from "next-nprogress-bar";

export default function LangCurrencyModal({
	langData,
}: {
	langData: LanguageData;
}) {
	const router = useRouter();
	const useCur = useCurrency();
	const pathName = usePathname();
	const dict = langData.dictionary;
	const langCurModal = useShipModal();
	const [selectedLanguage, setSelectedLanguage] = useState("");
	const [selectedCurrency, setSelectedCurrency] = useState(useCur.currency);
	const onSave = () => {
		updateCurrency();
		redirectedPathName(selectedLanguage);
	};
	const updateCurrency = () => {
		useCur.setCurrency(selectedCurrency);
		router.refresh();
	};
	const redirectedPathName = (locale: string) => {
		if (!pathName) return "/";
		const segments = pathName.split("/");
		segments[1] = locale;
		const link = segments.join("/");
		router.push(link, {
			scroll: false,
		});
	};
	useEffect(() => {
		setSelectedLanguage(langData.language);
		setSelectedCurrency(useCur.currency);
	}, [useCur.currency]);
	return (
		<Modal
			radius="md"
			isOpen={langCurModal.visible}
			backdrop="opaque"
			placement={"bottom-center"}
			onOpenChange={() => {
				langCurModal.onToggle();
				document.body.style.overflowY = "auto";
			}}
			onClose={() => {
				setSelectedLanguage(langData.language);
				setSelectedCurrency(useCur.currency);
			}}
			classNames={{
				wrapper: "!z-[99998]",
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-xl">
							{dict.modals.titles.selectLanguage}
						</ModalHeader>
						<ModalBody>
							<Card radius="none">
								<CardBody>
									<Autocomplete
										radius="md"
										className="mb-2"
										allowsEmptyCollection={false}
										label="Select your language"
										selectedKey={selectedLanguage}
										defaultInputValue={mapLanguage[langData.language].text}
										onSelectionChange={(v) =>
											setSelectedLanguage(v != null ? v.toString() : "en")
										}
									>
										{i18n.locales.map((lang) => (
											<AutocompleteItem key={lang} value={lang}>
												{mapLanguage[lang].text}
											</AutocompleteItem>
										))}
									</Autocomplete>
									<Autocomplete
										radius="md"
										allowsEmptyCollection={false}
										selectedKey={selectedCurrency}
										defaultInputValue={selectedCurrency}
										label={dict.forms.labels.selectCurrency}
										onSelectionChange={(v) =>
											setSelectedCurrency(v != null ? v.toString() : "RON")
										}
									>
										{currencyArray.map(([country, value]) => (
											<AutocompleteItem key={value} value={value}>
												{value}
											</AutocompleteItem>
										))}
									</Autocomplete>
								</CardBody>
							</Card>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" radius="md" onPress={onClose}>
								{dict.buttons.cancel}
							</Button>
							<Button
								radius="md"
								onPress={() => {
									onSave();
									onClose();
								}}
								className="bg-black text-white"
							>
								{dict.buttons.save}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
