import mammoth from "mammoth";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

export interface LoadedFile {
  source: string;
  path: string;
  text: string;
}

export async function loadFile(filePath: string): Promise<string> {
  console.log("inside load file");
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".pdf": {
      const buffer = await readFile(filePath);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    }

    case ".docx": {
      const buffer = await readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    case ".txt":
    case ".md": {
      return readFile(filePath, "utf-8");
    }

    default: {
      throw new Error(`Unsupported file type "${ext}" for file: ${filePath}`);
    }
  }
}

export async function loadFolder(
  folderPath: string,
  extensions: string[],
): Promise<LoadedFile[]> {
  console.log("inside load folder");
  let entries: string[];
  console.log(folderPath);
  try {
    entries = await readdir(folderPath);
    console.log(entries);
  } catch (error) {
    return [];
  }

  const matching = entries.filter((name) =>
    extensions.includes(path.extname(name).toLowerCase()),
  );

  const results: LoadedFile[] = [];
  for (const name of matching) {
    const fullPath = path.join(folderPath, name);
    try {
      const text = await loadFile(fullPath);
      results.push({ source: name, path: fullPath, text });
    } catch (error) {
      console.warn(`Skipping ${name}: ${(error as Error).message}`);
    }
  }
  return results;
}

export async function loadAllDocs(docsRoot: string): Promise<LoadedFile[]> {
  console.log("------------------");
  console.log(docsRoot);
  console.log("------------------");
  const [pdfs, docs, markdowns, texts] = await Promise.all([
    loadFolder(path.join(docsRoot, "pdf"), [".pdf"]),
    loadFolder(path.join(docsRoot, "docs"), [".docx"]),
    loadFolder(path.join(docsRoot, "markdown"), [".md"]),
    loadFolder(path.join(docsRoot, "text"), [".txt"]),
  ]);

  return [...pdfs, ...docs, ...markdowns, ...texts];
}
