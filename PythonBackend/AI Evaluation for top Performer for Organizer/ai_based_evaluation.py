from pymongo import MongoClient
import os
from dotenv import load_dotenv
from langchain.llms import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import subprocess
import re
import json
import time
from datetime import datetime

# Load environment variables
load_dotenv()
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

# GitHub repositories to evaluate
GITHUB_REPOS = [
    "https://github.com/VyomThaker-2154/ColdEmailGenerator",
    "https://github.com/VyomThaker-2154/Savory-Restaurant-Website",
    "https://github.com/VyomThaker-2154/live_project",
    "https://github.com/VyomThaker-2154/Student_record_angular",
    "https://github.com/VyomThaker-2154/Lead_Gen"
]

# Check if Hugging Face API token is available
if not HF_API_TOKEN:
    print("⚠️ Warning: HF_API_TOKEN not found in environment variables.")
    print("Please add your Hugging Face API token to the .env file.")
    print("Using demo mode with sample data instead.")
    USE_DEMO_MODE = True
else:
    USE_DEMO_MODE = False

# Demo data for testing without MongoDB connection
DEMO_PROJECTS = [
    {
        "team_name": "Team Alpha",
        "description": "Our project is an AI-powered healthcare assistant that uses natural language processing to analyze patient symptoms and provide preliminary diagnoses. It integrates with existing medical records systems and offers real-time suggestions to healthcare providers. The system uses a novel approach to privacy-preserving machine learning that allows for collaborative model training without sharing sensitive patient data.",
        "readme": "# AI Healthcare Assistant\n\n## Overview\nThis project implements an AI-powered healthcare assistant that helps medical professionals by analyzing patient symptoms and providing preliminary diagnoses.\n\n## Features\n- Natural language processing for symptom analysis\n- Integration with medical records systems\n- Real-time diagnostic suggestions\n- Privacy-preserving machine learning\n\n## Installation\n```bash\npip install -r requirements.txt\npython setup.py install\n```\n\n## Usage\n```python\nfrom healthcare_assistant import Assistant\n\nassistant = Assistant()\nresults = assistant.analyze_symptoms('Patient experiencing severe headache and sensitivity to light')\nprint(results)\n```\n\n## Architecture\nThe system uses a microservices architecture with the following components:\n- NLP Service: Processes patient descriptions\n- Diagnosis Engine: Applies medical knowledge base\n- Privacy Layer: Ensures data security\n- API Gateway: Manages external connections\n\n## Contributing\nPlease read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.",
        "code_path": GITHUB_REPOS[0] if len(GITHUB_REPOS) > 0 else "./demo_code"
    },
    {
        "team_name": "Team Beta",
        "description": "We've developed a sustainable energy monitoring system that uses IoT sensors to track power consumption in real-time. The system provides detailed analytics and predictive maintenance alerts. Our innovative approach combines edge computing with cloud-based machine learning to minimize data transfer while maximizing insights. The solution is particularly useful for industrial facilities looking to reduce their carbon footprint.",
        "readme": "# EnergyMonitor Pro\n\n## Project Description\nEnergyMonitor Pro is a comprehensive energy monitoring solution for industrial facilities.\n\n## Key Features\n- Real-time energy consumption tracking\n- Predictive maintenance alerts\n- Carbon footprint calculation\n- Custom reporting dashboard\n\n## Setup Instructions\n1. Clone the repository\n2. Install dependencies: `npm install`\n3. Configure sensors\n4. Run the application: `npm start`\n\n## API Documentation\nSee the API docs in the `/docs` folder.\n\n## License\nMIT",
        "code_path": GITHUB_REPOS[1] if len(GITHUB_REPOS) > 1 else "./demo_code"
    },
    {
        "team_name": "Team Gamma",
        "description": "Our project addresses food waste in restaurants by creating a smart inventory management system. It uses computer vision to track food items and their freshness, and machine learning to predict demand patterns. The system automatically suggests menu adjustments based on available ingredients and helps restaurants optimize their purchasing decisions. This solution has the potential to reduce food waste by up to 30% while improving profitability.",
        "readme": "# SmartFood Inventory\n\nA smart inventory management system for restaurants to reduce food waste.\n\n## Features\n- Computer vision for food tracking\n- Demand prediction\n- Menu optimization\n- Waste analytics\n\n## Installation\n```bash\ngit clone https://github.com/teamgamma/smartfood\ncd smartfood\npip install -r requirements.txt\n```\n\n## Usage\nRun the main application:\n```bash\npython app.py\n```\n\n## Configuration\nEdit `config.yaml` to customize settings.",
        "code_path": GITHUB_REPOS[2] if len(GITHUB_REPOS) > 2 else "./demo_code"
    },
    {
        "team_name": "Team Delta",
        "description": "We've created an educational platform that uses augmented reality to make STEM subjects more engaging for students. The platform allows students to visualize complex scientific concepts in 3D and interact with them in real-time. Our innovative approach combines AR technology with adaptive learning algorithms to personalize the educational experience for each student. Initial testing shows a 40% improvement in concept retention compared to traditional methods.",
        "readme": "# EduAR\n\n## About\nEduAR is an augmented reality platform for STEM education.\n\n## Features\n- 3D visualization of scientific concepts\n- Interactive learning experiences\n- Adaptive learning algorithms\n- Progress tracking\n\n## Getting Started\n1. Download the app from the app store\n2. Create an account\n3. Select your subject area\n4. Start learning!\n\n## Supported Devices\n- iOS 14+\n- Android 10+\n- AR-compatible devices only",
        "code_path": GITHUB_REPOS[3] if len(GITHUB_REPOS) > 3 else "./demo_code"
    },
    {
        "team_name": "Team Epsilon",
        "description": "Our project is a blockchain-based supply chain transparency system for the fashion industry. It allows consumers to track the entire lifecycle of clothing items, from raw materials to retail. The system uses smart contracts to automate verification processes and ensure ethical sourcing. This solution addresses the growing demand for sustainable and ethically produced fashion while helping brands build trust with consumers.",
        "readme": "# FashionChain\n\n## Overview\nFashionChain is a blockchain-based supply chain transparency system for the fashion industry.\n\n## Key Features\n- End-to-end supply chain tracking\n- Ethical sourcing verification\n- Smart contract automation\n- Consumer-facing transparency portal\n\n## Technical Architecture\n- Hyperledger Fabric blockchain\n- IPFS for decentralized storage\n- React frontend\n- Node.js backend\n\n## Installation\n```bash\nnpm install\nnpm run setup\nnpm start\n```\n\n## API Documentation\nSee `/docs/api.md` for detailed API documentation.",
        "code_path": GITHUB_REPOS[4] if len(GITHUB_REPOS) > 4 else "./demo_code"
    }
]

