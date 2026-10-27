---
title: Medical PDF Chatbot
date: '2026-01-03'
description: 'A Retrieval-Augmented Generation (RAG) based medical PDF chatbot built with **Python, Flask, LangChain, Google Gemini, Pinecone, and Hugging Face embeddings**.'
image: /images/writing/api-costs-july-2025.png
imageAlt: 'Anthropic API costs for July 2025 showing $9,986.20 in token usage'
---

## Context

Medical PDF Chatbot

A Retrieval-Augmented Generation (RAG) based medical PDF chatbot built
with **Python, Flask, LangChain, Google Gemini, Pinecone, and Hugging
Face embeddings**.

The application provides a web-based chat interface where users can ask
questions and receive concise answers based on information retrieved
from the indexed medical documents.

## Features

-   📄 PDF document ingestion
-   🔎 Semantic similarity search over document chunks
-   🧠 Retrieval-Augmented Generation (RAG)
-   🤖 Google Gemini 2.5 Flash for answer generation
-   🗃️ Pinecone vector database for persistent vector search
-   🔤 Hugging Face `all-MiniLM-L6-v2` embeddings
-   🌐 Flask web application
-   💬 Simple Bootstrap-based chat interface
-   ⚡ Concise, context-grounded responses

## Architecture

``` text
PDF Documents
     │
     ▼
PyPDFLoader
     │
     ▼
Text Extraction
     │
     ▼
Recursive Character Text Splitter
(chunk size: 500, overlap: 20)
     │
     ▼
Hugging Face Embeddings
(all-MiniLM-L6-v2, 384 dimensions)
     │
     ▼
Pinecone Vector Database
     │
     ▼
Similarity Retriever
(top 3 relevant chunks)
     │
     ▼
Google Gemini 2.5 Flash
     │
     ▼
Generated Answer
     │
     ▼
Flask Chat Interface
```

## Tech Stack

  ------------------------------------------------------------------------------
  Component                           Technology
  ----------------------------------- ------------------------------------------
  Programming Language                Python

  Web Framework                       Flask

  LLM                                 Google Gemini 2.5 Flash

  RAG Framework                       LangChain

  Vector Database                     Pinecone

  Embedding Model                     Hugging Face
                                      `sentence-transformers/all-MiniLM-L6-v2`

  PDF Loader                          LangChain `PyPDFLoader`

  Text Splitter                       `RecursiveCharacterTextSplitter`

  Frontend                            HTML, CSS, Bootstrap, JavaScript/jQuery

  Deployment Server                   Gunicorn
  ------------------------------------------------------------------------------

## Project Structure

``` text
Chat_Bot_PDF/
│
├── data/
│   └── PDF documents used for indexing
│
├── research/
│   └── Research/reference material
│
├── src/
│   ├── __init__.py
│   ├── helper.py
│   └── prompt.py
│
├── static/
│   └── style.css
│
├── templates/
│   └── chat.html
│
├── app.py
├── store_index.py
├── requirements.txt
├── runtime.txt
├── setup.py
├── template.sh
└── README.md
```

## How the RAG Pipeline Works

### 1. Load PDF documents

PDF files placed inside the `data/` directory are loaded using
LangChain's `DirectoryLoader` and `PyPDFLoader`.

### 2. Clean document metadata

The application keeps the document source and page content required for
retrieval.

### 3. Split text into chunks

The extracted content is divided into smaller chunks using:

``` python
RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=20
)
```

This makes the documents easier to embed and retrieve efficiently.

### 4. Generate embeddings

The project uses:

``` text
sentence-transformers/all-MiniLM-L6-v2
```

The embedding model produces **384-dimensional vectors**.

### 5. Store vectors in Pinecone

The generated vectors are uploaded to a Pinecone index named:

``` text
medical-chatbot
```

The index uses cosine similarity and is configured as a Pinecone
serverless index.

### 6. Retrieve relevant information

When a user asks a question, the application performs similarity search
and retrieves the **top 3 relevant document chunks**.

### 7. Generate the answer

