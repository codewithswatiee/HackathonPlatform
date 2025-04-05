from langchain.chains import RetrievalQA
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import HuggingFacePipeline
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.load_local("hackathon_knowledge", embedding_model)

model_id = "mistralai/Mistral-7B-Instruct-v0.1"  # or "tiiuae/falcon-7b-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

hf_pipeline = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=512,
    temperature=0.7,
    repetition_penalty=1.1
)

llm = HuggingFacePipeline(pipeline=hf_pipeline)

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())

query = str(input("Any Doubts?"))
response = qa_chain.run(query)
print("Bot:", response)