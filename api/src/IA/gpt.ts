import OpenAI from 'openai';
import dotenv from "dotenv";
import { ChatCompletion, ChatCompletionCreateParams, ChatCompletionMessageParam } from 'openai/resources';
import { MAKE_SUMMARY } from '../../promptSystem/makeSummary';
import { MAKE_TABLE } from '../../promptSystem/makeTable';
import { GOOD_INVEST } from '../../promptSystem/goodInvest';


export class GptManager {
    // configures dotenv to work in your application
    TEMPERATURE: number = parseFloat(process.env.GPT_TEMPERATURE as string)

    openai = new OpenAI({
        apiKey: process.env.GPT_API_KEY
    });

    public conv: any[] = [];
    public rawPageText: string = ""
    public pageText: string = ""

    constructor(cleanText: string, rawHTML: string) {
        dotenv.config();
        this.setRawPageText(rawHTML)
        this.setPageText(cleanText)
    }

    setRawPageText(rawPageTextGiven: string | null) {
        if (rawPageTextGiven === null) {
            rawPageTextGiven = this.rawPageText
        } else {
            this.rawPageText = rawPageTextGiven
        }

        this.conv.push({
            role: "user",
            content: "Page html brute : \n" + rawPageTextGiven
        });
    }

    setPageText(pageTextGiven: string | null) {
        if (pageTextGiven === null) {
            pageTextGiven = this.pageText
        } else {
            this.rawPageText = pageTextGiven
        }

        this.conv.push({
            role: "user",
            content: "Texte de la page : \n" + pageTextGiven
        });
    }

    resetConv() {
        this.conv = []
        this.setPageText(null)
        this.setRawPageText(null)
    }

    purgeConv() {
        this.conv = []
    }

    async makeSummary() {

        console.log("Demander à chatGPT de faire un resumé: DEBUT")
        try {
            this.conv.push({
                role: "system",
                content: MAKE_SUMMARY
            })

            const requestParam: ChatCompletionCreateParams = {
                model: process.env.GPT_MODEL as string,
                messages: this.conv as ChatCompletionMessageParam[],
                temperature: this.TEMPERATURE
            }

            const response: ChatCompletion = await this.openai.chat.completions.create(requestParam);

            const aiResponse: string = response.choices[0].message.content as string;

            console.log("Demander à chatGPT de faire un resumé: FIN")
            this.resetConv()

            return aiResponse

        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    async makeTable() {
        console.log("Demander à chatGPT de faire un tableau HTML: DEBUT")
        try {
            this.conv.push({
                role: "system",
                content: MAKE_TABLE
            })

            const requestParam: ChatCompletionCreateParams = {
                model: process.env.GPT_MODEL as string,
                messages: this.conv as ChatCompletionMessageParam[],
                temperature: this.TEMPERATURE
            }

            const response: ChatCompletion = await this.openai.chat.completions.create(requestParam);

            let aiResponse: string = response.choices[0].message.content as string;
            aiResponse = aiResponse
                .replace(/```/gim, '')
                .replace(/^html/gim, '')
                .replace(/\n/g, ' ')  // Remove newlines
                .replace(/\t/g, ' ')  // Remove tabs
                .replace(/\s+/g, ' ')  // Remove extra spaces
                .trim()

            console.log("Demander à chatGPT de faire un tableau HTML: FIN")
            this.resetConv()

            return aiResponse

        } catch (error) {
            console.error('Erreur:', error);
        }

    }

    async isGoodToInvest() {
        console.log("Demander à chatGPT s'il faut investir: DEBUT")
        try {
            this.conv.push({
                role: "system",
                content: GOOD_INVEST
            })

            const requestParam: ChatCompletionCreateParams = {
                model: process.env.GPT_MODEL as string,
                messages: this.conv as ChatCompletionMessageParam[],
                temperature: this.TEMPERATURE
            }

            const response: ChatCompletion = await this.openai.chat.completions.create(requestParam);

            let aiResponse: string = response.choices[0].message.content as string;

            let returnObject = {
                companyName: aiResponse.split("|")[0],
                goodToInvest: aiResponse.split("|")[1] === "true" ? true : false,
                craze: parseInt(aiResponse.split("|")[2]),
                whyFor: aiResponse.split("|")[3],
                whyNotFor: aiResponse.split("|")[4]
            }

            console.log("Demander à chatGPT s'il faut investir: FIN")
            this.resetConv()

            return returnObject

        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}
