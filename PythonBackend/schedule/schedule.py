import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from openai import OpenAI
import sys
import re
import pytz

# Load Groq API Key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("Error: GROQ_API_KEY not found in environment variables.")
    print("Please add your Groq API key to the .env file.")
    sys.exit(1)

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

# Set default timezone to India (UTC+5:30)
DEFAULT_TIMEZONE = "UTC+5:30"

# Default hackathon details
DEFAULT_HACKATHON = {
    "name": "Future Tech Hackathon",
    "theme": "Future Technology",
    "total_days": 2,
    "team_size": 4,
    "difficulty": "hard",
    "start_date": "2025-05-23",
    "num_steps": 6,
    "start_time": "09:00",
    "end_time": "17:00",
    "min_hours": 2,
    "max_hours": 8
}

def generate_ai_schedule(theme, total_days, team_size, difficulty, num_steps, start_time, end_time, min_hours, max_hours):
    # Define the compulsory phases
    compulsory_phases = [
        "Registration & Onboarding",
        "Problem Statement Release & Team Formation",
        "Development & Mentorship",
        "Submission & Judging"
    ]
    
    # Calculate how many additional phases to include
    additional_phases = max(0, num_steps - len(compulsory_phases))
    
    # Create a clear prompt with proper formatting
    prompt = f"""You are an expert hackathon scheduling assistant with years of experience organizing successful events.

Hackathon Details:
- Theme: {theme}
- Total Duration: {total_days} days
- Team Size: {team_size} members
- Difficulty Level: {difficulty}
- Daily Time: From {start_time} to {end_time}
- Phase Duration Constraints: Each phase should be between {min_hours} and {max_hours} hours
- Total Phases Required: {num_steps} phases
- Timezone: {DEFAULT_TIMEZONE} (India)

Compulsory Phases ({len(compulsory_phases)} phases) – You MUST include these in the schedule:
1. {compulsory_phases[0]}
2. {compulsory_phases[1]}
3. {compulsory_phases[2]}
4. {compulsory_phases[3]}

{f'Additionally, include {additional_phases} more phases that would be beneficial for this hackathon.' if additional_phases > 0 else ''}

Instructions:
Break the entire hackathon into exactly {num_steps} sequential phases, evenly distributed across {total_days} days, while respecting daily time limits ({start_time} to {end_time}) and the minimum and maximum time per phase ({min_hours} to {max_hours} hours).

Ensure that all compulsory phases are included in the appropriate positions (e.g., Registration should be the first phase, Submission should be the last).

Return ONLY a valid JSON array with the following structure, with no additional text:
[
  {{
    "title": "Phase Name",
    "description": "Detailed description of activities",
    "startTime": "YYYY-MM-DDTHH:MM:SS.000Z",
    "endTime": "YYYY-MM-DDTHH:MM:SS.000Z",
    "type": "phase_type",
    "location": {{
      "type": "online",
      "onlinePlatform": "Platform Name"
    }},
    "isMandatory": true/false,
    "speakers": [
      {{
        "name": "Speaker Name",
        "designation": "Speaker Title",
        "organization": "Organization Name"
      }}
    ],
    "resources": [
      {{
        "type": "resource_type",
        "title": "Resource Title",
        "url": "https://example.com/resource"
      }}
    ]
  }},
  ...
]

Important:
- The sum of all days must be exactly {total_days}
- Each phase must have at least 1 full day (no partial days)
- Each phase should have between {min_hours} and {max_hours} hours per day
- Include a detailed description for each phase
- Include specific timings for each phase
- Ensure the JSON is valid and properly formatted
- Do not include any text outside the JSON array
- For each phase, include appropriate type, location, and whether it's mandatory
- For phases that might have speakers (like workshops), include speaker information
- For phases that might have resources, include resource information
"""

    try:
        chat_completion = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=5000
        )

        response = chat_completion.choices[0].message.content
        
        # Extract JSON from the response (in case the model includes additional text)
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            # Validate that it's proper JSON
            try:
                json.loads(json_str)
                return json_str
            except json.JSONDecodeError:
                print("Error: Invalid JSON in response. Attempting to fix...")
                # Try to fix common JSON issues
                fixed_json = fix_json(json_str)
                return fixed_json
        return response
    except Exception as e:
        print(f"Error generating schedule: {str(e)}")
        return None


