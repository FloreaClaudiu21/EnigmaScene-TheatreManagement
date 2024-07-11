"use server";
import crypto from "crypto";
import { prisma } from "@/lib/prismaClient";
import { Client, User } from "next-auth";
import { cookies } from "next/headers";
import {
  AssociatedAccountData,
  DateInregistrare,
  PartialClient,
  Provider,
  RaspunsTrimitereEmail,
} from "@/lib/tipuri";
import { obtineClientDupaEmail } from "../backend/client/obtineClientDupaEmail";
import { obtineClientDupaCod } from "../backend/client/obtineClientDupaCod";
import { z } from "zod";
import { schemaActualizareClient } from "@/lib/schemeFormulare";
import { deleteCookie, getCookie } from "cookies-next";

const algorithm = "aes-256-cbc";
const secretKey = process.env.AUTH_SECRET ?? "";

export const cripteazaParola = (parola: string) => {
  const cifru = crypto.createCipheriv(
    algorithm,
    secretKey,
    Buffer.alloc(16, 0)
  );
  let parolaCriptata = cifru.update(parola, "utf-8", "hex");
  parolaCriptata += cifru.final("hex");
  return parolaCriptata;
};

export const decripteazaParola = (parolaCriptata: string) => {
  if (cripteazaParola == null || parolaCriptata.length <= 0) return "";
  const decifru = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.alloc(16, 0)
  );
  let parolaDecriptata = decifru.update(parolaCriptata, "hex", "utf-8");
  parolaDecriptata += decifru.final("utf-8");
  return parolaDecriptata;
};

export const verificaParola = (parolaCriptata: string, parola: string) => {
  const parolaDec = decripteazaParola(parolaCriptata);
  return parolaDec === parola;
};

export const autentificareCuProvider = async (email: string) => {
  const client = await obtineClientDupaEmail(email);
  if (!client) {
    throw Error(`Utilizatorul cu emailul '${email}' nu a fost găsit!`);
  }
  return client;
};

export const autentificareCuCredentiale = async (
  email: string,
  parola: string
) => {
  const client = await obtineClientDupaEmail(email);
  if (!client) {
    throw Error(`Utilizatorul cu emailul '${email}' nu a fost găsit!`);
  }
  if (client.parola == null || client.parola.length <= 0) {
    throw Error(`Contul asociat cu emailul '${email}' nu are o parolă.`);
  }
  const parolaCorecta = await verificaParola(client.parola, parola);
  if (parolaCorecta) {
    client.parola = "";
    return client as Client;
  } else {
    throw Error(`Parolă incorectă pentru utilizatorul '${email}'.`);
  }
};

export const preiaProprietariConturi = async (client: User) => {
  const dateConturiPrincipale = (await Promise.all(
    (client.providerii ?? []).map(async (v: Provider) => {
      const estePrincipal = await esteContPrincipal(client, v);
      return { isMain: estePrincipal, provider: v } as AssociatedAccountData;
    })
  )) as AssociatedAccountData[];
  return dateConturiPrincipale;
};

export const gasesteContAsociat = async (utilizatorPartial: PartialClient) => {
  let principalGasit = false;
  const principal = await obtineClientDupaEmail(utilizatorPartial.email);
  if (
    principal &&
    principal?.creatCuProvider &&
    (await esteContPrincipal(principal as User, utilizatorPartial))
  ) {
    principalGasit = true;
  }
  const provideri = await prisma.provider.findMany({
    where: {
      numeProvider: utilizatorPartial.provider,
      providerEmail: utilizatorPartial.email,
    },
    include: {
      client: true,
    },
  });
  const clienti = await Promise.all(
    provideri.map(async (p: Provider) => {
      const principal = await esteContPrincipal(
        p.client as User,
        { ...p } as Provider
      );
      return principal ? null : p.client;
    })
  );
  const utilizatoriFiltrati = clienti.filter((client) => client !== null);
  if (principalGasit) {
    return principal;
  } else {
    if (utilizatoriFiltrati.length <= 0) {
      return null;
    } else {
      return utilizatoriFiltrati[0];
    }
  }
};

