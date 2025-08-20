import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import "dotenv/config";

export async function chat(query){
    const embeddings = new OpenAIEmbeddings(
        {
            model:'text-embedding-3-large'
        }
    )
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url:process.env.QDRANT_URL,
            collectionName:"notebook-lm-rag",
            apiKey:process.env.QDRANT_KEY,

        }
    )
    const vectorSearcher=vectorStore.asRetriever({
        k:3
    })
    const relevantChats = await vectorSearcher.invoke(query);
    return relevantChats;
    
} 
