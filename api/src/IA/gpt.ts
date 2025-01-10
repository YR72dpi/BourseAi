import OpenAI from 'openai';
import dotenv from "dotenv";
import { ChatCompletion, ChatCompletionCreateParams, ChatCompletionMessageParam } from 'openai/resources';
import { MAKE_SUMMARY } from '../../promptSystem/makeSummary';
import { MAKE_TABLE } from '../../promptSystem/makeTable';
import { GOOD_INVEST } from '../../promptSystem/goodInvest';
import { GET_USEFUL_LINKS } from '../../promptSystem/getUsefulLink';

// configures dotenv to work in your application
dotenv.config();
const TEMPERATURE: number = parseFloat(process.env.GPT_TEMPERATURE as string)

const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY
});

let conv: any[] = [];
let rawPageText: string = ""
let pageText: string = ""

export function setRawPageText(rawPageTextGiven: string | null) {
    if (rawPageTextGiven === null) {
        rawPageTextGiven = rawPageText
    } else {
        rawPageText = rawPageTextGiven
    }

    conv.push({
        role: "user",
        content: "Page html brute : \n" + rawPageTextGiven
    });
}

export function setPageText(pageTextGiven: string | null) {
    if (pageTextGiven === null) {
        pageTextGiven = pageText
    } else {
        rawPageText = pageTextGiven
    }
    conv.push({
        role: "user",
        content: "Texte de la page : \n" + pageTextGiven
    });
}

export function resetConv() { 
    conv = [] 
    setPageText(null)
    setRawPageText(null)
}

export function purgeConv() { 
    conv = []
}

export async function makeSummary() {

    console.log("Demander à chatGPT de faire un resumé: DEBUT")
    try {
        conv.push({
            role: "system",
            content: MAKE_SUMMARY
        })

        const requestParam: ChatCompletionCreateParams = {
            model: process.env.GPT_MODEL as string,
            messages: conv as ChatCompletionMessageParam[],
            temperature: TEMPERATURE
        }

        const response: ChatCompletion = await openai.chat.completions.create(requestParam);

        const aiResponse: string = response.choices[0].message.content as string;
        conv.push({
            role: "assistant",
            content: aiResponse
        });

        console.log("Demander à chatGPT de faire un resumé: FIN")
        resetConv()

        return aiResponse

    } catch (error) {
        console.error('Erreur:', error);
    }
}

export async function makeTable() {
    console.log("Demander à chatGPT de faire un tableau HTML: DEBUT")
    try {
        conv.push({
            role: "system",
            content: MAKE_TABLE
        })

        const requestParam: ChatCompletionCreateParams = {
            model: process.env.GPT_MODEL as string,
            messages: conv as ChatCompletionMessageParam[],
            temperature: TEMPERATURE
        }

        const response: ChatCompletion = await openai.chat.completions.create(requestParam);

        let aiResponse: string = response.choices[0].message.content as string;
        aiResponse = aiResponse
            .replace(/```/gim, '')
            .replace(/^html/gim, '')
            .replace(/\n/g, ' ')  // Remove newlines
            .replace(/\t/g, ' ')  // Remove tabs
            .replace(/\s+/g, ' ')  // Remove extra spaces
            .trim()

        conv.push({
            role: "assistant",
            content: aiResponse
        });

        console.log("Demander à chatGPT de faire un tableau HTML: FIN")
        resetConv()

        return aiResponse

    } catch (error) {
        console.error('Erreur:', error);
    }

}

export async function isGoodToInvest() {
    console.log("Demander à chatGPT s'il faut investir: DEBUT")
    try {
        conv.push({
            role: "system",
            content: GOOD_INVEST
        })

        const requestParam: ChatCompletionCreateParams = {
            model: process.env.GPT_MODEL as string,
            messages: conv as ChatCompletionMessageParam[],
            temperature: TEMPERATURE
        }

        const response: ChatCompletion = await openai.chat.completions.create(requestParam);

        let aiResponse: string = response.choices[0].message.content as string;
        conv.push({
            role: "assistant",
            content: aiResponse
        });

        let returnObject = {
            companyName: aiResponse.split("|")[0],
            goodToInvest: aiResponse.split("|")[1] === "true" ? true : false,
            gptCraze: parseInt(aiResponse.split("|")[2]),
            why: aiResponse.split("|")[3]
        }

        console.log("Demander à chatGPT s'il faut investir: FIN")
        resetConv()

        return returnObject

    } catch (error) {
        console.error('Erreur:', error);
    }
}

export async function getUseFulLinks() {
    console.log("Demander les liens utils à chatGPT: DEBUT")
    try {
        conv.push({
            role: "system",
            content: GET_USEFUL_LINKS
        })

        const requestParam: ChatCompletionCreateParams = {
            model: process.env.GPT_MODEL as string,
            messages: conv as ChatCompletionMessageParam[],
            temperature: TEMPERATURE
        }

        const response: ChatCompletion = await openai.chat.completions.create(requestParam);

        let aiResponse: string = response.choices[0].message.content as string;
        aiResponse = aiResponse
            .replace(/```/gim, '')
            .replace(/^json/gim, '')
            .replace(/\n/g, ' ')  // Remove newlines
            .replace(/\t/g, ' ')  // Remove tabs
            .replace(/\s+/g, ' ')  // Remove extra spaces
            .trim()

        conv.push({
            role: "assistant",
            content: aiResponse
        });

        const returnObject = JSON.parse(aiResponse)

        console.log("Demander les liens utils à chatGPT: FIN")
        resetConv()
        return returnObject

    } catch (error) {
        console.error('Erreur:', error);
    }
}
