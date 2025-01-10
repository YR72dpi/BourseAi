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

export async function makeSummary(rawPageText: string) {

    console.log("Demander à chatGPT de faire un resumé: DEBUT")
    try {
        conv.push({
            role: "system",
            content: MAKE_SUMMARY
        })
        conv.push({
            role: "user",
            content: rawPageText
        });

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

        return aiResponse

    } catch (error) {
        console.error('Erreur:', error);
    }

}

export async function makeTable(rawPageText: string) {
    console.log("Demander à chatGPT de faire un tableau HTML: DEBUT")
    try {
        conv.push({
            role: "system",
            content: MAKE_TABLE
        })
        conv.push({
            role: "user",
            content: rawPageText
        });

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

        return aiResponse

    } catch (error) {
        console.error('Erreur:', error);
    }
}

export async function isGoodToInvest(rawPageText: string) {
    console.log("Demander à chatGPT s'il faut investir: DEBUT")
    try {
        conv.push({
            role: "system",
            content: GOOD_INVEST
        })
        conv.push({
            role: "user",
            content: rawPageText
        });

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
            goodToInvest: aiResponse.split("|")[0] === "true" ? true : false,
            gptCraze: parseInt(aiResponse.split("|")[1]),
            why: aiResponse.split("|")[2]
        }

        console.log("Demander à chatGPT s'il faut investir: FIN")

        return returnObject

    } catch (error) {
        console.error('Erreur:', error);
    }
}

export async function getUseFulLinks(rawPageText: string) {
    console.log("Demander les liens utils à chatGPT: DEBUT")
    try {
        conv.push({
            role: "system",
            content: GET_USEFUL_LINKS
        })
        conv.push({
            role: "user",
            content: rawPageText
        });

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

        return returnObject

    } catch (error) {
        console.error('Erreur:', error);
    }
}
