import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

export async function chat(query){
    const embeddings = new OpenAIEmbeddings(
        {
            model:'text-embedding-3-large'
        }
    )
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url:"http://localhost:6333",
            collectionName:"notebook-lm-rag"
        }
    )
    const vectorSearcher=vectorStore.asRetriever({
        k:3
    })
    const relevantChats = await vectorSearcher.invoke(query);
    return relevantChats;
    
}
