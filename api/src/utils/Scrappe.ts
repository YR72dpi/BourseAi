import * as cheerio from 'cheerio';

export class Scrappe {
    public rawPageText: string = ""
    
    useFulLinksCssSelector = "nav.menu-primary.grid-full.gbetween a"

    constructor(rawHTML: string) {
        this.rawPageText = rawHTML
    }

    async getUseFulLinks() {
        console.log("Analyse pour avoir les liens utiles: DEBUT")
        try {
            // Vérifiez que this.rawPageText n'est pas vide
            if (!this.rawPageText) {
                console.error('Le contenu HTML (rawPageText) est introuvable ou vide.');
                return [];
            }

            // Charger le contenu HTML avec cheerio
            const $: cheerio.Root = cheerio.load(this.rawPageText);

            // Vérifiez combien de balises <a> existent
            const totalLinks = $(this.useFulLinksCssSelector);

            // Extraire les liens et leur texte
            const links: { textUrl: string; url: string }[] = [];
            totalLinks.each((index, element) => {
                const text = $(element).text().trim(); // Récupérer le texte du lien
                const href = $(element).attr('href');  // Récupérer l'attribut href
                if (href) {
                    links.push({ textUrl: text, url: href }); // Ajouter au tableau avec texte et URL
                }
            });

            console.log("Analyse pour avoir les liens utiles: DEBUT")

            return links; // Retourne un tableau d'objets JSON

        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    }
}