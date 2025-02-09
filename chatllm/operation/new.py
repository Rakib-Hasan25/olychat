
import os
from flask import Response
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import os
from langchain.schema import StrOutputParser
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from dotenv import load_dotenv 
load_dotenv() 
def generate(llm,prompt):
    for chunk in llm.stream(prompt):
        print(chunk)
        if hasattr(chunk, 'content'):
            yield f"{chunk.content}\n\n"
def generate_streaming_response():
# Prompt
        prompt_text = """
        you are a story teller , tell me a story
        tell me a story : {element}
        """
        prompt = ChatPromptTemplate.from_template(prompt_text)
        model = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            temperature=0,
            openai_api_key=os.environ.get('OPENAI_API_KEY'),
            streaming=True,
            callbacks=[StreamingStdOutCallbackHandler()]
        )
        summarize_chain =  {"element": lambda x: x} | prompt | model | StrOutputParser()

        
        
        # return Response(
        #     generate(summarize_chain,"openai"),
        #     mimetype='text/event-stream',
        #     headers={
        #     'Cache-Control': 'no-cache',
        #     'Connection': 'keep-alive',
        #     'Access-Control-Allow-Origin': '*'
        #     }
        # )   
    


   
    