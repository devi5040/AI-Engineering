import { collection } from "./chroma.js";
import { embed } from "./lib/embedder.js";

const search = async (query: string) => {
  const vector = await embed(query);

  const result = await collection.query({
    queryEmbeddings: [vector],
    nResults: 5,
  });

  console.log(result.documents);
};

search(process.argv.slice(2).join(" "));
