from huggingface_hub import InferenceClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

client = InferenceClient(
    model="mistralai/Mixtral-8x7B-Instruct-v0.1",
    token=HF_API_TOKEN
)

mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["hackathon_db"]
profile_collection = db["hackathon_profiles"]

profile = profile_collection.find_one()
if not profile:
    raise ValueError("No hackathon profiles found in MongoDB.")

domains = profile.get("domains", [])
theme = profile.get("theme", "Technology for Good")

if not domains:
    raise ValueError("Domains list is empty in the user profile.")

def generate_ideas(domains, theme):
    prompt = (
        f"You are an expert hackathon mentor. Based on the theme '{theme}', suggest 5 unique and impactful hackathon problem statements "
        f"that span across the following domains: {', '.join(domains)}. Each idea should be:\n"
        "- Clearly titled\n"
        "- 3–4 lines of description\n"
        "- Realistic yet innovative\n\n"
        "Number the ideas from 1 to 5."
    )

    response = client.text_generation(
        prompt,
        max_new_tokens=800,
        temperature=0.7,
        do_sample=True,
    )
    return response.strip()

def continue_conversation():
    print("\n💬 You can now chat with the bot! (type 'exit' to quit)\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            print("Bot: Thanks for chatting! 🚀")
            break

        response = client.text_generation(
            prompt=f"Continue this conversation like an expert hackathon mentor. User said: '{user_input}'",
            max_new_tokens=300,
            temperature=0.7,
            do_sample=True
        )
        print(f"Bot: {response.strip()}")

if __name__ == "__main__":
    print("\n🧠 Generating Hackathon Problem Statements:\n")
    ideas = generate_ideas(domains, theme)
    print(ideas)

    continue_conversation()