def fix_json(json_str):
    """Attempt to fix common JSON issues in the response"""
    # Remove any text before the first [
    json_str = re.sub(r'^[^[]*', '', json_str)
    # Remove any text after the last ]
    json_str = re.sub(r'[^]]*$', '', json_str)
    # Fix unescaped quotes
    json_str = re.sub(r'(?<!\\)"', '\\"', json_str)
    # Fix missing quotes around keys
    json_str = re.sub(r'([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', json_str)
    # Fix trailing commas
    json_str = re.sub(r',\s*([}\]])', r'\1', json_str)
    
    try:
        # Try to parse the fixed JSON
        return json.dumps(json.loads(json_str))
    except:
        # If still invalid, return a minimal valid JSON
        return '[]'


def build_schedule_from_ai(start_date, schedule_json, start_time, end_time, min_hours, max_hours):
    try:
        # Try to parse the JSON
        events = json.loads(schedule_json)
        
        # Validate the structure
        if not isinstance(events, list):
            raise ValueError("Response is not a JSON array")
            
        # Check if each event has the required fields
        for event in events:
            if not all(key in event for key in ["title", "startTime", "endTime"]):
                raise ValueError("Each event must have 'title', 'startTime', and 'endTime' fields")
        
        # Create the final schedule structure
        schedule = {
            "timezone": DEFAULT_TIMEZONE,
            "events": events
        }
            
        return schedule
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {str(e)}")
        print("Raw response:")
        print(schedule_json)
        raise Exception("Invalid JSON response from AI. Please try again.")
    except Exception as e:
        print(f"Error building schedule: {str(e)}")
        raise


