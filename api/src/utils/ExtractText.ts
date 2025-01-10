export class ExtractText {
    private rawHTML: string = "";

    /**
     * Extrait le contenu HTML brut depuis un lien.
     * @param url - L'URL de la page web à extraire.
     * @returns Une instance de la classe.
     */
    async extractFromLink(url: string): Promise<this> {
        console.log("Extraction du texte depuis la page...");
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let text = await response.text();

            text = text
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gim, "") // Supprime les balises <script> et leur contenu
            .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gim, "") // Supprime les balises <style> et leur contenu

            // Stocke le contenu brut dans la propriété rawHTML
            this.rawHTML = text;
            return this;
        } catch (error: any) {
            console.error(`Error fetching page: ${error.message}`);
            throw new Error(`Error fetching page: ${error.message}`);
        }
    }

    /**
     * Renvoie le contenu brut HTML.
     * @returns Le contenu brut HTML.
     */
    getRaw(): string {
        return this.rawHTML;
    }

    /**
     * Renvoie le contenu sans les balises HTML, les sauts de ligne, ni les tabulations.
     * @returns Le texte nettoyé.
     */
    getCleanedText(): string {
        return this.rawHTML
            .replace(/<[^>]*>/g, " ") // Supprime toutes les balises HTML
            .replace(/\n/g, " ") // Supprime les sauts de ligne
            .replace(/\t/g, " ") // Supprime les tabulations
            .replace(/\s+/g, " ") // Supprime les espaces multiples
            .trim(); // Supprime les espaces au début et à la fin
    }
}
