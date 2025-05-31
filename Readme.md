# 🚀🤖 OlyChat: Open-Source AI Platform for Modern Applications.

 OlyChat is an opensource respository which deliver chat intelligence, custom chatbots, and autonomous agents to deliver a complete AI toolkit..  
 
## Table of Contents
- [AI Chat](#ai-chat)
- [Custom Chatbot](#custom-chatbot)
- [Ai Agent](#ai-agent)
- [Installation](#installation)
- [Deployment Strategy](#deployment-strategy)
- [Contact](#contact)
- [Mission](#mission)



# AI Chat

## Features: 
- **Pdf Processing**: It perfectly extract text, image, table, charts etc and process them separately 
and give most relevent response.
- **Image Processing**: It process the image innear details and give response based on the query.
- **Web search**: For Web Search, we implemented our own mechanism, based on the query, it take decision and response youtube-video, reseach paper, images, blog-news.
- **Uploaded file ask**: Based on the user uploaded file content, it can give the best output.
- **Previous Context Ask**: Based on the user previous chat messages context, it can generate response  
- **Faster Response**: We implemented web socket for faster response, show real-time processing situation for better user experience 
- **Caching**: For message caching and low latency we used redis. Also implemented proper mechanism when to store message data in Database.
- **Clean & Fit markdown**: Generates clean, structured Markdown with accurate formatting .

## System Architecture : 

<div style="text-align: center;">
  <img src="https://vcsrtukgrkmxmxdoqhfa.supabase.co/storage/v1/object/public/file-storage/github%20image/aichat-systemachitecture.png" width="800" height="600">
</div>



## Complete Logic: 

<div style="text-align: center;">
  <img src="https://vcsrtukgrkmxmxdoqhfa.supabase.co/storage/v1/object/public/file-storage/github%20image/aichat-logic.png" width="1000" height="800">
</div>




# Custom Chatbot
<details>
<summary>📝 <strong>System Architecture </strong></summary>

not implemented yet...
</details>
<details>
<summary>📝 <strong>Complete Logic </strong></summary>

not implemented yet...
</details>




# AI Agent
<details>
<summary>📝 <strong>System Architecture </strong></summary>

not implemented yet...
</details>
<details>
<summary>📝 <strong>Complete Logic </strong></summary>

not implemented yet...
</details>












# Installation
<details>
  <summary>📝 <strong>Install Docker</strong></summary>
  <div style="margin-top: 10px;">1. 
    <a href="https://docs.docker.com/desktop/setup/install/windows-install/"> For windows</a>
  </div>
   <div style="margin-top: 10px;">
   2. 
    <a href="https://docs.docker.com/desktop/setup/install/mac-install/"> For Mac </a>
  </div>
   <div style="margin-top: 10px;">
   3. 
    <a href="https://docs.docker.com/engine/install/ubuntu/"> For Ubuntu </a>
  </div>
</details>
<details>
  <summary>📝 <strong>Set Up Supabase</strong></summary>

  <div style="margin-top: 10px;">
    <h4>1️⃣ Create a Supabase Project</h4>
    <ol>
      <li>Go to <a href="https://supabase.com" target="_blank">supabase.com</a> and log in.</li>
      <li>Click <strong>“New Project”</strong>.</li>
      <li>Set <strong>Project Name</strong> as <code>olychat</code>.</li>
      <li>Choose your <strong>organization</strong> and <strong>region</strong>.</li>
      <li>Set a <strong>secure password</strong> for the database.</li>
      <li>Click <strong>“Create new project”</strong>.</li>
    </ol>
  </div>

  <div style="margin-top: 20px;">
    <h4>2️⃣ Get API URL & Key</h4>
    <ol>
      <li>Once your project is created, go to <strong>Settings → API</strong>.</li>
      <li>Copy your <strong>Project URL </strong>(safe for env variable use).</li>
      <li>Copy the <strong>anon public API key</strong> (safe for env variable use).</li>
      <li>Use the <strong>service_role</strong> key only in secure server-side environments.</li>
    </ol>
  </div>

</details>

<details>
  <summary>📝 <strong>Create table</strong></summary>

  <div style="margin-top: 10px;">
    <h4>📐 ER Diagram</h4>
    <img src="https://vcsrtukgrkmxmxdoqhfa.supabase.co/storage/v1/object/public/file-storage/github%20image/Image%2031-5-25%20at%2011.37%20AM.jpeg" alt="ER Diagram" width="600" style="margin-top: 10px;" />
  </div>

  <div style="margin-top: 20px;">
    <h4>SQL Table Creation Code</h4>

```bash
-- Create Chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  title TEXT null ,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```


```bash
-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

 <h4>Create Vector Database Table</h4>


```bash
 create extension vector;

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT,                         -- Document.page_content
  metadata JSONB,                       -- Document.metadata
  embedding VECTOR(1536)                -- for OpenAI embeddings
);
CREATE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT NULL,
  filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE documents.metadata @> filter
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

```

  </div>

</details>

<details>
  <summary><strong>📝 Create Supabase Storage Bucket</strong></summary>

  <div style="margin-top: 10px;">
    <h4>🪣 Steps to Create a Storage Bucket</h4>
    <ol>
      <li>Go to <a href="https://supabase.com" target="_blank">Supabase Dashboard</a> and open your project (e.g., <code>olychat</code>).</li>
      <li>From the left sidebar, click on <strong>Storage</strong>.</li>
      <li>Click the <strong>“New bucket”</strong> button.</li>
      <li>Enter a <strong>Bucket name</strong> like <code>file-storage</code>.</li>
      <li>Choose the bucket type:
        <ul>
          <li><strong>Public</strong>: Accessible via direct URL</li>
          <li><strong>Private</strong>: Access controlled by policies</li>
        </ul>
      </li>
      <li>Click <strong>Create</strong>.</li>
    </ol>
  </div>

  <div style="margin-top: 20px;">
    <h4>📌 Example Public File URL</h4>
    <p>If you upload a file named <code>image.png</code> to the <code>file-storage</code> bucket, your file URL will look like this:</p>
    <pre><code>https://your-project-ref.supabase.co/storage/v1/object/public/chat-files/image.png</code></pre>
  </div>
</details>


<details>
  <summary>🚀 <strong>Set Up Project Locally</strong></summary>

  <div style="margin-top: 15px;">
    <h4>📥 Clone GitHub Repo</h4>
    <pre><code>https://github.com/Rakib-Hasan25/olychat
cd olychat
##open in vs code  
code . 
## open in cursor
cursor . 
</code></pre>
  </div>

  <div style="margin-top: 25px;">
    <h4>🧪 Create <code>.env</code> in <code>main_frontend_service</code></h4>
    <p>Create a <code>.env</code> file inside the <code>main_frontend_service</code> folder and paste the following:</p>
    <pre><code>
OPENAI_KEY=" get the openai-key"
REDIS_HOST=redis
REDIS_PORT=6379
NEXT_PUBLIC_SUPABASE_URL="get the supabase supabase project url "
NEXT_PUBLIC_SUPABASE_ANON_KEY= "get the supabase anon key" 
NEXT_PUBLIC_MAIN_BACKEND_SERVICE_URL=http://localhost:5001
MAIN_BACKEND_SERVICE_URL=http://main-backend-service:5001
    </code></pre>
  </div>

  <div style="margin-top: 25px;">
    <h4>🔧 Create <code>.env</code> in <code>main_backend_service</code></h4>
    <p>Create a <code>.env</code> file inside the <code>main_backend_service</code> folder and paste the following:</p>
    <pre><code>
OPENAI_API_KEY= "get the open ai key"
SUPABASE_URL="get the supabase supabase project url "
SUPABASE_SERVICE_KEY= "get the supabase anon key"
NODE_BACKEND_URL="http://search-service:3001"
REDIS_HOST="redis"
FLASK_APP=app.py 
    </code></pre>
  </div>

  <div style="margin-top: 25px;">
    <h4>🔍 Create <code>.env</code> in <code>search_service</code></h4>
    <p>Create a <code>.env</code> file inside the <code>search_service</code> folder and paste the following:</p>
    <pre><code>
SEARXNG_API_URL=http://searxng:8080
    </code></pre>
  </div>


  <div style="margin-top: 30px;">
    <h4>▶️ Start the Project</h4>
    <p>After setting up all the <code>.env</code> files, return to the root folder and run:</p>
    <pre><code>docker compose up --build</code></pre>
  </div>


</details>

# Deployment Strategy

## Continuous Integration Pipeline
 <div style="text-align: center;">
    <img src="https://vcsrtukgrkmxmxdoqhfa.supabase.co/storage/v1/object/public/file-storage/github%20image/diagram-export-5-31-2025-1_24_09-PM.svg" alt="CI"  height="700" />
  </div>

 ## Continuous Deployment Pipeline

 ### Local to Docker Hub
 
 <div style="text-align: center;">
    <img src="https://vcsrtukgrkmxmxdoqhfa.supabase.co/storage/v1/object/public/file-storage/github%20image/diagram-export-5-31-2025-5_00_48-PM.svg" alt="CD"   />
  </div> 


### Deployed image table
```markdown
| Service           | Docker Image                                  | Pull Command                                                      |
|-------------------    ------------------------------------------- |--------------------------------------------------------------------|
| Frontend          | `rakibhasan25/olychat_main_frontend_service`  | `docker pull rakibhasan25/olychat_main_frontend_service:latest`    |
| Backend           | `rakibhasan25/olychat_main_backend_service`   | `docker pull rakibhasan25/olychat_main_backend_service:latest     |
| Search Service    | `rakibhasan25/olychat_search_service`         | `docker pull rakibhasan25/olychat_search_service:latest`      |

```

# 📧 Contact 

For questions, suggestions, or feedback, feel free to reach out:

- GitHub: [Rakib Hasan](https://github.com/Rakib-Hasan25)
- Linkedin: [Rakib Hasan](https://www.linkedin.com/in/rakib-hasan-cuet/)
- Youtube: [Code With Rakib](https://www.youtube.com/@CodewithRakibOfficial/)
- Twitter: [Rakib Hasan](https://x.com/hasanrakib65)
- website: [Rakib Hasan](https://www.rakibhasan.me/)

Happy Coding! 🚀

## 🗾 Mission

Our mission is to make this repository a single, comprehensive resource that any AI chat application can reference.
We aim to empower developers to build AI chatbots for their businesses, and provide a centralized hub where all types of agent workflows are documented and maintained in one place..
