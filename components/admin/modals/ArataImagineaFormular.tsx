"use client";
import { formularImagineSpectacol } from "@/services/general/FurnizorStare";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

export default function ArataImagineaFormular() {
  const imgmodal = formularImagineSpectacol();
  const show = imgmodal.spectacol;
  ////////////////////////////////
  return (
    <Modal
      radius="md"
      backdrop="opaque"
      placement={"bottom-center"}
      onOpenChange={() => {
        imgmodal.setVizibil(false);
        document.body.style.overflowY = "auto";
      }}
      isOpen={imgmodal.vizibil}
      classNames={{
        wrapper: "!z-[99998]",
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 !z-[99998]",
      }}
    >
      <ModalContent className="max-h-[90vh]">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Imaginea spectacolului `{show?.titlu}`
            </ModalHeader>
            <ModalBody>
              <Image
                alt=""
                src={show?.imagine}
                className="w-full"
                removeWrapper
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
