from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
import logging
import json
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2",
    model_kwargs={'device': 'cpu'}
)

# Initialize FAISS vector store
FAISS_INDEX_PATH = "faiss_index"
CHAT_HISTORY_DIR = "chat_history"

# Ensure chat history directory exists
os.makedirs(CHAT_HISTORY_DIR, exist_ok=True)

def save_chat_history(session_id, chat_history):
    """Save chat history to a JSON file"""
    try:
        file_path = os.path.join(CHAT_HISTORY_DIR, f"{session_id}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'history': chat_history
            }, f, indent=2)
        logger.info(f"Chat history saved for session {session_id}")
    except Exception as e:
        logger.error(f"Error saving chat history: {e}")

def load_chat_history(session_id):
    """Load chat history from a JSON file"""
    try:
        file_path = os.path.join(CHAT_HISTORY_DIR, f"{session_id}.json")
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"Chat history loaded for session {session_id}")
                return data.get('history', [])
        return []
    except Exception as e:
        logger.error(f"Error loading chat history: {e}")
        return []

def clear_chat_history(session_id):
    """Clear chat history for a session"""
    try:
        file_path = os.path.join(CHAT_HISTORY_DIR, f"{session_id}.json")
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Chat history cleared for session {session_id}")
        return True
    except Exception as e:
        logger.error(f"Error clearing chat history: {e}")
        return False

def initialize_vector_store():
    if os.path.exists(FAISS_INDEX_PATH):
        try:
            vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings)
            logger.info("Loaded existing FAISS index.")
        except Exception as e:
            logger.error(f"Error loading FAISS index: {e}")
            vector_store = create_new_vector_store()
    else:
        vector_store = create_new_vector_store()
    return vector_store

def create_new_vector_store():
    logger.info("Creating new FAISS index...")
    # Sample texts - replace with your actual hackathon data
    texts = [
        "This hackathon is focused on AI and machine learning applications.",
        "The registration deadline is March 31st, 2024.",
        "Teams can have up to 4 members.",
        "Projects will be judged on innovation, technical complexity, and presentation.",
    ]
    
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_texts = text_splitter.create_documents(texts)
    
    vector_store = FAISS.from_documents(split_texts, embeddings)
    vector_store.save_local(FAISS_INDEX_PATH)
    logger.info("Created and saved new FAISS index.")
    return vector_store

def get_bot_response(query, session_id="default", chat_history=None):
    try:
        # Get API key from environment variable
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")

        # Load chat history if not provided
        if chat_history is None:
            chat_history = load_chat_history(session_id)

        vector_store = initialize_vector_store()
        
        # Initialize the Groq model with more direct response settings
        llm = ChatGroq(
            api_key=groq_api_key,
            model_name="deepseek-r1-distill-qwen-32b",
            temperature=0.3,  # Lower temperature for more focused responses
            max_tokens=512,   # Shorter responses
        )
        
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vector_store.as_retriever(),
            return_source_documents=True,
            verbose=False  # Disable verbose output
        )
        
        # Add system message to encourage direct responses
        system_message = "You are a helpful hackathon assistant. Provide direct, concise answers without explaining your thought process."
        result = qa_chain({
            "question": f"{system_message}\n\nUser question: {query}",
            "chat_history": chat_history
        })
        
        # Clean up the response to remove any thinking-related text
        response = result["answer"]
        response = response.replace("Let me", "").replace("I'll", "").replace("I will", "")
        response = response.replace("Based on", "").replace("According to", "")
        response = response.strip()
        
        # Update chat history
        chat_history.append((query, response))
        save_chat_history(session_id, chat_history)
        
        return response
    except ValueError as ve:
        logger.error(f"Configuration error: {ve}")
        return "Configuration error. Please check the API keys."
    except Exception as e:
        logger.error(f"Error in get_bot_response: {e}")
        return "An error occurred. Please try again."

if __name__ == "__main__":
    print("Chatbot initialized. Type 'quit' to exit.")
    session_id = "test_session"
    chat_history = load_chat_history(session_id)
    
    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() == 'quit':
            break
            
        response = get_bot_response(user_input, session_id, chat_history)
        print(f"\nBot: {response}")
        chat_history.append((user_input, response))