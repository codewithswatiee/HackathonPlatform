from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
import os

# Add the parent directory to the path so we can import the schedule module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from schedule.schedule import generate_ai_schedule, build_schedule_from_ai, DEFAULT_TIMEZONE

# Create a Blueprint for the schedule routes
schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/generate', methods=['POST'])
def generate_schedule():
    """
    Generate a hackathon schedule based on the provided details.
    
    Expected JSON payload:
    {
        "name": "Hackathon Name",
        "theme": "Hackathon Theme",
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
    
    Returns:
        JSON response with the generated schedule
    """
    try:
        # Get the request data
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            "name", "theme", "total_days", "team_size", "difficulty", 
            "start_date", "num_steps", "start_time", "end_time", 
            "min_hours", "max_hours"
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Parse the start date
        try:
            start_date = datetime.strptime(data["start_date"], "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD"}), 400
        
        # Generate the schedule
        ai_response = generate_ai_schedule(
            data["theme"],
            data["total_days"],
            data["team_size"],
            data["difficulty"],
            data["num_steps"],
            data["start_time"],
            data["end_time"],
            data["min_hours"],
            data["max_hours"]
        )
        
        if not ai_response:
            return jsonify({"error": "Failed to generate schedule"}), 500
        
        # Build the schedule from the AI response
        schedule = build_schedule_from_ai(
            start_date,
            ai_response,
            data["start_time"],
            data["end_time"],
            data["min_hours"],
            data["max_hours"]
        )
        
        # Add the hackathon name to the response
        schedule["name"] = data["name"]
        
        return jsonify(schedule), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500 