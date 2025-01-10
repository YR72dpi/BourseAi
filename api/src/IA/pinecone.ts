import OpenAI from 'openai';
import dotenv from "dotenv";
import {v4} from 'uuid';
import { IndexList, Pinecone, PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone';

// configures dotenv to work in your application
dotenv.config();
const TEMPERATURE: number = parseFloat(process.env.GPT_TEMPERATURE as string)

const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

async function createIndexIfNotExists() {
    try {
        // Vérifier si l'index existe
        const existingIndexes = await pc.listIndexes() as IndexList;
        const indexName = "read-for-me";

        let exist = false;
        Array.prototype.slice.call(existingIndexes.indexes).forEach(i => {
            console.log(i.name)
            if (i.name == indexName && !exist) {
                exist = true
                console.log(`L'index "${indexName}" existe déjà.`);
                return;
            }
        })
        if (exist) {
            console.log(`L'index "${indexName}" existe déjà.`);
            return;
        }

        // Créer l'index s'il n'existe pas
        await pc.createIndex({
            name: indexName,
            dimension: 1536, // Nombre de dimensions pour l'embedding
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });

        console.log(`L'index "${indexName}" a été créé avec succès !`);
    } catch (error) {
        console.error("Erreur lors de la vérification ou de la création de l'index :", error);
    }
}

// notre fonction pour générer des embeddings
async function generateEmbedding(inputText: string) {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: inputText,
        });
        const embedding = response.data[0].embedding;
        return embedding;
    } catch (error) {
        console.error("Erreur lors de la génération de l'embedding :", error);
    }
}

interface Record {
    id: string,
    metadata: {
        text: string,
        urlHash: string
    },
    values: number[] | undefined
}

export const PcSave = async (rawPageText: string, idIndex: string) => {
    console.log("Enregistrement des vecteur dans pinecote: DEBUT")
    try {
        await createIndexIfNotExists()

        let recordsSet: Record[] = []
        // completer le recordsSet

        rawPageText.split(". ").forEach(sentence => {
            if (sentence !== "") {
                recordsSet.push({
                    id: idIndex + ":" + v4(),
                    metadata: { text: sentence, urlHash: idIndex },
                    values: undefined
                })
            }
        })

        //  Les enregistrements se composent d'une id, d'un texte et de sa representation vectorielle. 
        // Ici on va creer les vecteurs et les ajouter a chaque enregistrement    
        console.log("Vectorisation: DEBUT")
        for (const record of recordsSet) record.values = await generateEmbedding(record.metadata.text);
        console.log("Vectorisation: FIN")

        const index = pc.index('read-for-me');
        // insertion dans Pinecone
        console.log("Record saving")
        await index.upsert(recordsSet as PineconeRecord<RecordMetadata>[]);
        console.log("Record saving: FIN")
        console.log("Enregistrement des vecteur dans pinecote: FIN")

    } catch (error) {
        console.log("Error on saving record for pinecone : ", error)
    }
}
