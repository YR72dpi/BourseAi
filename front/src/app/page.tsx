"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export interface ApiResponse {
  url: string
  result: {
    invest: {
      companyName: string,
      goodToInvest: boolean;
      craze: number;
      whyFor: string;
      whyNotFor: string;
    };
    summary: string;
    usefullLinks: {
      textUrl: string;
      url: string;
    }[];
    table: string; // HTML sous forme de chaîne
  };
}


export default function Home() {
  const [inputValue, setInputValue] = useState(""); // Pour stocker la valeur de l'input
  const [apiResponse, setApiResponse] = useState<null | ApiResponse>(); // Pour stocker la réponse de l'API
  const [responseError, setResponseError] = useState<null | string>(); // Pour stocker la réponse de l'API
  const [loading, setLoading] = useState(false); // Pour gérer l'état de chargement

  const handleFetchData = async () => {
    if (!inputValue) {
      alert("Veuillez entrer un lien !");
      return;
    }

    setLoading(true);
    setApiResponse(null); // Réinitialiser la réponse pendant le chargement
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "shareUrl": inputValue
      });

      const response = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      });

      if (!response.ok) throw new Error("Erreur lors de l'appel API");

      const data: ApiResponse = await response.json();
      console.log(data)
      setApiResponse(data); // Supposons que l'API retourne un champ `result`
      setResponseError(null)
    } catch (error) {
      setResponseError("Erreur lors de la récupération des données.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex gap-5">
        <Input
          type="search"
          placeholder="Lien d'une action zone bourse"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setResponseError(null)
          }}
        />
        <Button onClick={handleFetchData} disabled={loading}>
          {loading ? "Chargement..." : "Rechercher"}
        </Button>
      </div>
      <ScrollArea className="w-full h-[85vh] rounded-md border p-5 flex flex-col gap-5">
        {responseError ?? (
          <p>{responseError}</p>
        )}

        {apiResponse ? (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {apiResponse.result.invest.companyName}
              <a href={apiResponse.url} className="text-3xl"> 🌐</a>
            </h1>
            <p className="mb-5 text-justify indent-2.5">{apiResponse.result.summary}</p>
            <Separator />
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
              Bon investissement : {apiResponse.result.invest.goodToInvest ? ("Oui ✅") : ("non ❌")}
            </h2>
            <p className="text-sm text-muted-foreground">GPT à estimé un score de de {apiResponse.result.invest.craze}%</p>
            <h3 className="text-2xl font-medium text-gray-700 mt-3">Pourquoi investir ?</h3>
            <p className="text-justify indent-2.5 ">{apiResponse.result.invest.whyFor}</p>
            <h3 className="text-2xl font-medium text-gray-700 mt-3">Pourquoi ne pas investir ?</h3>
            <p className="text-justify indent-2.5 mb-5">{apiResponse.result.invest.whyNotFor}</p>
            <Separator />
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">Données clés</h2>
            <div
              dangerouslySetInnerHTML={{ __html: apiResponse.result.table }}
              className="overflow-x-auto mb-5"
            ></div>
            <Separator />
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">Liens utiles</h2>
            <ul>
              {apiResponse.result.usefullLinks.map((link, index) => (
                <li key={index}>
                  <a href={"https://www.zonebourse.com" + link.url} className="text-blue-500 hover:underline">
                    {link.textUrl}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          loading && !responseError ? (
            <div>
              <Skeleton className="w-1/2 h-[40px] mb-5" />
              <Skeleton className="w-full h-[300px]" />
              <Separator />
              <h2 className="text-3xl font-semibold text-gray-800 mt-4">
                Bon investissement : <Skeleton className="w-1/4 h-[20px]" />
              </h2>
              <Skeleton className="text-sm text-muted-foreground" />
              <h3 className="text-2xl font-medium text-gray-700 mt-3">Pourquoi investir ?</h3>
              <Skeleton className="w-full h-[100px] " />
              <h3 className="text-2xl font-medium text-gray-700 mt-3">Pourquoi ne pas investir ?</h3>
              <Skeleton className="w-full h-[100px] mb-5" />
              <Separator />
              <h2 className="text-3xl font-semibold text-gray-800 mt-4">Données clés</h2>
              <Skeleton className="w-full h-[500px]" />
              <Separator />
              <h2 className="text-3xl font-semibold text-gray-800 mt-4">Liens utiles</h2>
              <Skeleton className="w-full h-[500px]" />
            </div>
          ) : (
            !responseError ? (
              <div>
                <p>Entrez une url</p>
              </div>
            ) : (<></>)

          )

        )}
      </ScrollArea>
    </div>
  );
}
