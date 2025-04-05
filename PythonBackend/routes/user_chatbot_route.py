from flask import Blueprint, request, jsonify
import sys
import os

# Add the parent directory to the path so we can import the user chatbot module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from User_Chatbot.user_chatbot import (
    chat_with_bot,
    get_chat_history,
    save_chat_history,
    clear_chat_history
)

# Create a Blueprint for the user chatbot routes
user_bp = Blueprint('user', __name__)

@user_bp.route('/ask', methods=['POST'])
def ask_question():
    """
    Ask a question to the user chatbot.
    
    Expected JSON payload:
    {
        "question": "User question",
        "include_history": true
    }
    
    Returns:
        JSON response with the bot's answer
    """
    try:
        # Get the request data
        data = request.get_json()
        
        if "question" not in data:
            return jsonify({"error": "Missing 'question' field"}), 400
        
        question = data["question"]
        include_history = data.get("include_history", True)
        
        # Generate response
        response = chat_with_bot(question, include_history)
        
        return jsonify({
            "status": "success",
            "question": question,
            "answer": response,
            "chat_history": get_chat_history()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/chat-history', methods=['GET', 'POST', 'DELETE'])
def manage_chat_history():
    """
    Manage chat history.
    
    GET: Get the current chat history
    POST: Save chat history to a file
    DELETE: Clear chat history
    
    Expected JSON payload for POST:
    {
        "filename": "chat_history.json"
    }
    
    Returns:
        JSON response with the operation status
    """
    try:
        if request.method == 'GET':
            history = get_chat_history()
            return jsonify({
                "status": "success",
                "chat_history": history
            }), 200
        elif request.method == 'POST':
            data = request.get_json()
            filename = data.get("filename", "user_chat_history.json")
            success = save_chat_history(filename)
            if success:
                return jsonify({
                    "status": "success",
                    "message": f"Chat history saved to {filename}"
                }), 200
            else:
                return jsonify({
                    "status": "error",
                    "message": "Failed to save chat history"
                }), 500
        elif request.method == 'DELETE':
            success = clear_chat_history()
            if success:
                return jsonify({
                    "status": "success",
                    "message": "Chat history cleared"
                }), 200
            else:
                return jsonify({
                    "status": "error",
                    "message": "Failed to clear chat history"
                }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500 