def validate_input(theme, total_days, team_size, difficulty, start_date, num_steps, start_time, end_time, min_hours, max_hours):
    if not theme or len(theme) < 3:
        return False, "Theme must be at least 3 characters long"
    
    if total_days < 1 or total_days > 30:
        return False, "Duration must be between 1 and 30 days"
    
    if team_size < 1 or team_size > 10:
        return False, "Team size must be between 1 and 10 members"
    
    if difficulty.lower() not in ["easy", "medium", "hard"]:
        return False, "Difficulty must be Easy, Medium, or Hard"
    
    if start_date < datetime.now():
        return False, "Start date cannot be in the past"
    
    if num_steps < 4:
        return False, "Number of steps must be at least 4 (to include all compulsory phases)"
    
    if num_steps > 10:
        return False, "Number of steps cannot exceed 10"
    
    # Validate time format (HH:MM)
    time_pattern = re.compile(r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
    if not time_pattern.match(start_time) or not time_pattern.match(end_time):
        return False, "Time must be in HH:MM format (e.g., 09:00)"
    
    # Check if end time is after start time
    start_hour, start_minute = map(int, start_time.split(':'))
    end_hour, end_minute = map(int, end_time.split(':'))
    
    if (end_hour < start_hour) or (end_hour == start_hour and end_minute <= start_minute):
        return False, "End time must be after start time"
    
    # Validate hours range
    if min_hours < 1 or min_hours > 24:
        return False, "Minimum hours must be between 1 and 24"
    
    if max_hours < min_hours or max_hours > 24:
        return False, "Maximum hours must be between minimum hours and 24"
    
    return True, ""


def get_input(use_defaults=False):
    if use_defaults:
        print("\n" + "="*50)
        print("HACKATHON SCHEDULE GENERATOR (USING DEFAULT VALUES)".center(50))
        print("="*50 + "\n")
        
        theme = DEFAULT_HACKATHON["theme"]
        total_days = DEFAULT_HACKATHON["total_days"]
        team_size = DEFAULT_HACKATHON["team_size"]
        difficulty = DEFAULT_HACKATHON["difficulty"]
        start_date_str = DEFAULT_HACKATHON["start_date"]
        num_steps = DEFAULT_HACKATHON["num_steps"]
        start_time = DEFAULT_HACKATHON["start_time"]
        end_time = DEFAULT_HACKATHON["end_time"]
        min_hours = DEFAULT_HACKATHON["min_hours"]
        max_hours = DEFAULT_HACKATHON["max_hours"]
        
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        except ValueError:
            print("Error: Start date must be in YYYY-MM-DD format.")
            sys.exit(1)
            
        return theme, total_days, team_size, difficulty, start_date, num_steps, start_time, end_time, min_hours, max_hours
    
    print("\n" + "="*50)
    print("HACKATHON SCHEDULE GENERATOR".center(50))
    print("="*50 + "\n")
    
    theme = input("Hackathon Theme: ").strip()
    
    while True:
        try:
            total_days = int(input("Duration (in days, 1-30): ").strip())
            team_size = int(input("Team Size (1-10): ").strip())
            difficulty = input("Difficulty Level (Easy / Medium / Hard): ").strip()
            start_date_str = input("Start Date (YYYY-MM-DD): ").strip()
            num_steps = int(input("Number of steps in schedule (4-10): ").strip())
            start_time = input("Daily Start Time (HH:MM, e.g., 09:00): ").strip()
            end_time = input("Daily End Time (HH:MM, e.g., 17:00): ").strip()
            min_hours = float(input("Minimum hours per phase (1-24): ").strip())
            max_hours = float(input("Maximum hours per phase (1-24): ").strip())

            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            except ValueError:
                print("Error: Start date must be in YYYY-MM-DD format.")
                continue
                
            # Validate inputs
            is_valid, error_message = validate_input(theme, total_days, team_size, difficulty, start_date, num_steps, start_time, end_time, min_hours, max_hours)
            if not is_valid:
                print(f"Error: {error_message}")
                continue
                
            break
        except ValueError:
            print("Error: Please enter valid numbers for duration, team size, number of steps, and hours.")
    
    return theme, total_days, team_size, difficulty, start_date, num_steps, start_time, end_time, min_hours, max_hours


def show_schedule(name, schedule):
    print("\n" + "="*70)
    print(f"📅 AI-POWERED HACKATHON SCHEDULE FOR '{name.upper()}'".center(70))
    print("="*70 + "\n")
    
    print(f"Timezone: {schedule['timezone']} (India)")
    print(f"Total Events: {len(schedule['events'])}")
    print()
    
    for i, event in enumerate(schedule['events'], 1):
        print(f"🔹 Event {i}: {event['title']}")
        print(f"   📅 {event['startTime']} ➜ {event['endTime']}")
        print(f"   📝 {event['description']}")
        print(f"   🏷️ Type: {event['type']}")
        print(f"   📍 Location: {event['location']['type']} - {event['location'].get('onlinePlatform', 'N/A')}")
        print(f"   ⚠️ Mandatory: {'Yes' if event.get('isMandatory', False) else 'No'}")
        
        if 'speakers' in event and event['speakers']:
            print(f"   👥 Speakers:")
            for speaker in event['speakers']:
                print(f"      - {speaker['name']} ({speaker['designation']} at {speaker['organization']})")
        
        if 'resources' in event and event['resources']:
            print(f"   📚 Resources:")
            for resource in event['resources']:
                print(f"      - {resource['title']} ({resource['type']})")
        
        print()
    
    print("="*70)
    
    # Print the raw JSON for reference
    print("\nRaw JSON Output:")
    print(json.dumps(schedule, indent=2))


def save_schedule_to_file(name, schedule):
    filename = f"{name.lower().replace(' ', '_')}_schedule.json"
    try:
        with open(filename, 'w') as f:
            json.dump(schedule, f, indent=2)
        print(f"\n✅ Schedule saved to {filename}")
        return True
    except Exception as e:
        print(f"\n❌ Error saving schedule: {str(e)}")
        return False


if __name__ == "__main__":
    try:
        # Ask if user wants to use default values
        use_defaults = input("Use default hackathon values? (y/n): ").strip().lower() == 'y'
        
        if use_defaults:
            name = DEFAULT_HACKATHON["name"]
        else:
            name = input("Hackathon Name: ").strip()
            
        theme, total_days, team_size, difficulty, start_date, num_steps, start_time, end_time, min_hours, max_hours = get_input(use_defaults)

        print("\n🔄 Contacting Groq + Gemma LLM to generate optimized schedule...\n")
        ai_response = generate_ai_schedule(theme, total_days, team_size, difficulty, num_steps, start_time, end_time, min_hours, max_hours)
        
        if not ai_response:
            print("❌ Failed to generate schedule. Please try again.")
            sys.exit(1)

        try:
            schedule = build_schedule_from_ai(start_date, ai_response, start_time, end_time, min_hours, max_hours)
            show_schedule(name, schedule)
            
            # Ask if user wants to save the schedule
            save_option = input("\nDo you want to save this schedule to a file? (y/n): ").strip().lower()
            if save_option == 'y':
                save_schedule_to_file(name, schedule)
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            print("\nRaw AI Output:")
            print(ai_response)
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled by user.")
    except Exception as e:
        print(f"\n❌ An unexpected error occurred: {str(e)}")