export const esteContPrincipal = async (
  client: User,
  p: Provider | PartialClient
) => {
  if (client.creatCuProvider) {
    const dataCrearii = client.creatCuProvider.split("|");
    const numeProv = dataCrearii[0];
    const idProv = dataCrearii[1];
    if (numeProv === p.numeProvider && idProv === p.providerContCod) {
      return true;
    }
  }
  return false;
};

export const contDejaExistent = async (
  partial: PartialClient,
  evita: boolean
) => {
  if (evita) return false;
  const gasit = await obtineClientDupaEmail(partial.email);
  return gasit ? true : false;
};

export const esteEmailAsociat = async (email: string) => {
  const lista = await prisma.provider.findMany({
    where: {
      providerEmail: email,
    },
    include: {
      client: true,
    },
  });
  if (lista.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const esteDejaAsociat = async (utilizatorPartial: PartialClient) => {
  const lista = await prisma.provider.findMany({
    where: {
      numeProvider: utilizatorPartial.numeProvider,
      providerEmail: utilizatorPartial.email,
    },
  });
  if (lista.length > 0) {
    return { gasit: true, email: lista[0].asociatCu };
  }
  return {
    gasit: false,
  };
};

export const existaProviderCont = async (
  email: string,
  utilizatorPartial: PartialClient
) => {
  try {
    const client = await obtineClientDupaEmail(email);
    if (!client) {
      return {
        ok: false,
        status: 404,
        mesaj: "Utilizatorul nu a fost găsit.",
      } as RaspunsTrimitereEmail;
    }
    const provideri = client.providerii;
    const gasit = provideri.filter(
      (p: Provider) =>
        p.providerContCod === utilizatorPartial.providerContCod &&
        p.numeProvider === utilizatorPartial.numeProvider
    );
    if (gasit.length > 0) {
      return {
        ok: false,
        status: 500,
        mesaj: `Providerul de cont '${gasit[0].numeProvider}' există deja.`,
      } as RaspunsTrimitereEmail;
    }
    return {
      ok: true,
      status: 200,
    } as RaspunsTrimitereEmail;
  } catch (e) {
    console.log("Eroare Verificare Provider: " + e);
    return {
      ok: false,
      status: 500,
      mesaj:
        "A apărut o eroare în timpul verificării existenței providerului de cont.",
    } as RaspunsTrimitereEmail;
  }
};

export const stergeProviderContPrincipal = async (
  email: string,
  providerId: number
) => {
  try {
    const client = await obtineClientDupaEmail(email);
    if (!client) {
      return {
        ok: false,
        status: 404,
        mesaj: "Utilizatorul nu a fost găsit.",
      } as RaspunsTrimitereEmail;
    }
    if (client.parola == null || client.parola.length <= 1) {
      return {
        ok: false,
        status: 404,
        mesaj:
          "Trebuie să setați o parolă pentru contul dvs. înainte de a elimina providerul principal.",
      } as RaspunsTrimitereEmail;
    }
    const prov = await prisma.provider.delete({
      where: {
        codProvider: providerId,
        codClient: client.codClient,
      },
    });
    if (!prov) {
      return {
        ok: false,
        status: 404,
        mesaj: "Providerul nu a fost găsit.",
      } as RaspunsTrimitereEmail;
    }
    return {
      ok: true,
      status: 200,
      mesaj: `Providerul de cont principal '${email}' a fost șters cu succes.`,
    } as RaspunsTrimitereEmail;
  } catch (e) {
    return {
      ok: false,
      status: 500,
      mesaj:
        "A apărut o eroare în timpul ștergerii providerului principal de cont.",
    } as RaspunsTrimitereEmail;
  }
};

export const stergeProviderCont = async (email: string, providerId: number) => {
  try {
    const client = await obtineClientDupaEmail(email);
    if (!client) {
      return {
        ok: false,
        status: 404,
        mesaj: "Utilizatorul nu a fost găsit.",
      } as RaspunsTrimitereEmail;
    }
    const prov = await prisma.provider.delete({
      where: {
        codProvider: providerId,
        codClient: client.codClient,
      },
    });
    if (!prov) {
      return {
        ok: false,
        status: 404,
        mesaj: "Providerul nu a fost găsit.",
      } as RaspunsTrimitereEmail;
    }
    return {
      ok: true,
      status: 200,
      mesaj: `Providerul de cont '${email}' a fost șters cu succes.`,
    } as RaspunsTrimitereEmail;
  } catch (e) {
    return {
      ok: false,
      status: 500,
      mesaj: "A apărut o eroare în timpul ștergerii providerului de cont.",
    } as RaspunsTrimitereEmail;
  }
};

export const creazaProviderCont = async (
  email: string,
  utilizatorPartial: PartialClient,
  evita: boolean
) => {
  try {
    const client = await obtineClientDupaEmail(email);
    if (!client) {
      return {
        ok: false,
        status: 404,
        mesaj: "Utilizatorul nu a fost găsit.",
      } as RaspunsTrimitereEmail;
    }
    const existaProvider = await existaProviderCont(email, utilizatorPartial);
    if (!existaProvider.ok) {
      return existaProvider;
    }
    const dejaExista = await contDejaExistent(utilizatorPartial, evita);
    if (dejaExista) {
      return {
        ok: false,
        status: 500,
        mesaj: "Nu puteți asocia contul dvs. cu un altul care deja există.",
      };
    }
    const asociat = await esteDejaAsociat(utilizatorPartial);
    if (asociat.gasit) {
      return {
        ok: false,
        status: 500,
        mesaj: `Contul este deja asociat cu un alt email '${asociat.email}'.`,
      };
    }
    await prisma.provider.create({
      data: {
        asociatCu: email,
        numeProvider: utilizatorPartial.numeProvider,
        providerContCod: utilizatorPartial.providerContCod,
        providerContNume: utilizatorPartial.numeClient,
        providerEmail: utilizatorPartial.email,
        codClient: client.codClient,
      },
    });
    return {
      ok: true,
      status: 200,
      mesaj: `Contul dvs. a fost asociat cu succes cu emailul '${email}' și providerul '${utilizatorPartial.numeProvider}'.`,
    } as RaspunsTrimitereEmail;
  } catch (e) {
    return {
      ok: false,
      status: 500,
      mesaj: "A apărut o eroare în timpul creării providerului de cont.",
    } as RaspunsTrimitereEmail;
  }
};

export const stergeContClient = async (clientId: number) => {
  const client = await obtineClientDupaCod(clientId);
  if (!client) {
    return {
      ok: false,
      status: 404,
      mesaj: "Utilizatorul nu a putut fi șters, încercați din nou mai târziu.",
    } as RaspunsTrimitereEmail;
  }
  await prisma.client.delete({
    where: {
      codClient: clientId,
    },
  });
  return {
    ok: true,
    status: 200,
    mesaj: `Contul '${client.email}' a fost șters din baza de date.`,
  } as RaspunsTrimitereEmail;
};

export const actualizeazaDetaliiClient = async (
  clientId: number,
  valori: z.infer<typeof schemaActualizareClient>
) => {
  let parolaCriptata = "";
  if (valori.parola && valori.parola.trim().length > 0) {
    parolaCriptata = await cripteazaParola(valori.parola.trim());
  }
  const actualizat = await prisma.client.update({
    where: {
      codClient: clientId,
    },
    data: {
      email: valori.email,
      numeClient: valori.numeClient,
      parola: parolaCriptata,
      telefon: valori.prefix + valori.telefon,
      dataNasterii: valori.dataNasterii,
    },
    include: {
      providerii: true,
    },
  });
  if (!actualizat) {
    return {
      ok: false,
      status: 404,
      mesaj:
        "Utilizatorul nu a putut fi actualizat, încercați din nou mai târziu.",
    } as RaspunsTrimitereEmail;
  }
  return {
    ok: true,
    status: 200,
    client: actualizat as Client,
    mesaj: `Detaliile utilizatorului pentru contul '${actualizat.email}' au fost actualizate!`,
  } as RaspunsTrimitereEmail;
};

export const inregistreazaCuCredentialeSauProvider = async (
  date: DateInregistrare,
  trimiteDeLa: string,
  clientPartial?: PartialClient
) => {
  try {
    if (clientPartial && clientPartial.provider.length > 0) {
      const dateInregistrare = {
        ...date,
        parola: "",
      };
      const clientGasit = await obtineClientDupaEmail(dateInregistrare.email);
      if (clientGasit) {
        return {
          mesaj: `Utilizatorul cu emailul '${dateInregistrare.email}' deja există.`,
          status: 404,
          ok: false,
        } as RaspunsTrimitereEmail;
      }
      const asociereGasita = await esteEmailAsociat(dateInregistrare.email);
      if (asociereGasita) {
        return {
          mesaj: `Utilizatorul cu emailul '${dateInregistrare.email}' este asociat cu un alt cont.`,
          status: 404,
          ok: false,
        } as RaspunsTrimitereEmail;
      }
      const client = await prisma.client.create({
        data: {
          ...dateInregistrare,
          telefon: dateInregistrare.prefix + dateInregistrare.telefon,
          emailVerificat: new Date(),
          creatCuProvider:
            clientPartial.provider + "|" + clientPartial.providerContCod,
        },
        include: {
          providerii: true,
        },
      });
      const creareProvider = await creazaProviderCont(
        client.email,
        clientPartial,
        true
      );
      if (!creareProvider.ok) {
        await prisma.client.delete({
          where: {
            email: client.email,
          },
          include: {
            providerii: true,
          },
        });
        return {
          ok: false,
          mesaj: creareProvider.mesaj,
          status: creareProvider.status,
        } as RaspunsTrimitereEmail;
      }
      return {
        mesaj: `Contul a fost creat cu succes pentru emailul '${client.email}' cu providerul '${clientPartial.numeProvider}'.`,
        ok: true,
        status: 200,
        client: client,
      } as RaspunsTrimitereEmail;
    }
    const dateInregistrare = {
      ...date,
      parola: await cripteazaParola(date.parola),
    };
    const clientGasit = await obtineClientDupaEmail(dateInregistrare.email);
    if (clientGasit) {
      return {
        mesaj: `Utilizatorul cu emailul '${dateInregistrare.email}' deja există.`,
        status: 404,
        ok: false,
      } as RaspunsTrimitereEmail;
    }
    const asociereGasita = await esteEmailAsociat(dateInregistrare.email);
    if (asociereGasita) {
      return {
        mesaj: `Utilizatorul cu emailul '${dateInregistrare.email}' este asociat cu un alt cont.`,
        status: 404,
        ok: false,
      } as RaspunsTrimitereEmail;
    }
    const client = await prisma.client.create({
      data: {
        ...dateInregistrare,
        telefon: dateInregistrare.prefix + dateInregistrare.telefon,
      },
      include: {
        providerii: true,
      },
    });
    return {
      mesaj:
        "Contul a fost creat cu succes, verificați-vă emailul pentru a vă activa contul.",
      ok: true,
      status: 200,
      client: client,
    } as RaspunsTrimitereEmail;
  } catch (e) {
    if (e instanceof Error) {
      return {
        mesaj: e.toString(),
        status: 500,
        ok: false,
      } as RaspunsTrimitereEmail;
    } else {
      return {
        mesaj: "A apărut o eroare necunoscută.",
        status: 500,
        ok: false,
      } as RaspunsTrimitereEmail;
    }
  }
};

export const reseteazaParolaClient = async (
  email: string,
  nouaParola: string
) => {
  const client = await obtineClientDupaEmail(email);
  if (!client) {
    return {
      ok: false,
      status: 404,
      mesaj: `Utilizatorul cu emailul '${email}' nu a fost găsit!`,
    } as RaspunsTrimitereEmail;
  }
  const parolaCriptata = await cripteazaParola(nouaParola);
  const actualizat = await prisma.client.update({
    where: {
      email: email,
    },
    data: {
      parola: parolaCriptata,
    },
  });
  if (!actualizat) {
    return {
      ok: false,
      status: 404,
      mesaj: "A apărut o eroare necunoscută",
    } as RaspunsTrimitereEmail;
  }
  const emailTrimis = getCookie("resetMailSend", { cookies });
  if (emailTrimis && emailTrimis === email) {
    deleteCookie("resetMailSend", { cookies });
  }
  return {
    ok: true,
    status: 200,
    mesaj: `Parola pentru contul '${email}' a fost actualizată cu succes!`,
  } as RaspunsTrimitereEmail;
};
