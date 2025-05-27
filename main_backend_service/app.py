import os
import uuid
from flask import Flask, json, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import requests
from lib.openai_config import openai_embedding_instance
from operation.fetch_pdf_data import fetch_pdf_data
from operation.generic_streaming_operation import generate_streaming_response
from operation.llm_operation_vector_db import operation_with_vectordb
from redis import Redis
from lib.openai_config import openai_embedding_instance
from langchain_community.vectorstores import SupabaseVectorStore
from lib.supabase_config import supabase,BUCKET_NAME
from operation.image_process import download_image,encode_image_to_base64,single_image_process
import aiohttp
import asyncio
from lib.get_specific_model import get_llm_model_morefeatures
from langchain.prompts import ChatPromptTemplate

class LLMChatServer:
    def __init__(self):
        # Initialize Flask app with CORS
        self.app = Flask(__name__)
        CORS(self.app, resources={
            r"/api/*": {"origins": "*"},
            r"/socket.io/*": {"origins": "*"}
        })
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")
        self.register_routes()
        self.register_socket_events()
        redis_host = os.getenv('REDIS_HOST', 'redis')  
        redis_port = int(os.getenv('REDIS_PORT', 6379))
        
        # Initialize Redis client with explicit host and port
        try:
            self.redis_client = Redis(
                host=redis_host,
                port=redis_port,
                ssl=False,  # Disable SSL for local development
                decode_responses=True,  # Optional: automatically decode responses to strings
                socket_timeout=5,  # Add timeout
                socket_connect_timeout=5  # Add connection timeout
            )
            # Test the connection
            self.redis_client.ping()
            print("Successfully connected to Redis")
        except Exception as e:
            print(f"Failed to connect to Redis: {e}")
            self.redis_client = None
        

   




   # Define the API routes(http)
    def register_routes(self):
        @self.app.route('/api/upload', methods=['POST'])
        def upload_file():
            file = request.files['file']
            file_type = request.form['filetype']
            file_id = request.form['fileId']
            chunk_number = int(request.form['chunkNumber'])
            total_chunks = int(request.form['totalChunks'])
            chunk_filename = f"{file_id}_part_{chunk_number}"

            try:
            # Upload the chunk to Supabase Storage
                supabase.storage.from_(BUCKET_NAME).upload(
                path=chunk_filename,
                file=file.read(),
                file_options={"content-type": "application/octet-stream"}
            ) 
                print("chunk uploaded successfully")
            except Exception as e:
                return jsonify({"error": str(e)}), 500

            # If all chunks are uploaded, combine them
            if chunk_number == total_chunks - 1:
             print("we are in the last chunk")   
             try:
                # Combine all chunks
                combined_file = b""
                for i in range(total_chunks):
                 chunk_filename = f"{file_id}_part_{i}"
                 chunk_data = supabase.storage.from_(BUCKET_NAME).download(chunk_filename)
                 combined_file += chunk_data
                print("file type ", file_type)    
                # Determine final file name and type
                if file_type =='image':
                    final_filename = f"{file_id}_final.png"
                    content_type = "image/png"
                else:
                    final_filename = f"{file_id}_final.pdf"
                    content_type = "application/pdf"
              
                 

                # Upload the combined file to Supabase Storage
                supabase.storage.from_(BUCKET_NAME).upload(
                path=final_filename,
                file=combined_file,
                file_options={"content-type": content_type}
                )

                # Clean up the chunks
                for i in range(total_chunks):
                 chunk_filename = f"{file_id}_part_{i}"
                 supabase.storage.from_(BUCKET_NAME).remove([chunk_filename])

                # Generate public URL for the uploaded file
                file_url = supabase.storage.from_(BUCKET_NAME).get_public_url(final_filename)
                return jsonify({"message": "File uploaded successfully", "data": file_url}), 200
             except Exception as e:
                return jsonify({"error": str(e)}), 500
          
            return jsonify({"message": "chunk upload successfull"}), 200
            
        @self.app.route('/api/delete-file', methods=['POST'])
        def delete_file():
            try:
                data = request.get_json()
                file_name = data.get('fileName')
                file_type = data.get('fileType')
            
                if file_type == 'image/png':
                   file_name += "_final.png"
                else:
                  file_name += "_final.pdf"
                if not file_name:
                  return jsonify({"error": "File name is required"}), 400

            # Remove the file from Supabase Storage
                response = supabase.storage.from_(BUCKET_NAME).remove([file_name])
                if response.get('error'):
                  return jsonify({"error": "Failed to delete file"}), 500

                return jsonify({"message": "File deleted successfully"}), 200
            except Exception as e:
                return jsonify({"error": str(e)}), 500
          

        @self.app.route('/api/chat', methods=['POST'])
        def http_chat():
            return generate_streaming_response()
           