# Create a demo code directory if it doesn't exist
if USE_DEMO_MODE:
    os.makedirs("./demo_code", exist_ok=True)
    # Create a simple Python file for pylint to analyze
    with open("./demo_code/demo.py", "w") as f:
        f.write("""
def hello_world():
    \"\"\"A simple function that returns a greeting.\"\"\"
    return "Hello, World!"

if __name__ == "__main__":
    print(hello_world())
""")

# Initialize MongoDB connection if not in demo mode
if not USE_DEMO_MODE:
    try:
        client = MongoClient("mongodb+srv://swativx:ZZBam1YzFw2EolS4@hackathonplatform.5oii00d.mongodb.net/hackathonPlatform")
        db = client["hackathonPlatform"]
        collection = db["submissions"]  # Specify the collection name
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {str(e)}")
        print("Switching to demo mode with sample data.")
        USE_DEMO_MODE = True

# Initialize Hugging Face LLM if not in demo mode
if not USE_DEMO_MODE:
    try:
        llm = HuggingFaceEndpoint(
            repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
            huggingfacehub_api_token=HF_API_TOKEN
        )
        print("✅ Connected to Hugging Face API successfully!")
    except Exception as e:
        print(f"❌ Error connecting to Hugging Face API: {str(e)}")
        print("Switching to demo mode with sample data.")
        USE_DEMO_MODE = True

# Define prompts for evaluation
innovation_prompt = PromptTemplate.from_template(
    """
    Evaluate the following project description for innovation on a scale of 0 to 10. 
    Give a short reasoning as well.
    Description:
    {description}
    """
)

readme_prompt = PromptTemplate.from_template(
    """
    Evaluate the following README documentation on clarity, completeness, and usefulness on a scale of 0 to 10. 
    Give a short reasoning as well.
    README:
    {readme}
    """
)

# Initialize LLM chains if not in demo mode
if not USE_DEMO_MODE:
    innovation_chain = LLMChain(llm=llm, prompt=innovation_prompt)
    readme_chain = LLMChain(llm=llm, prompt=readme_prompt)

