import os
from flask import Response
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import os
from langchain.schema import StrOutputParser
from langchain.globals import set_verbose  
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from dotenv import load_dotenv 
load_dotenv() 

def generate_streaming_response(msg):
# Prompt
        # print(type(msg))
        latest_msg = msg[-1]["content"]
        print(latest_msg)
        if(len(msg)>5):
             msg = msg[-4:-1]
        elif(len(msg)>1):
             msg = msg[:-1] 
        else: 
              msg =[]    

        prompt_text = """
        you are an expert. 
        These are our previous conversations history {msg}.
        follow the below steps while answer 
        - answer should be short ,concise, straightforward, simple. 
        - add proper markdown while answer
        Question : 
        {element}
        """
        prompt = ChatPromptTemplate.from_template(prompt_text)

        print("prompt",prompt)
        print("================================================")
        model = ChatOpenAI(
            model_name="gpt-4o",
            temperature=0.9,
            openai_api_key=os.environ.get('OPENAI_API_KEY'),
            streaming=True,
            callbacks=[StreamingStdOutCallbackHandler()],
            verbose=True
        )
        summarize_chain =  {"msg": lambda x: x}| {"element": lambda x: x} | prompt | model | StrOutputParser()
        
        return summarize_chain.stream({ "msg": msg,
        "element": latest_msg})
           
    