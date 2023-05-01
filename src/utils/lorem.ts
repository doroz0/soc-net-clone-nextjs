import { LoremIpsum } from "lorem-ipsum";

const loremIpsum = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 1,
  },
  wordsPerSentence: {
    max: 10,
    min: 4,
  },
});

export const lorem = (n: number) => loremIpsum.generateParagraphs(n);
