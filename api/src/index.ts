import express, { json, Request, Response } from "express";
import dotenv from "dotenv";
import { ExtractText } from "./utils/ExtractText";
// import { PcSave } from "./IA/pinecone";
import crypto from 'crypto';
import { GptManager } from "./IA/gpt";
import cors from 'cors';
import { Scrappe } from "./utils/scrappe";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post("/", async (request: Request, response: Response) => {
    const shareUrl = request.body.shareUrl;
    const recordId = crypto.createHash('md5').update(shareUrl).digest("hex")

    console.log("---------------------------------------------------")
    console.log(shareUrl)
    console.log("Recherche : DEBUT")

    const extractor = new ExtractText();
    try {
        await extractor.extractFromLink(shareUrl);
    } catch (error) {
        console.error(error);
        response.status(500).send();
    }

    if (extractor.getRaw() != "") {
        
        const gpt = new GptManager(
            extractor.getCleanedText(),
            extractor.getRaw()
        )

        // enregistrer dans pinecone
        // await PcSave(pageHtmlBodyText, recordId)

        // faire le résumé
        const summary = await gpt.makeSummary()

        // enregistrer le resumé dans pinecone
        // if (summary) await PcSave(summary, recordId)

        // faire un tableau html
        const table = await gpt.makeTable()

        // enregistrer le tableau dans pinecone
        // if (table) await PcSave(table, recordId)

        const goodToInvest = await gpt.isGoodToInvest()

        const scrappe = new Scrappe(extractor.getRaw());
        const useFulLink = await scrappe.getUseFulLinks()

        gpt.purgeConv()
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