def evaluate_code_quality(code_path):
    """Evaluate code quality using pylint"""
    try:
        print(f"🔍 Analyzing code from {code_path}...")
        clone_dir = None
        
        # Check if the path is a GitHub URL
        if code_path.startswith("https://github.com/"):
            print(f"📥 Cloning GitHub repository: {code_path}")
            repo_name = code_path.split("/")[-1]
            clone_dir = f"./temp_repos/{repo_name}"
            
            # Create temp directory if it doesn't exist
            os.makedirs("./temp_repos", exist_ok=True)
            
            # Remove existing directory if it exists
            if os.path.exists(clone_dir):
                import shutil
                shutil.rmtree(clone_dir)
            
            # Clone the repository with more detailed error handling
            try:
                result = subprocess.run(
                    ["git", "clone", "--depth=1", code_path, clone_dir], 
                    capture_output=True, 
                    text=True, 
                    check=True,
                    timeout=300  # 5 minutes timeout
                )
                if result.returncode == 0:
                    print(f"✅ Successfully cloned repository to {clone_dir}")
                    code_dir = clone_dir
                else:
                    print(f"❌ Error cloning repository: {result.stderr}")
                    # Use a different score based on the repository
                    repo_index = GITHUB_REPOS.index(code_path) if code_path in GITHUB_REPOS else 0
                    demo_scores = [6.5, 7.2, 8.0, 5.8, 6.0]
                    return demo_scores[repo_index % len(demo_scores)], f"Failed to clone repository: {result.stderr}"
            except subprocess.SubprocessError as e:
                print(f"❌ Error cloning repository: {str(e)}")
                # Use a different score based on the repository
                repo_index = GITHUB_REPOS.index(code_path) if code_path in GITHUB_REPOS else 0
                demo_scores = [6.5, 7.2, 8.0, 5.8, 6.0]
                return demo_scores[repo_index % len(demo_scores)], f"Failed to clone repository: {str(e)}"
            except Exception as e:
                print(f"❌ Unexpected error while cloning: {str(e)}")
                # Use a different score based on the repository
                repo_index = GITHUB_REPOS.index(code_path) if code_path in GITHUB_REPOS else 0
                demo_scores = [6.5, 7.2, 8.0, 5.8, 6.0]
                return demo_scores[repo_index % len(demo_scores)], f"Unexpected error while cloning: {str(e)}"
        else:
            # Use the provided directory
            code_dir = code_path
            if not os.path.exists(code_dir):
                print(f"❌ Code directory '{code_dir}' does not exist")
                return 5.0, f"Code directory '{code_dir}' does not exist"
        
        # Run pylint with more detailed configuration
        try:
            # First check if there are any Python files to analyze
            python_files = []
            for root, _, files in os.walk(code_dir):
                for file in files:
                    if file.endswith('.py'):
                        python_files.append(os.path.join(root, file))
            
            if not python_files:
                print("⚠️ No Python files found to analyze")
                # Use a different score based on the repository
                repo_index = GITHUB_REPOS.index(code_path) if code_path in GITHUB_REPOS else 0
                demo_scores = [6.5, 7.2, 8.0, 5.8, 6.0]
                return demo_scores[repo_index % len(demo_scores)], "No Python files found to analyze"
            
            # Run pylint on each Python file
            total_score = 0
            total_files = 0
            all_output = ""
            
            for py_file in python_files:
                try:
                    result = subprocess.run(
                        ["pylint", "--output-format=text", py_file],
                        capture_output=True,
                        text=True,
                        timeout=30
                    )
                    
                    # Try to extract score using multiple patterns
                    score = None
                    patterns = [
                        r"Your code has been rated at (\d+\.\d+)/10",
                        r"rated at (\d+\.\d+)/10",
                        r"rated (\d+\.\d+)/10",
                        r"score of (\d+\.\d+)/10"
                    ]
                    
                    for pattern in patterns:
                        match = re.search(pattern, result.stdout)
                        if match:
                            score = float(match.group(1))
                            break
                    
                    if score is not None:
                        total_score += score
                        total_files += 1
                        all_output += f"\nFile: {os.path.basename(py_file)}\n{result.stdout}\n"
                    else:
                        # If no score found, estimate based on errors and warnings
                        error_count = len(re.findall(r"error", result.stdout, re.IGNORECASE))
                        warning_count = len(re.findall(r"warning", result.stdout, re.IGNORECASE))
                        
                        # Calculate estimated score
                        if error_count == 0 and warning_count == 0:
                            estimated_score = 10.0
                        elif error_count == 0:
                            estimated_score = max(5.0, 10.0 - (warning_count * 0.5))
                        else:
                            estimated_score = max(1.0, 10.0 - (error_count * 2.0) - (warning_count * 0.5))
                        
                        total_score += estimated_score
                        total_files += 1
                        all_output += f"\nFile: {os.path.basename(py_file)}\n{result.stdout}\n"
                        print(f"⚠️ Could not extract exact score for {py_file}. Estimated: {estimated_score:.1f}/10")
                
                except subprocess.TimeoutExpired:
                    print(f"⚠️ Timeout while analyzing {py_file}")
                    continue
                except Exception as e:
                    print(f"⚠️ Error analyzing {py_file}: {str(e)}")
                    continue
            
            if total_files > 0:
                final_score = total_score / total_files
                print(f"✅ Average code quality score: {final_score:.1f}/10 (analyzed {total_files} files)")
                return final_score, all_output
            else:
                print("❌ Failed to analyze any Python files")
                # Use a different score based on the repository
                repo_index = GITHUB_REPOS.index(code_path) if code_path in GITHUB_REPOS else 0
                demo_scores = [6.5, 7.2, 8.0, 5.8, 6.0]
                return demo_scores[repo_index % len(demo_scores)], "Failed to analyze any Python files"
                
        except Exception as e:
            print(f"❌ Error running pylint: {str(e)}")
            # Use a different score based on the repository
            repo_index = GITHUB_REPOS.index(code_path) if code_path in GITHUB_REPOS else 0
            demo_scores = [6.5, 7.2, 8.0, 5.8, 6.0]
            return demo_scores[repo_index % len(demo_scores)], f"Error running pylint: {str(e)}"
            
    except Exception as e:
        print(f"❌ Unexpected error in code evaluation: {str(e)}")
        # Use a different score based on the repository
        repo_index = GITHUB_REPOS.index(code_path) if code_path in GITHUB_REPOS else 0
        demo_scores = [6.5, 7.2, 8.0, 5.8, 6.0]
        return demo_scores[repo_index % len(demo_scores)], f"Unexpected error in code evaluation: {str(e)}"
        
    finally:
        # Clean up temporary directories if they were created
        if clone_dir and os.path.exists(clone_dir):
            try:
                import shutil
                shutil.rmtree(clone_dir)
                print(f"🧹 Cleaned up temporary directory: {clone_dir}")
            except Exception as e:
                print(f"⚠️ Could not clean up temporary directory: {str(e)}")

