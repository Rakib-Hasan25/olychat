from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema import StrOutputParser
from lib.openai_config import openai_instance


def operation_with_vectordb(vector_store,latest_msg):
    results = vector_store.similarity_search(latest_msg,k=2)
    print(results)
    results = [x.page_content for x in results]
    print(results)
    print(latest_msg)
    PROMPT_TEMPLATE = """
    Use a Tree of Thought approach implicitly explore multiple reasoning paths before selecting the correct answer.
    Context: {context}
    follow the structure: 
          - Use the context to answer the question . 
          - answer should be very simple, short, straightforward
          - add proper markdown while answer
          - Evaluate and eliminate incorrect or weaker reasoning paths.
          - Select the strongest answer based on this internal evaluation.
          - Do not show your reasoning—only provide the final answer.
        Question: {query}
        Answer: """  
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    
    model = openai_instance("gpt-4o",0.3,True)
    summarize_chain =  {"context": lambda x: x}|{"query": lambda x: x}| prompt | model | StrOutputParser()
    return summarize_chain.stream({ "context": results,
        "query": latest_msg})