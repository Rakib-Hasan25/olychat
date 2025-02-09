from operation.document_preprocessor import DocumentPreprocessor
from langchain.schema import Document
from lib.supabase_config import supabase
from lib.openai_config import openai_embedding_instance
from langchain_community.vectorstores import SupabaseVectorStore
def storedb(text,summarywithpage) :
    preprocessor = DocumentPreprocessor()

    #text processed 
    processed_text =[]
    if (text):
      value = [ preprocessor.process_document(x['text'],"1",x['page_number'])
           for x in text]
      for x in value:
        for fin_x in x:
          processed_text.append(Document(page_content=fin_x['content'], metadata=fin_x['metadata']),)
    
    
    #image processed 


    processed_image =[]
    if summarywithpage:
     value1 = [ preprocessor.process_document(x['summary'],"1",x['page_number'])
           for x in summarywithpage]
     for x in value1:
       for fin_x in x:
         processed_image.append(Document(page_content=fin_x['content'], metadata=fin_x['metadata']),)
    
    
    combined_text = processed_text+processed_image
    embeddings= openai_embedding_instance(model="text-embedding-ada-002")
   
   
   
    try:
      if combined_text:
        vector_store = SupabaseVectorStore.from_documents(
    combined_text,
    embeddings,
    client=supabase,
    table_name="documents",
    query_name="match_documents",
    chunk_size=500,
    )
      else:
         vector_store = SupabaseVectorStore.from_documents(
    embeddings,
    client=supabase,
    table_name="documents",
    query_name="match_documents",
    chunk_size=500,
    )
    except Exception as e:
       print("something went wrong")   
    print("store finally ", vector_store)
    return vector_store
    
    


