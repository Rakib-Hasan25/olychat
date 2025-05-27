import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();
const port = 3001;
const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
interface SearxngSearchOptions {
  categories?: string[];
  engines?: string[];
  language?: string;
  pageno?: number;
}

interface SearxngSearchResult {
  title: string;
  url: string;
  img_src?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  content?: string;
  author?: string;
  iframe_src?: string;
  pdf_url?: string;
}
const searchSearxng = async (
  query: string,
  opts?: SearxngSearchOptions,
) => {
  const searxngURL = 'http://searxng:8080';

  const url = new URL(`${searxngURL}/search?format=json`);
  url.searchParams.append('q', query);

  if (opts) {
    Object.keys(opts).forEach((key) => {
      const value = opts[key as keyof SearxngSearchOptions];
      if (Array.isArray(value)) {
        url.searchParams.append(key, value.join(','));
        return;
      }
      url.searchParams.append(key, value as string);
    });
  }

  const res = await axios.get(url.toString());

  const results: SearxngSearchResult[] = res.data.results;
  const suggestions: string[] = res.data.suggestions;

  return { results, suggestions };
};



app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Node.js!');
});

app.post("/youtube-search", async (req: any, res: any) => {
  try {
    const { query } = req.body;

    const result = await searchSearxng(query, {
      engines: ['youtube'],
    });

    const videos: any = [];

    result.results.forEach((result) => {
      if (
        result.thumbnail &&
        result.url &&
        result.title &&
        result.iframe_src
      ) {
        videos.push({
          img_src: result.thumbnail,
          url: result.url,
          title: result.title,
          iframe_src: result.iframe_src,
        });
      }
    });



    res.json({ videos: videos.slice(0, 5), });

  }
  catch (error) {
    console.log("error", error);
    res.json({ videos: [], error: error });
  }


})
app.post("/paper-search", async (req: any, res: any) => {
  try {
    const { query } = req.body;

    const result = await searchSearxng(query, {
      engines: ['arxiv', 'google scholar'],
    });

    const docs: any = [];

    result.results.forEach((result) => {
      if (
        result.url &&
        result.title &&
        result.content

      ) {
        docs.push({
          url: result.url,
          title: result.title,
          pdf_url: result?.pdf_url
        });
      }
    });



    res.json({ papers: docs.slice(0, 5), });

  }
  catch (error) {
    console.log("error", error);
    res.json({ papers: [] });
  }


})
app.post('/news-search', async (req: any, res: any) => {
  try {
    const { query } = req.body;
    // const data = (
    //   await Promise.all([
    //     searchSearxng('site:businessinsider.com AI', {
    //       engines: ['bing news'],
    //       pageno: 1,
    //     }),
    //     searchSearxng('site:www.exchangewire.com AI', {
    //       engines: ['bing news'],
    //       pageno: 1,
    //     }),
    //     searchSearxng('site:yahoo.com AI', {
    //       engines: ['bing news'],
    //       pageno: 1,
    //     }),
    //     searchSearxng('site:businessinsider.com tech', {
    //       engines: ['bing news'],
    //       pageno: 1,
    //     }),
    //     searchSearxng('site:www.exchangewire.com tech', {
    //       engines: ['bing news'],
    //       pageno: 1,
    //     }),
    //     searchSearxng('site:yahoo.com tech', {
    //       engines: ['bing news'],
    //       pageno: 1,
    //     }),
    //   ])
    // )
    //   .map((result) => result.results)
    //   .flat()
    //   .sort(() => Math.random() - 0.5);



    const data = await searchSearxng(query, {
      engines: ['bing news'],
      pageno: 1,
    })
    const result: any = []
    data.results.forEach((res) => {
      if (res.url && res.title) {
        result.push({
          url: res.url,
          title: res.title,
          content: res.content,
        });
      }
    });

    res.json({ news: result.slice(0, 5), });
  } catch (err: any) {
    console.log("err", err);
    res.json({ news: [] });
  }
});
app.post('/image-search', async (req: any, res: any) => {
  try {
    const { query } = req.body;
    const searchResult = await searchSearxng(query, {
      engines: ['bing images', 'google images'],
    });
    const images: any = [];

    searchResult.results.forEach((result) => {
      if (result.img_src && result.url && result.title) {
        images.push({
          img_src: result.img_src,
          url: result.url,
          title: result.title,
        });
      }
    });

    res.json({ images: images.slice(0, 5), });
  } catch (err: any) {
    console.log("err", err);
    res.json({ images: [] });
  }
});




app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
