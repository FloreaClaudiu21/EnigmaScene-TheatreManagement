import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  capitalizeazaPrimaLitera,
  genereazaSirAleator,
  linkURL,
} from "@/lib/metodeUtile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function BreadcrumbHeader() {
  const pathName = usePathname();
  const pathNames = pathName.split("/");
  let link = linkURL(pathName);
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathNames.map((val: string, index: number) => {
          if (index < 2) return <></>;
          const isLast = index === pathNames.length - 1;
          if (val != "dashboard") {
            link += val + "/";
          }
          return (
            <BreadcrumbItem key={genereazaSirAleator(15)}>
              {!isLast ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={link}>{capitalizeazaPrimaLitera(val)}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage className="text-red-500 cursor-pointer">
                  {capitalizeazaPrimaLitera(val)}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
