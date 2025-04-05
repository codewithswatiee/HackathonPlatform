from pymongo import MongoClient
import os
from dotenv import load_dotenv
from langchain.llms import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import subprocess
import re

load_dotenv()
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

client = MongoClient("mongodb://localhost:27017/")
db = client["project_db"]
collection = db["submissions"]

llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingfacehub_api_token=HF_API_TOKEN
)

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

innovation_chain = LLMChain(llm=llm, prompt=innovation_prompt)
readme_chain = LLMChain(llm=llm, prompt=readme_prompt)

def evaluate_code_quality(code_dir):
    try:
        result = subprocess.run(
            ["pylint", code_dir], capture_output=True, text=True, timeout=30
        )
        score_match = re.search(r"Your code has been rated at (\d+\.\d+)/10", result.stdout)
        if score_match:
            return float(score_match.group(1)), result.stdout
        return 0.0, result.stdout
    except Exception as e:
        return 0.0, str(e)

def evaluate_project(project):
    code_score, lint_output = evaluate_code_quality(project.get("code_path", ""))

    innovation_result = innovation_chain.invoke({"description": project.get("description", "")})
    innovation_score = extract_score_from_response(innovation_result["text"])

    readme_result = readme_chain.invoke({"readme": project.get("readme", "")})
    doc_score = extract_score_from_response(readme_result["text"])

    final_score = round(0.4 * code_score + 0.35 * innovation_score + 0.25 * doc_score, 2)

    return {
        "team_name": project["team_name"],
        "code_score": code_score,
        "innovation_score": innovation_score,
        "doc_score": doc_score,
        "final_score": final_score,
        "lint_output": lint_output,
        "reasoning": {
            "innovation": innovation_result["text"],
            "documentation": readme_result["text"]
        }
    }

def extract_score_from_response(text):
    match = re.search(r"(\d+(\.\d+)?)", text)
    if match:
        return min(10.0, float(match.group(1)))
    return 0.0

if __name__ == "__main__":
    submissions = collection.find()
    results = []

    for submission in submissions:
        result = evaluate_project(submission)
        results.append(result)

    top_projects = sorted(results, key=lambda x: x["final_score"], reverse=True)[:5]

    print("\n Top 5 Hackathon Projects:\n")
    for i, project in enumerate(top_projects, 1):
        print(f"{i}. {project['team_name']}")
        print(f"   Final Score: {project['final_score']} (Code: {project['code_score']}, Innovation: {project['innovation_score']}, Docs: {project['doc_score']})")
        print(f"   Reasoning:\n     - Innovation: {project['reasoning']['innovation']}\n     - Documentation: {project['reasoning']['documentation']}\n")
        print("---")