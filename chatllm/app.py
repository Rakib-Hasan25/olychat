import os
import uuid
from flask import Flask, json, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import requests
# from operation.new import generate_streaming_response
from lib.openai_config import openai_embedding_instance
from operation.fetch_pdf_data import fetch_pdf_data,is_pdf
from operation.handletextmsgoperation import generate_streaming_response
from operation.llm_operation_vector_db import operation_with_vectordb
from redis import Redis
from lib.openai_config import openai_embedding_instance
from langchain_community.vectorstores import SupabaseVectorStore
from lib.supabase_config import supabase,BUCKET_NAME
from operation.image_process import download_image,encode_image_to_base64,single_image_process
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
        redis_host = os.getenv('REDIS_HOST', 'host.docker.internal')  # Default to 'redis' service name
        redis_port = int(os.getenv('REDIS_PORT', 6379))
        
        # Initialize Redis client with explicit host and port
        self.redis_client = Redis(
            host=redis_host,
            port=redis_port,
            decode_responses=True  # Optional: automatically decode responses to strings
        )
        
   

    def register_routes(self):
        @self.app.route('/api/chat', methods=['POST'])
        def http_chat():
            # return generate_streaming_response()
            return ""
        @self.app.route('/api/upload', methods=['POST'])
        def upload_file():
        #    os.makedirs(self.UPLOAD_FOLDER, exist_ok=True)
           file = request.files['file']
           file_type = request.form['filetype']
           print(file_type,"file type")
           file_id = request.form['fileId']
           chunk_number = int(request.form['chunkNumber'])
           total_chunks = int(request.form['totalChunks'])
           chunk_filename = f"{file_id}_part_{chunk_number}"
           print(total_chunks)
           try:
        # Upload the chunk
               res = supabase.storage.from_(BUCKET_NAME).upload(
               path=chunk_filename,
               file=file.read(),
               file_options={"content-type": "application/octet-stream"}
               )
               
               print(res)
               print("here")
            #    if res.status_code != 200:
            #        print("res stoo")
            #        return jsonify({"error": "Failed to upload chunk"}), 500
           except Exception as e:
               print("excecption ", e)
            #    return jsonify({"error": str(e)}), 500
           


           print("here now upload chunk")

    # Save the chunk to a temporary file
        #    chunk_filename = f"{self.UPLOAD_FOLDER}/{file_id}_part_{chunk_number}"
        #    file.save(chunk_filename)
           final_filename=""
    # If all chunks are uploaded, combine them
           if chunk_number == total_chunks - 1:
            try:
                # Download all chunks and combine them
                combined_file = b""
                for i in range(total_chunks):
                    chunk_filename = f"{file_id}_part_{i}"
                    chunk_data = supabase.storage.from_(BUCKET_NAME).download(chunk_filename)
                    combined_file += chunk_data

                if (file_type=='application/pdf'):
                # Upload the combined file to Supabase Storage
                 final_filename = f"{file_id}_final.pdf"
                 supabase.storage.from_(BUCKET_NAME).upload(
                    path=final_filename,
                    file=combined_file,
                    file_options={"content-type": "image/pdf"}
                )
                else :
                    final_filename = f"{file_id}_final.png"
                    supabase.storage.from_(BUCKET_NAME).upload(
                    path=final_filename,
                    file=combined_file,
                    file_options={"content-type": "image/png"}
                ) 

                # Clean up the chunks
                for i in range(total_chunks):
                    chunk_filename = f"{file_id}_part_{i}"
                    supabase.storage.from_(BUCKET_NAME).remove([chunk_filename])
                pdf_url = supabase.storage.from_(BUCKET_NAME).get_public_url(final_filename)
                return jsonify({"message": "File uploaded successfully","data":pdf_url}), 200
            except Exception as e:
                return jsonify({"error": str(e)}), 500
           return jsonify({"message": "Chunk uploaded successfully"}), 200

          

    def register_socket_events(self):
        @self.socketio.on('connect')
        def handle_connect():
            print('Client connected')


        #basic msg handling
        @self.socketio.on('incoming-text-msg')
        def text_msg(data):
            print('client sending message')    
            message = data.get('message')
            print(message)
            stream = generate_streaming_response(message)
            for chunk in stream:
                emit('stream_chunk', {
                        'content': chunk
                    })
            emit('stream_complete')

         #file upload handling   
        @self.socketio.on('upload-file')
        def handle_upload_file(data):
            print("now we are here ")
            # print(data)
            # file_storage = data['file']  # The uploaded file data
            # file_name = data['name']    # The file name
            # file_type = data['type'] 
            # emit('file-uploaded', {'message': 'File uploaded successfully!', 'filePath': file_name}) 
            # file_name = data['meta']['name']
            # file_data = data['file']  # This will be a binary buffer
            # print(file_name)
            UPLOAD_FOLDER = './uploads'
            file_name = data["file_name"]
            chunk = data["chunk"].encode("latin1")  # Convert back from byte string

            file_path = os.path.join(UPLOAD_FOLDER, file_name)
            with open(file_path, "ab") as f:  # Append mode
                f.write(chunk)

            # with open(file_path, 'wb') as f:
            #     f.write(file_data)
            #     print("now we are here")
       
       



       #pdf scraping as well as send msg 
        @self.socketio.on('msg-with-upload-file')
        def msg_with_file(data):
            file_url = data.get('fileurl')
            msg = data.get('message')

            
            latest_msg = msg[-1]["content"]
            print(latest_msg)
            if(len(msg)>5):
             msg = msg[-4:-1]
            elif(len(msg)>1):
             msg = msg[:-1] 
            else: 
              msg =[]    
            print("hi")
            print(file_url)
            try:
             if(is_pdf(file_url)):
              vector_store = fetch_pdf_data(file_url,self.socketio)
              emit('generating-response')
              stream = operation_with_vectordb(vector_store,latest_msg)
             else:
               download_image1 = download_image(file_url)
               print('downloading image')
               image = encode_image_to_base64(download_image1)
               print("now here ")
               stream = single_image_process(image,latest_msg)
             for chunk in stream:
                emit('stream_chunk1', {
                        'content': chunk
                    })
            except Exception as e:
               print("something went wrong",e )   
            print("start stream")
        
            emit("stream_complete1")




         # just chat with pdf    
        
        
        
        #chat with pdf 
        @self.socketio.on('chat-with-file')
        def chat_with_pdf(data):
            msg = data.get('message')
            latest_msg = msg[-1]["content"]
            print(latest_msg)
            if(len(msg)>5):
             msg = msg[-4:-1]
            elif(len(msg)>1):
             msg = msg[:-1] 
            else: 
              msg =[]    
            print("hi")
            embeddings= openai_embedding_instance(model="text-embedding-ada-002")
            try:    
              vector_store = SupabaseVectorStore(
             embedding=embeddings,
            client=supabase,
            table_name="documents",
            query_name="match_documents",
            )
              stream = operation_with_vectordb(vector_store,latest_msg)
            except Exception as e:
                print("something went wrong",e )
            
            for chunk in stream:
                emit('stream_chunk', {
                        'content': chunk
                    })
         
            emit("stream_complete")



        @self.socketio.on("websearch-chat")
        def websearch_chat(data):        
            msg = data.get('message')
            latest_msg = msg[-1]["content"]
            print(latest_msg) 
            

    # Define the payload (data to send)
            payload = {
                "message": latest_msg
            }    
            # url = "http://host.docker.internal:3001/youtube-search"
            # url = os.getenv('NODE_BACKEND_URL', 'http://host.docker.internal:3001/youtube-search')
            url =  "http://searchtry:3001/youtube-search"    
    # Define the payload (data to send)
            payload = {
                "query": latest_msg
            }
            headers = {
        "Content-Type": "application/json",
     
                 }
            try:
                response = requests.post(url, json=payload, headers=headers)
                response.raise_for_status()  # Raise error for bad response (4xx, 5xx)
        
        # Print or process the response
                print("Response:", response.json())  
                data = response.json()
                videos = data['videos']

                emit("return-video",{
                   'videos': videos
                })
                emit("stream-complete3")
                   
                
        
            except requests.exceptions.RequestException as e:
                 print("Error:", e)
       



        @self.socketio.on('senttoredis')
        def handle_senttoredis(data):
            message = data.get("message")
            user_email = data.get("userEmail")
            chat_id = data.get("chatId")
            redis_key = f"chat:messages:{user_email}:{chat_id}"

        # Push the message into the Redis list
            self.redis_client.rpush(redis_key, json.dumps(message))

        # Emit the message to the client in real-time
           
            print(message,user_email,chat_id)
   


       
        
    def run(self, host='0.0.0.0', port=5000):
        self.socketio.run(self.app, host=host, port=port)    
           
            

server = LLMChatServer()
app = server.app
if __name__ == '__main__':
    # server = LLMChatServer()
    # app = server.app
    server.run()