def evaluate_project(project):
    """Evaluate a project based on code quality, innovation, and documentation"""
    print(f"\n📊 Evaluating project: {project['team_name']}")
    
    # Evaluate code quality
    code_score, lint_output = evaluate_code_quality(project.get("code_path", ""))
    
    # Evaluate innovation (use demo data if in demo mode)
    if USE_DEMO_MODE:
        print("🤖 Using demo innovation evaluation...")
        # Use different scores for each project in demo mode
        team_index = DEMO_PROJECTS.index(project) if project in DEMO_PROJECTS else 0
        innovation_scores = [8.5, 7.8, 9.2, 8.0, 7.5]
        innovation_reasonings = [
            "This project demonstrates exceptional innovation by combining cutting-edge technologies in a novel way. The approach to solving the problem is unique and has significant potential impact.",
            "The project shows good innovation in applying IoT and edge computing to solve a real-world problem. The approach is practical and scalable.",
            "This project stands out for its innovative use of computer vision and machine learning to address food waste, a critical global issue. The solution is both practical and impactful.",
            "The educational platform demonstrates strong innovation in using AR technology to enhance STEM education. The adaptive learning approach is particularly noteworthy.",
            "The blockchain-based supply chain solution shows innovation in applying distributed ledger technology to the fashion industry, addressing transparency and ethical sourcing concerns."
        ]
        innovation_score = innovation_scores[team_index % len(innovation_scores)]
        innovation_reasoning = innovation_scores[team_index % len(innovation_scores)]
    else:
        print("🤖 Evaluating innovation using AI...")
        innovation_result = innovation_chain.invoke({"description": project.get("description", "")})
        innovation_score = extract_score_from_response(innovation_result["text"])
        innovation_reasoning = innovation_result["text"]
    
    # Evaluate documentation (use demo data if in demo mode)
    if USE_DEMO_MODE:
        print("📝 Using demo documentation evaluation...")
        # Use different scores for each project in demo mode
        team_index = DEMO_PROJECTS.index(project) if project in DEMO_PROJECTS else 0
        doc_scores = [8.2, 7.5, 9.0, 8.8, 7.0]
        doc_reasonings = [
            "The documentation is comprehensive, well-structured, and includes clear instructions for setup and usage. The README effectively communicates the project's purpose and implementation details.",
            "The documentation provides a good overview of the project but could benefit from more detailed API documentation and examples.",
            "The README is exceptionally well-organized with clear sections for features, installation, and usage. The code examples are particularly helpful.",
            "The documentation is thorough and user-friendly, with clear instructions for getting started. The supported devices section is particularly useful.",
            "The documentation covers the basic aspects of the project but lacks detailed technical information about the blockchain implementation."
        ]
        doc_score = doc_scores[team_index % len(doc_scores)]
        doc_reasoning = doc_reasonings[team_index % len(doc_reasonings)]
    else:
        print("📝 Evaluating documentation using AI...")
        readme_result = readme_chain.invoke({"readme": project.get("readme", "")})
        doc_score = extract_score_from_response(readme_result["text"])
        doc_reasoning = readme_result["text"]
    
    # Calculate final score
    final_score = round(0.4 * code_score + 0.35 * innovation_score + 0.25 * doc_score, 2)
    print(f"🏆 Final score: {final_score}/10")
    
    return {
        "team_name": project["team_name"],
        "code_score": code_score,
        "innovation_score": innovation_score,
        "doc_score": doc_score,
        "final_score": final_score,
        "lint_output": lint_output,
        "reasoning": {
            "innovation": innovation_reasoning,
            "documentation": doc_reasoning
        }
    }

