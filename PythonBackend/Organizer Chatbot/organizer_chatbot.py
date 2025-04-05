from huggingface_hub import InferenceClient
import os
import json
from datetime import datetime
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

# Validate API token
if not HF_API_TOKEN:
    print("Error: HF_API_TOKEN not found in environment variables.")
    print("Please add your Hugging Face API token to the .env file.")
    sys.exit(1)

# Initialize the Hugging Face client
try:
    client = InferenceClient(
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        token=HF_API_TOKEN
    )
    print("✅ Successfully connected to Hugging Face API")
except Exception as e:
    print(f"❌ Error connecting to Hugging Face API: {str(e)}")
    sys.exit(1)

# Demo data instead of MongoDB
DEMO_PROFILE = {
    "domains": ["AI/ML", "Web3", "Healthcare", "Education", "Sustainability"],
    "theme": "Technology for Good",
    "hackathon_name": "Future Tech Hackathon",
    "team_size": 4,
    "difficulty": "hard",
    "start_date": "2025-05-23",
    "duration_days": 2,
    "prize_pool": "$10,000",
    "registration_deadline": "2025-05-20",
    "max_teams": 50,
    "judging_criteria": ["Innovation", "Technical Complexity", "Social Impact", "Presentation"]
}

# In-memory storage for chat history
chat_history = []

def generate_ideas(domains, theme, num_ideas=5):
    """
    Generate hackathon ideas based on the theme and domains.
    
    Args:
        domains (list): List of domains for the hackathon
        theme (str): Theme of the hackathon
        num_ideas (int): Number of ideas to generate (default: 5)
        
    Returns:
        str: Generated ideas
    """
    try:
        prompt = (
            f"You are an expert hackathon mentor. Based on the theme '{theme}', suggest {num_ideas} unique and impactful hackathon problem statements "
            f"that span across the following domains: {', '.join(domains)}. Each idea should be:\n"
            "- Clearly titled\n"
            "- 3–4 lines of description\n"
            "- Realistic yet innovative\n"
            "- Include potential technologies to be used\n\n"
            "Number the ideas from 1 to {num_ideas}."
        )

        response = client.text_generation(
            prompt,
            max_new_tokens=800,
            temperature=0.7,
            do_sample=True,
        )
        return response.strip()
    except Exception as e:
        print(f"❌ Error generating ideas: {str(e)}")
        return f"Error generating ideas: {str(e)}"

def chat_with_bot(user_message, include_history=True):
    """
    Continue a conversation with the organizer chatbot.
    
    Args:
        user_message (str): User's message
        include_history (bool): Whether to include chat history in the prompt
        
    Returns:
        str: Bot's response
    """
    try:
        # Add user message to chat history
        chat_history.append({"role": "user", "content": user_message, "timestamp": datetime.now().isoformat()})
        
        # Create context from chat history if requested
        context = ""
        if include_history and len(chat_history) > 1:
            # Include last 3 messages for context
            recent_history = chat_history[-4:-1]  # Last 3 messages before current
            context = "Previous conversation:\n"
            for msg in recent_history:
                role = "User" if msg["role"] == "user" else "Assistant"
                context += f"{role}: {msg['content']}\n"
            context += "\n"
        
        # Create the prompt
        prompt = f"{context}Continue this conversation like an expert hackathon mentor. User said: '{user_message}'"
        
        # Generate response
        response = client.text_generation(
            prompt=prompt,
            max_new_tokens=300,
            temperature=0.7,
            do_sample=True
        )
        
        # Add bot response to chat history
        bot_response = response.strip()
        chat_history.append({"role": "assistant", "content": bot_response, "timestamp": datetime.now().isoformat()})
        
        return bot_response
    except Exception as e:
        print(f"❌ Error in chat: {str(e)}")
        return f"I'm sorry, I encountered an error: {str(e)}"

def update_profile(profile_data):
    """
    Update the hackathon profile with new data.
    In a real implementation, this would update MongoDB.
    For demo purposes, we'll just update the in-memory profile.
    
    Args:
        profile_data (dict): New profile data
        
    Returns:
        dict: Updated profile and status
    """
    try:
        print("\n📝 Updating hackathon profile with the following data:")
        for key, value in profile_data.items():
            print(f"  - {key}: {value}")
            # Update the demo profile
            DEMO_PROFILE[key] = value
        
        print("✅ Profile updated successfully!")
        return {
            "status": "success", 
            "message": "Profile updated successfully",
            "profile": DEMO_PROFILE
        }
    except Exception as e:
        print(f"❌ Error updating profile: {str(e)}")
        return {
            "status": "error",
            "message": f"Error updating profile: {str(e)}"
        }

