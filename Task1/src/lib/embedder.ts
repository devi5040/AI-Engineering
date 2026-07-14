import {
  pipeline,
  type FeatureExtractionPipeline,
} from "@huggingface/transformers";

let extractor: any;

export const getExtractor = async () => {
  if (!extractor)
    extractor = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  return extractor;
};

export const embed = async (text: string): Promise<number[]> => {
  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};