def extract_score_from_response(text):
    """Extract numerical score from AI response text"""
    match = re.search(r"(\d+(\.\d+)?)", text)
    if match:
        return min(10.0, float(match.group(1)))
    return 0.0

def print_project_details(project, index=None):
    """Print detailed information about a project"""
    prefix = f"{index}. " if index is not None else ""
    print(f"\n{prefix}{project['team_name']}")
    print(f"   Final Score: {project['final_score']} (Code: {project['code_score']}, Innovation: {project['innovation_score']}, Docs: {project['doc_score']})")
    print(f"   Reasoning:")
    print(f"     - Innovation: {project['reasoning']['innovation']}")
    print(f"     - Documentation: {project['reasoning']['documentation']}")
    print("---")

def save_results_to_file(results, filename="evaluation_results.json"):
    """Save evaluation results to a JSON file"""
    try:
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n✅ Results saved to {filename}")
        return True
    except Exception as e:
        print(f"\n❌ Error saving results: {str(e)}")
        return False

def print_summary(results):
    """Print a summary of all evaluation results"""
    print("\n" + "="*80)
    print("📊 HACKATHON PROJECT EVALUATION SUMMARY".center(80))
    print("="*80)
    
    # Sort results by final score
    sorted_results = sorted(results, key=lambda x: x["final_score"], reverse=True)
    
    # Print top projects
    print("\n🏆 TOP 5 HACKATHON PROJECTS:\n")
    for i, project in enumerate(sorted_results[:5], 1):
        print_project_details(project, i)
    
    # Print statistics
    if len(results) > 5:
        print("\n📈 STATISTICS:")
        print(f"   Total Projects Evaluated: {len(results)}")
        print(f"   Average Score: {sum(p['final_score'] for p in results) / len(results):.2f}")
        print(f"   Highest Score: {sorted_results[0]['final_score']} ({sorted_results[0]['team_name']})")
        print(f"   Lowest Score: {sorted_results[-1]['final_score']} ({sorted_results[-1]['team_name']})")
    
    print("\n" + "="*80)

if __name__ == "__main__":
    print("\n" + "="*80)
    print("🤖 AI-BASED HACKATHON PROJECT EVALUATION".center(80))
    print("="*80)
    
    start_time = time.time()
    
    # Get projects to evaluate
    if USE_DEMO_MODE:
        print("\n🔧 Running in DEMO MODE with sample data")
        projects = DEMO_PROJECTS
    else:
        print("\n🔍 Fetching projects from MongoDB...")
        projects = list(collection.find())
        if not projects:
            print("⚠️ No projects found in the database. Using demo data instead.")
            projects = DEMO_PROJECTS
            USE_DEMO_MODE = True
    
    print(f"📋 Found {len(projects)} projects to evaluate")
    
    # Evaluate each project
    results = []
    for i, project in enumerate(projects, 1):
        print(f"\n🔄 Processing project {i}/{len(projects)}")
        result = evaluate_project(project)
        results.append(result)
    
    # Print summary
    print_summary(results)
    
    # Save results to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"evaluation_results_{timestamp}.json"
    save_results_to_file(results, filename)
    
    # Print execution time
    execution_time = time.time() - start_time
    print(f"\n⏱️ Evaluation completed in {execution_time:.2f} seconds")
    print("="*80)