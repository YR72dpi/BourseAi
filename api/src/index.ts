import express, { json, Request, Response } from "express";
import dotenv from "dotenv";
import { getUseFulLinks, isGoodToInvest, makeSummary, makeTable, purgeConv, setPageText, setRawPageText } from "./IA/gpt";
import { ExtractText } from "./utils/ExtractText";
// import { PcSave } from "./IA/pinecone";
import crypto from 'crypto';
var cors = require('cors')

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/", async (request: Request, response: Response) => {
    const shareUrl = request.body.shareUrl;
    const recordId = crypto.createHash('md5').update(shareUrl).digest("hex")
    console.log(recordId)
    console.log("Recherche : DEBUT")

    // recup le contenu de la page
    const extractor = new ExtractText();
    let pageHtmlBodyText = ""
    let pageHtmlBodyTextRaw = ""

    try {
        await extractor.extractFromLink(shareUrl);
        pageHtmlBodyText = extractor.getCleanedText();
        pageHtmlBodyTextRaw = extractor.getRaw();
    } catch (error) {
        console.error(error);
        response.status(500).send();
    }

    if (pageHtmlBodyText != "") {
        // set les different version de la page
        setRawPageText(pageHtmlBodyTextRaw)
        setPageText(pageHtmlBodyText)

        // enregistrer dans pinecone
        // await PcSave(pageHtmlBodyText, recordId)
        // faire le résumé
        const summary = await makeSummary()
        // enregistrer le resumé dans pinecone
        // if (summary) await PcSave(summary, recordId)
        // faire un tableau html
        const table = await makeTable()
        // enregistrer le tableau dans pinecone
        // if (table) await PcSave(table, recordId)

        const goodToInvest = await isGoodToInvest()
        const useFulLink = await getUseFulLinks()

        purgeConv()
        console.log("Recherche : FIN")

        response.json({
            url: shareUrl,
            result: {
                invest: goodToInvest,
                summary: summary,
                usefullLinks: useFulLink,
                table: table
            }
        });
    }

});

app.listen(process.env.PORT, () => {
    console.log("Server running at PORT: ", process.env.PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});