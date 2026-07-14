export interface Chunk {
  id: string;
  source: string;
  text: string;
}

export function chunkText(
  text: string,
  source: string,
  chunkSize = 500,
  overlap = 100,
): Chunk[] {
  const chunks: Chunk[] = [];
  let index = 0;

  for (let start = 0; start < text.length; start += chunkSize - overlap) {
    const end = Math.min(start + chunkSize, text.length);

    chunks.push({
      id: `${source}-${index++}`,
      source,
      text: text.slice(start, end),
    });
  }

  return chunks;
}