The retrieved context is passed to **Google Gemini 2.5 Flash** through
LangChain.

The system prompt instructs the model to:

-   answer using the retrieved context;
-   say it does not know when the answer is unavailable;
-   keep the response concise;
-   use a maximum of three sentences.

## Installation

### Prerequisites

Make sure the following are installed:

-   Python 3.10+
-   Git
-   A Pinecone account/API key
-   A Google Gemini API key

### 1. Clone the repository

``` bash
git clone https://github.com/saranshvaidya0/Chat_Bot_PDF.git
cd Chat_Bot_PDF
```

### 2. Create a virtual environment

Windows:

``` bash
python -m venv venv
venv\Scripts\activate
```

Linux/macOS:

``` bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

``` bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root:

``` env
PINECONE_API_KEY=your_pinecone_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit the `.env` file or API keys to GitHub.

## Indexing the PDF Documents

Place the PDF files that you want the chatbot to understand inside:

``` text
data/
```

Then run:

``` bash
python store_index.py
```

This script:

1.  loads the PDFs;
2.  extracts their text;
3.  splits the text into chunks;
4.  creates embeddings;
5.  creates the Pinecone index if it does not already exist;
6.  uploads the document embeddings to Pinecone.

The current implementation uses the Pinecone index:

``` text
medical-chatbot
```

with a vector dimension of:

``` text
384
```

## Running the Application

Start the Flask application:

``` bash
python app.py
```

The application runs on:

``` text
http://127.0.0.1:8080
```

Open that address in your browser.

## Using the Chatbot

1.  Start the Flask server.
2.  Open the application in a browser.
3.  Enter a question in the chat box.
4.  The application sends the question to the `/get` endpoint.
5.  LangChain retrieves the most relevant document chunks from Pinecone.
6.  Gemini generates an answer using the retrieved context.
7.  The answer is displayed in the chat interface.

## API Endpoint

### `POST /get`

Used by the web interface to send a question to the chatbot.

Example form data:

``` text
msg=What are the symptoms mentioned in the document?
```

The endpoint returns the generated answer as text.

## Environment Variables

  Variable             Purpose
  -------------------- ---------------------------------------
  `PINECONE_API_KEY`   Authenticates access to Pinecone
  `GEMINI_API_KEY`     Authenticates access to Google Gemini

## Important Notes

### Medical information

This project is an educational/technical demonstration of a
document-based medical chatbot. It should **not** be treated as a
replacement for a qualified medical professional, diagnosis, or
emergency medical care.

### API key security

Never place API keys directly inside Python source files.

Use environment variables through `.env` and keep `.env` out of version
control.

### Existing Pinecone index

The application expects the Pinecone index to be named:

``` text
medical-chatbot
```

If you change the index name in `store_index.py`, make the same change
in `app.py`.

## Limitations

-   The chatbot's knowledge is limited to the documents indexed in
    Pinecone.
-   Response quality depends on the quality and completeness of the
    source PDFs.
-   Retrieval is currently configured to return three relevant chunks.
-   The application does not provide medical diagnosis or professional
    medical advice.
-   The current interface is intentionally simple and can be extended
    with authentication, chat history, source citations, document
    management, and improved UI.

## Future Improvements

Potential improvements include:

-   [ ] Multi-PDF upload from the web interface
-   [ ] Display retrieved sources and page numbers
-   [ ] Conversation history
-   [ ] User authentication
-   [ ] Streaming Gemini responses
-   [ ] Better document-management interface
-   [ ] Metadata filtering in Pinecone
-   [ ] Medical terminology-aware retrieval
-   [ ] Improved prompt engineering
-   [ ] Automated evaluation of RAG accuracy
-   [ ] Docker support
-   [ ] Production deployment configuration
-   [ ] Responsive and modern frontend
-   [ ] Citation-based answers

## License

No license is currently specified in this repository. Add a license file
if you intend to distribute the project under an open-source license.

## Author

**Saransh Vaidya**

GitHub: https://github.com/saranshvaidya0

## Repository

https://github.com/saranshvaidya0/Chat_Bot_PDF
