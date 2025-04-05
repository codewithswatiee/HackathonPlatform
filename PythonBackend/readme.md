# Hackathon Chatbot

A chatbot implementation for the hackathon using Groq API and LangChain.

## Features

- Uses Groq API with the deepseek-r1-distill-qwen-32b model
- FAISS vector store for efficient retrieval
- Conversational memory to maintain context
- RESTful API endpoints for integration

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Flask server:
   ```
   python app.py
   ```

## API Endpoints

- `POST /api/chat`: Send a message to the chatbot
  - Request body: `{"message": "Your question here", "session_id": "optional_session_id"}`
  - Response: `{"response": "Bot response", "session_id": "session_id"}`

- `GET /api/chat/history/<session_id>`: Get chat history for a session
  - Response: `{"history": [{"user": "user message", "bot": "bot response"}, ...]}`

- `POST /api/chat/reset/<session_id>`: Reset chat history for a session
  - Response: `{"message": "Chat history reset successfully"}`

## Implementation Details

- The chatbot uses LangChain's ConversationalRetrievalChain for context-aware responses
- FAISS vector store is used for efficient document retrieval
- Chat histories are maintained per session
- The Groq API is used for generating responses with the deepseek-r1-distill-qwen-32b model
