"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export interface ApiResponse {
  result: {
    invest: {
      companyName: string,
      goodToInvest: boolean;
      gptCraze: number;
      why: string;
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
  const [inputValue, setInputValue] = useState("https://www.zonebourse.com/cours/action/STELLANTIS-N-V-117814143/"); // Pour stocker la valeur de l'input
  const [apiResponse, setApiResponse] = useState<null|ApiResponse>(); // Pour stocker la réponse de l'API
  const [responseError, setResponseError] = useState<null|String>(); // Pour stocker la réponse de l'API
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
      
      const data: ApiResponse= await response.json();
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
      <ScrollArea className="w-full rounded-md border p-2">
        {responseError ?? (
          <p>{responseError}</p>
        )}
        
        {apiResponse ? (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {apiResponse.result.invest.companyName}
            </h1>
            <p>{apiResponse.result.summary}</p>
            <Separator />
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
              Bon investissement : {apiResponse.result.invest.goodToInvest ? ("Oui ✅"): ("non ❌")}
            </h2>
            <h3 className="text-2xl font-medium text-gray-700 mt-3">Pourquoi ?</h3>
            <p>{apiResponse.result.invest.why}</p>
            <Separator />
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">Données clés</h2>
            <div
              dangerouslySetInnerHTML={{ __html: apiResponse.result.table }}
              className="overflow-x-auto"
            ></div>
            <Separator />
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">Liens utiles</h2>
            <ul>
            {apiResponse.result.usefullLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} className="text-blue-500 hover:underline">
                  {link.textUrl}
                </a>
              </li>
            ))}
            </ul>
          </>
        ) : (
          <div className="text-gray-500">Aucune donnée disponible</div>
        )}
      </ScrollArea>
    </div>
  );
}
