from flask import Blueprint, request, jsonify
import sys
import os
import json
from datetime import datetime

# Add the parent directory to the path so we can import the AI evaluation module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from AI_Evaluation_for_top_Performer_for_Organizer.ai_based_evaluation import (
    evaluate_project,
    print_project_details,
    save_results_to_file,
    print_summary,
    DEMO_PROJECTS,
    GITHUB_REPOS
)

# Create a Blueprint for the AI evaluation routes
evaluation_bp = Blueprint('evaluation', __name__)

@evaluation_bp.route('/evaluate', methods=['POST'])
def evaluate_hackathon_project():
    """
    Evaluate a hackathon project based on code quality, innovation, and documentation.
    
    Expected JSON payload:
    {
        "team_name": "Team Name",
        "description": "Project Description",
        "readme": "Project README content",
        "code_path": "Path to code or GitHub URL"
    }
    
    Returns:
    {
        "team_name": "Team Name",
        "code_score": 7.5,
        "innovation_score": 8.0,
        "doc_score": 7.0,
        "final_score": 7.5,
        "lint_output": "Pylint output...",
        "reasoning": {
            "innovation": "Innovation reasoning...",
            "documentation": "Documentation reasoning..."
        }
    }
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ["team_name", "description", "readme", "code_path"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Evaluate the project
        result = evaluate_project(data)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@evaluation_bp.route('/evaluate-batch', methods=['POST'])
def evaluate_multiple_projects():
    """
    Evaluate multiple hackathon projects in batch.
    
    Expected JSON payload:
    {
        "projects": [
            {
                "team_name": "Team Name 1",
                "description": "Project Description 1",
                "readme": "Project README content 1",
                "code_path": "Path to code or GitHub URL 1"
            },
            {
                "team_name": "Team Name 2",
                "description": "Project Description 2",
                "readme": "Project README content 2",
                "code_path": "Path to code or GitHub URL 2"
            },
            ...
        ]
    }
    
    Returns:
    {
        "results": [
            {
                "team_name": "Team Name 1",
                "code_score": 7.5,
                "innovation_score": 8.0,
                "doc_score": 7.0,
                "final_score": 7.5,
                "lint_output": "Pylint output...",
                "reasoning": {
                    "innovation": "Innovation reasoning...",
                    "documentation": "Documentation reasoning..."
                }
            },
            ...
        ],
        "summary": {
            "total_projects": 2,
            "average_score": 7.5,
            "highest_score": 8.0,
            "lowest_score": 7.0,
            "top_projects": [
                {
                    "team_name": "Team Name 1",
                    "final_score": 8.0
                },
                ...
            ]
        }
    }
    """
    try:
        data = request.json
        
        # Validate required fields
        if "projects" not in data or not isinstance(data["projects"], list):
            return jsonify({"error": "Missing or invalid 'projects' field"}), 400
        
        if not data["projects"]:
            return jsonify({"error": "No projects provided"}), 400
        
        # Evaluate each project
        results = []
        for project in data["projects"]:
            result = evaluate_project(project)
            results.append(result)
        
        # Generate summary
        sorted_results = sorted(results, key=lambda x: x["final_score"], reverse=True)
        total_projects = len(results)
        average_score = sum(p["final_score"] for p in results) / total_projects
        highest_score = sorted_results[0]["final_score"] if sorted_results else 0
        lowest_score = sorted_results[-1]["final_score"] if sorted_results else 0
        
        # Get top 5 projects
        top_projects = [
            {"team_name": p["team_name"], "final_score": p["final_score"]}
            for p in sorted_results[:5]
        ]
        
        summary = {
            "total_projects": total_projects,
            "average_score": round(average_score, 2),
            "highest_score": highest_score,
            "lowest_score": lowest_score,
            "top_projects": top_projects
        }
        
        # Save results to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"evaluation_results_{timestamp}.json"
        save_results_to_file(results, filename)
        
        return jsonify({
            "results": results,
            "summary": summary,
            "results_file": filename
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@evaluation_bp.route('/demo-projects', methods=['GET'])
def get_demo_projects():
    """
    Get a list of demo projects for testing.
    
    Returns:
    {
        "demo_projects": [
            {
                "team_name": "Team Alpha",
                "description": "Project Description",
                "readme": "Project README content",
                "code_path": "GitHub URL"
            },
            ...
        ]
    }
    """
    try:
        # Map demo projects to GitHub repositories
        demo_projects_with_repos = []
        for i, project in enumerate(DEMO_PROJECTS):
            project_copy = project.copy()
            if i < len(GITHUB_REPOS):
                project_copy["code_path"] = GITHUB_REPOS[i]
            demo_projects_with_repos.append(project_copy)
        
        return jsonify({"demo_projects": demo_projects_with_repos}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@evaluation_bp.route('/results/<filename>', methods=['GET'])
def get_evaluation_results(filename):
    """
    Get the results of a previous evaluation.
    
    Parameters:
    - filename: The name of the results file
    
    Returns:
    {
        "results": [
            {
                "team_name": "Team Name",
                "code_score": 7.5,
                "innovation_score": 8.0,
                "doc_score": 7.0,
                "final_score": 7.5,
                "lint_output": "Pylint output...",
                "reasoning": {
                    "innovation": "Innovation reasoning...",
                    "documentation": "Documentation reasoning..."
                }
            },
            ...
        ]
    }
    """
    try:
        # Check if the file exists
        if not os.path.exists(filename):
            return jsonify({"error": f"Results file '{filename}' not found"}), 404
        
        # Read the results file
        with open(filename, 'r') as f:
            results = json.load(f)
        
        return jsonify({"results": results}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500 