import 'dotenv/config'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";


export default async function main(path) {
    const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }

  // Convert response into a Blob
  const blob = await response.blob();

  // Pass the blob into PDFLoader
  const loader = new PDFLoader(blob);

    const docs = await loader.load();
    const embeddings = new OpenAIEmbeddings({
        model:'text-embedding-3-large'
    })
    await QdrantVectorStore.fromDocuments(
        docs,embeddings,{
            url:process.env.QDRANT_URL,
            collectionName:"notebook-lm-rag",
            apiKey:process.env.QDRANT_KEY,
        }
    )
    return "done";
}