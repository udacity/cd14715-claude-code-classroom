/**
 * Sample Product Reviews for Testing
 */

export interface TestReview {
  name: string;
  text: string;
  expectedSentiment: "positive" | "negative" | "neutral";
}

export const sampleReviews: TestReview[] = [
  {
    name: "Positive laptop review",
    text: `Great laptop! Fast processor and beautiful display. Battery life could be
better, but overall very satisfied. Worth the price. The keyboard is comfortable
for long typing sessions and the trackpad is responsive. Highly recommend!`,
    expectedSentiment: "positive",
  },
  {
    name: "Negative headphones review",
    text: `Disappointed with these headphones. Sound quality is mediocre at best,
and they hurt my ears after 30 minutes. The noise cancellation barely works.
Returned them the same day. Save your money and buy something else.`,
    expectedSentiment: "negative",
  },
  {
    name: "Neutral camera review",
    text: `The camera is decent for the price point. Photo quality is acceptable
in good lighting but struggles in low light. Build quality feels cheap but
functional. It's not amazing but not terrible either. Gets the job done.`,
    expectedSentiment: "neutral",
  },
];
