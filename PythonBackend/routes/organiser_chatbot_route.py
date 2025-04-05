from flask import Blueprint, request, jsonify
import sys
import os

# Add the parent directory to the path so we can import the organizer chatbot module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Organizer_Chatbot.organizer_chatbot import (
    generate_ideas, 
    chat_with_bot, 
    update_profile, 
    get_profile,
    save_chat_history,
    load_chat_history,
    clear_chat_history,
    get_chat_history,
    DEMO_PROFILE
)

# Create a Blueprint for the organizer chatbot routes
organizer_bp = Blueprint('organizer', __name__)

@organizer_bp.route('/generate-ideas', methods=['POST'])
def generate_hackathon_ideas():
    """
    Generate hackathon ideas based on the theme and domains.
    
    Expected JSON payload:
    {
        "theme": "Hackathon Theme",
        "domains": ["Domain1", "Domain2", ...],
        "num_ideas": 5
    }
    
    Returns:
        JSON response with the generated ideas
    """
    try:
        # Get the request data
        data = request.get_json()
        
        # Use provided data or fall back to demo data
        theme = data.get("theme", DEMO_PROFILE["theme"])
        domains = data.get("domains", DEMO_PROFILE["domains"])
        num_ideas = data.get("num_ideas", 5)
        
        # Generate ideas
        ideas = generate_ideas(domains, theme, num_ideas)
        
        return jsonify({
            "status": "success",
            "ideas": ideas
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@organizer_bp.route('/chat', methods=['POST'])
def chat():
    """
    Continue a conversation with the organizer chatbot.
    
    Expected JSON payload:
    {
        "message": "User message",
        "include_history": true
    }
    
    Returns:
        JSON response with the bot's reply
    """
    try:
        # Get the request data
        data = request.get_json()
        
        if "message" not in data:
            return jsonify({"error": "Missing 'message' field"}), 400
        
        user_message = data["message"]
        include_history = data.get("include_history", True)
        
        # Generate response
        response = chat_with_bot(user_message, include_history)
        
        return jsonify({
            "status": "success",
            "response": response,
            "chat_history": get_chat_history()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@organizer_bp.route('/update-profile', methods=['POST'])
def update_hackathon_profile():
    """
    Update the hackathon profile.
    
    Expected JSON payload:
    {
        "theme": "New Theme",
        "team_size": 4,
        "difficulty": "hard",
        ...
    }
    
    Returns:
        JSON response with the update status
    """
    try:
        # Get the request data
        data = request.get_json()
        
        # Update profile
        result = update_profile(data)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@organizer_bp.route('/get-profile', methods=['GET'])
def get_hackathon_profile():
    """
    Get the current hackathon profile.
    
    Returns:
        JSON response with the current profile
    """
    try:
        profile = get_profile()
        return jsonify({
            "status": "success",
            "profile": profile
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@organizer_bp.route('/chat-history', methods=['GET', 'POST', 'DELETE'])
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
            filename = data.get("filename", "chat_history.json")
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