#define the socket events

    def register_socket_events(self):
        @self.socketio.on('connect')
        def handle_connect():
            print('Client connected')







        #basic msg handling
        #we are not using this function anymore (can create unusal chunk while sending msg)

        @self.socketio.on('normal-msg')
        def text_msg(data):

            print('client sending message')    
            message = data.get('message')
            print(message)
            # response = generate_response(message)
            # emit('stream_chunk', {
            #     'content': response
            # })
            
        #Previous Context msg handling
        @self.socketio.on('previous-context-msg')
        def text_msg(data): 
            msg = data.get('message')
            latest_msg = msg[-1]["content"]
            print(latest_msg)
            if(len(msg)>10):
                msg = msg[-9:-1]
            elif(len(msg) < 10):
                msg = msg[:-1]
            emit("get_context",{
                "context":msg
            })    
            
        
       
    

       #pdf scraping as well as send msg 
       #image processing as well as send msg 
        @self.socketio.on('msg-with-upload-file')
        def msg_with_file(data):
            file_url = data.get('fileurl')
            msg = data.get('message')
            file_type = data.get('filetype')
            chat_id = data.get('chatId')
            latest_msg = msg
            try:
              if(file_type):
                #if file type is pdf 
                print('file is pdf')
                vector_store, context = fetch_pdf_data(file_url, self.socketio,chat_id)
                
                emit("get_context_file",{
                    "context":context
                })
              else:
                #if file type is image 
                emit('image_processing')
                download_image1 = download_image(file_url)
                print('downloading image')
                image = encode_image_to_base64(download_image1)
                emit("analyzing-msg-text")
                context = single_image_process(image, latest_msg)
                emit("get_context_file",{
                    "context":context
                })
              emit("stream_generating_file")

            except Exception as e:
               print("something went wrong",e )
               emit("get_context_file",{
                    "context":[]
                })   
           
               
        
        
        
        
        #chat with previously uploaded file in vector db 
        @self.socketio.on('chat-with-file')
        def chat_with_pdf(data):
            msg = data.get('message')
            latest_msg = msg
            chat_id = data.get('chatId')
            embeddings= openai_embedding_instance(model="text-embedding-ada-002")
            try:    
              vector_store = SupabaseVectorStore(
              embedding=embeddings,
              client=supabase,
              table_name="documents",
              query_name="match_documents",
              )
              operation_with_vectordb(vector_store,latest_msg,self.socketio,chat_id)
            except Exception as e:
              print("something went wrong",e )
            
            
         
            



 



        @self.socketio.on("websearch-chat")
        def websearch_chat(data):        
            msg = data.get('message')
            latest_msg = msg
        
            prompt_template = """
            Classify the following user query into one of: image, youtube, research_paper, or news.
            If it's about images, return {{\"request_type\": \"image\", \"query\": \"<short query>\"}}.
            If it's about YouTube, return {{\"request_type\": \"youtube\", \"query\": \"<short query>\"}}.
            If it's about research papers, return {{\"request_type\": \"research_paper\", \"query\": \"<short query>\"}}.
            Otherwise, return {{\"request_type\": \"news\", \"query\": \"<short query>\"}}.
            User query: {query}
            """
            prompt = ChatPromptTemplate.from_template(prompt_template).format(query=latest_msg)

            # 2. Get LLM and generate response
            llm = get_llm_model_morefeatures(model_name="gpt-4o", temperature=0.2, streaming=False, max_tokens=100,response_format={"response_format": {"type": "json_object"}})
            response = llm.invoke(prompt)
            print("LLM classification response:", response.content)
            request_type = "news"
            short_query = latest_msg
            try:
                classification = json.loads(response.content)
                request_type = classification.get("request_type")
                short_query = classification.get("query")
                print("i am here in the try block")
            except Exception as e:
                print("Classification failed, defaulting to news", e)
                
                short_query = latest_msg
                print("i am here in the except block")


            # 3. Route selection
            route_map = {
                "image": f"{os.getenv('NODE_BACKEND_URL')}/image-search",
                "youtube": f"{os.getenv('NODE_BACKEND_URL')}/youtube-search",
                "research_paper": f"{os.getenv('NODE_BACKEND_URL')}/paper-search",
                "news": f"{os.getenv('NODE_BACKEND_URL')}/news-search"
            }
            url = route_map.get(request_type)
            payload = {"query": short_query}
            print("url ",url)
            print(payload)
            headers = {"Content-Type": "application/json"}
            try:
                response = requests.post(url, json=payload, headers=headers)
                response.raise_for_status()
                print("Response:", response.json())
                data = response.json()
                result = data.get('videos') or data.get('images') or data.get('papers') or data.get('news') or []
                print("result ",result)
                if(result):    
                    # Format the result based on request_type
                    formatted_result = []
                    if request_type == 'youtube':
                        formatted_result = [{
                            'title': item['title'],
                            'img_src': item['img_src'],
                            'url': item['url'],
                            'iframe_src': item['iframe_src']
                        } for item in result]
                    elif request_type == 'image':
                        formatted_result = [{
                            'title': item['title'],
                            'img_src': item['img_src'],
                            'url': item['url']
                        } for item in result]
                    elif request_type == 'research_paper':
                        formatted_result = [{
                            'title': item['title'],
                            'url': item['url'],
                            'pdf_url': item.get('pdf_url')
                        } for item in result]
                    elif request_type == 'news':
                        formatted_result = [{
                            'title': item['title'],
                            'url': item['url'],
                            'content': item.get('content', '')
                        } for item in result]

                    emit("return-response", {
                        'result': formatted_result,
                        'request_type': request_type
                    })
                    emit("response-complete")
                
              
            except requests.exceptions.RequestException as e:
                print("Error:", e)
                emit("return-response", {
                        'result': "Server is busy, please try again later",
                        'request_type': "error"
                    })
       







        @self.socketio.on('senttoredis')
        def handle_senttoredis(data):
            message = data.get("message")
            user_email = data.get("userEmail")
            chat_id = data.get("chatId")
            redis_key = f"chat:messages:{user_email}:{chat_id}"

        
            self.redis_client.rpush(redis_key, json.dumps(message))

            print("successfully push to redis ")
            print(message,user_email,chat_id)
   

        
    def run(self, host='0.0.0.0', port=5001):
        self.socketio.run(self.app, host=host, port=port)    
           
            

server = LLMChatServer()
app = server.app
if __name__ == '__main__':
    server = LLMChatServer() # can comment out while working on production mode
    app = server.app # can comment out while working on production mode
    server.run()
