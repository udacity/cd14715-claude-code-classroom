/**
 * Sample Emails for Testing the Email Etiquette Skill
 */

export interface TestEmail {
  name: string;
  content: string;
  expectedTone: "appropriate" | "too-casual" | "too-formal";
}

export const sampleEmails: TestEmail[] = [
  {
    name: "Too casual - slack-style",
    content: `hey boss, need you to sign off on that thing asap thx`,
    expectedTone: "too-casual",
  },
  {
    name: "Appropriate - professional",
    content: `Hi Sarah,

Thank you for your feedback on the proposal. I've updated the timeline
section as you suggested. Please let me know if you need any other changes.

Best regards,
Alex`,
    expectedTone: "appropriate",
  },
  {
    name: "Too formal - archaic",
    content: `Dear Sir or Madam,

I am writing to hereby formally request your esteemed consideration of the
aforementioned matter pertaining to the quarterly budget allocation.

I remain, respectfully, your humble servant.`,
    expectedTone: "too-formal",
  },
  {
    name: "Too casual - emoji and slang",
    content: `yo!! just wanted to check if ur coming to the meeting tmrw??
lmk asap plz :) :) :)`,
    expectedTone: "too-casual",
  },
  {
    name: "Appropriate - clear request",
    content: `Hi Team,

Quick reminder that the project deadline is this Friday at 5 PM.
Please submit your sections to the shared drive by Thursday EOD
so we have time for final review.

Let me know if you have any questions.

Thanks,
Jordan`,
    expectedTone: "appropriate",
  },
];
