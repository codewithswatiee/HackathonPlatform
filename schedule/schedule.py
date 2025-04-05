import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from openai import OpenAI

# Load Groq API Key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

def generate_ai_schedule(theme, total_days, team_size, difficulty):
    prompt = (
        f"You are a hackathon scheduling assistant.\n"
        f"Theme: {theme}\n"
        f"Duration: {total_days} days\n"
        f"Team Size: {team_size}\n"
        f"Difficulty: {difficulty}\n"
        f"Divide the hackathon into exactly 4 phases:\n"
        f"1. Registration\n2. Release Problem Statement\n3. Ideation\n4. Submission\n\n"
        f"Return a JSON array like this:\n"
        f"[{{\"phase\": \"Registration\", \"days\": 2}}, ...]\n"
        f"The sum of all days should be {total_days}."
    )

    chat_completion = client.chat.completions.create(
        model="deepseek-llm-67b-chat",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=500
    )

    return chat_completion.choices[0].message.content


def build_schedule_from_ai(start_date, schedule_json):
    try:
        phases = json.loads(schedule_json)
    except json.JSONDecodeError:
        raise Exception("Invalid JSON response from AI.")

    current = start_date
    result = []
    for item in phases:
        phase_start = current
        phase_end = current + timedelta(days=item['days'] - 1)
        result.append({
            "phase": item["phase"],
            "start": phase_start.strftime("%Y-%m-%d"),
            "end": phase_end.strftime("%Y-%m-%d")
        })
        current = phase_end + timedelta(days=1)
    return result


def get_input():
    theme = input("Hackathon Theme: ").strip()
    total_days = int(input("Duration (in days): ").strip())
    team_size = int(input("Team Size: ").strip())
    difficulty = input("Difficulty Level (Easy / Medium / Hard): ").strip()
    start_date_str = input("Start Date (YYYY-MM-DD): ").strip()

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    except ValueError:
        raise ValueError("Start date must be in YYYY-MM-DD format.")

    return theme, total_days, team_size, difficulty, start_date


def show_schedule(name, schedule):
    print(f"\n📅 AI-Powered Hackathon Schedule for '{name}':\n")
    for item in schedule:
        print(f"🔹 {item['phase']}: {item['start']} ➜ {item['end']}")


if __name__ == "__main__":
    name = input("Hackathon Name: ").strip()
    theme, total_days, team_size, difficulty, start_date = get_input()

    print("\nContacting Groq + DeepSeek LLM to generate optimized schedule...\n")
    ai_response = generate_ai_schedule(theme, total_days, team_size, difficulty)

    try:
        schedule = build_schedule_from_ai(start_date, ai_response)
        show_schedule(name, schedule)
    except Exception as e:
        print(f"Error: {e}")
        print("Raw AI Output:")
        print(ai_response)
