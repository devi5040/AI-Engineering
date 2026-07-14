import { collection } from "./chroma.js";
import { chunkText } from "./lib/chunk.js";
import { embed } from "./lib/embedder.js";
import { loadAllDocs } from "./lib/loader.js";

const main = async () => {
  const docs = await loadAllDocs("D://AI-Engineering/Task1/docs");

  for (const doc of docs) {
    const chunks = chunkText(doc.text, doc.source);

    for (const chunk of chunks) {
      const vector = await embed(chunk.text);

      await collection.add({
        ids: [chunk.id],
        documents: [chunk.text],
        embeddings: [vector],
        metadatas: [{ source: chunk.source }],
      });

      console.log(`Indexed ${chunk.id}`);
    }
  }
  console.log("Finished indexing");
};

main();