def get_profile():
    """
    Get the current hackathon profile.
    
    Returns:
        dict: Current profile
    """
    return DEMO_PROFILE

def save_chat_history(filename="chat_history.json"):
    """
    Save the chat history to a file.
    
    Args:
        filename (str): Name of the file to save to
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with open(filename, 'w') as f:
            json.dump(chat_history, f, indent=2)
        print(f"✅ Chat history saved to {filename}")
        return True
    except Exception as e:
        print(f"❌ Error saving chat history: {str(e)}")
        return False

def load_chat_history(filename="chat_history.json"):
    """
    Load chat history from a file.
    
    Args:
        filename (str): Name of the file to load from
        
    Returns:
        bool: True if successful, False otherwise
    """
    global chat_history
    try:
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                chat_history = json.load(f)
            print(f"✅ Chat history loaded from {filename}")
            return True
        else:
            print(f"❌ Chat history file {filename} not found")
            return False
    except Exception as e:
        print(f"❌ Error loading chat history: {str(e)}")
        return False

def clear_chat_history():
    """
    Clear the chat history.
    
    Returns:
        bool: True if successful, False otherwise
    """
    global chat_history
    try:
        chat_history = []
        print("✅ Chat history cleared")
        return True
    except Exception as e:
        print(f"❌ Error clearing chat history: {str(e)}")
        return False

def get_chat_history():
    """
    Get the current chat history.
    
    Returns:
        list: Chat history
    """
    return chat_history

if __name__ == "__main__":
    print("\n" + "="*50)
    print("HACKATHON ORGANIZER CHATBOT".center(50))
    print("="*50 + "\n")
    
    # Use demo data
    domains = DEMO_PROFILE.get("domains", [])
    theme = DEMO_PROFILE.get("theme", "Technology for Good")
    hackathon_name = DEMO_PROFILE.get("hackathon_name", "Future Tech Hackathon")
    
    if not domains:
        raise ValueError("Domains list is empty in the demo profile.")
    
    # Display current profile
    print("Current Hackathon Profile:")
    print(f"Name: {hackathon_name}")
    print(f"Theme: {theme}")
    print(f"Domains: {', '.join(domains)}")
    print(f"Team Size: {DEMO_PROFILE.get('team_size')}")
    print(f"Difficulty: {DEMO_PROFILE.get('difficulty')}")
    print(f"Duration: {DEMO_PROFILE.get('duration_days')} days")
    print(f"Start Date: {DEMO_PROFILE.get('start_date')}")
    print(f"Prize Pool: {DEMO_PROFILE.get('prize_pool')}")
    print(f"Registration Deadline: {DEMO_PROFILE.get('registration_deadline')}")
    print(f"Max Teams: {DEMO_PROFILE.get('max_teams')}")
    print(f"Judging Criteria: {', '.join(DEMO_PROFILE.get('judging_criteria', []))}")
    
    # Generate ideas
    print("\n🧠 Generating Hackathon Problem Statements:\n")
    ideas = generate_ideas(domains, theme)
    print(ideas)
    
    # Demo profile update
    print("\n🔄 Updating hackathon profile...")
    update_profile({
        "theme": "AI for Social Impact",
        "team_size": 5,
        "difficulty": "medium"
    })
    
    # Interactive chat
    print("\n💬 You can now chat with the bot! (type 'exit' to quit, 'save' to save chat history, 'load' to load chat history, 'clear' to clear chat history)")
    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() in ['exit', 'quit']:
            print("Bot: Thanks for chatting! 🚀")
            break
        elif user_input.lower() == 'save':
            save_chat_history()
            print("Bot: Chat history saved!")
            continue
        elif user_input.lower() == 'load':
            load_chat_history()
            print("Bot: Chat history loaded!")
            continue
        elif user_input.lower() == 'clear':
            clear_chat_history()
            print("Bot: Chat history cleared!")
            continue
        
        response = chat_with_bot(user_input)
        print(f"Bot: {response}")