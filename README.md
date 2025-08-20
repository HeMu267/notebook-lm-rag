PDF RAG Assistant

A Next.js-based RAG (Retrieval-Augmented Generation) system that allows users to upload PDFs, index them, and ask questions over their content using OpenAI LLMs. Supports session-based limits and Cloudinary storage for PDFs.

Features

Upload up to 3 PDFs per session.

Store PDFs on Cloudinary (public or private URLs).

Parse PDFs and extract text automatically.

Chunk text for embeddings using LangChain.

Create in-memory vector store per session.

Ask questions over uploaded PDFs using OpenAI embeddings + GPT-4o-mini.

Session-based upload tracking with cookies, no login required.

Tech Stack

Frontend: Next.js 13, React, Tailwind CSS

Backend: Next.js API routes, middleware for session management

PDF Handling: pdf-parse, PDFLoader from LangChain

Vector Store: In-memory per session (MemoryVectorStore)

LLM & Embeddings: OpenAI API (text-embedding-3-small, gpt-4o-mini)

File Storage: Cloudinary (free tier supported)

Getting Started
1. Clone the repository
git clone <repo-url>
cd pdf-rag-assistant

2. Install dependencies
yarn install
# or
npm install --legacy-peer-deps

3. Set environment variables

Create a .env.local file:

OPENAI_API_KEY=sk-xxxx
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

4. Run the development server
yarn dev
# or
npm run dev


Open http://localhost:3000
 to see the app.

Folder Structure
/app
  /api
    /upload          # Upload PDF to Cloudinary
    /index-pdf       # Parse & chunk PDF for embeddings
    /ask             # Query session vector store
/lib
  cloudinary.js      # Cloudinary config
  sessionVectorStore.ts  # In-memory vector store per session
/middleware.ts       # Session ID + upload tracking
/components
  SourcesPanel.tsx   # PDF / Text / URL upload UI

Usage

Upload PDFs
Click + Add PDF or submit text/URLs. Each session allows max 3 sources.

Index PDFs
The backend will automatically fetch the PDF from Cloudinary, parse text, and create embeddings.

Ask Questions
Send a query via /api/ask to get answers based on uploaded content.

Notes

Session expires when the cookie is cleared or browser refreshes (configurable).

Free-tier friendly: Uses in-memory vector store and free OpenAI embeddings (text-embedding-3-small).

