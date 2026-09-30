// The questions of the FAQ (Faq.tsx), studios first, then a short run for investors. Every answer is made of
// what the page itself says (the player model, the ChatGPT comparison, the three jobs, the player types, the
// hero's figures and its calls to action); none adds a claim of its own.

export type Question = { q: string; a: string };

export const GROUPS: { label: string; items: Question[] }[] = [
  {
    label: "For studios",
    items: [
      {
        q: "What is a player model?",
        a: "A model of how people really play, built from what they do rather than what they say. It has watched millions of hours of gameplay, so it can play a build the way your players would and tell you why they behave the way they do.",
      },
      {
        q: "How is it different from ChatGPT?",
        a: "ChatGPT reads the internet, so it understands facts and how humans think. Our model watches gameplay, so it understands the game player: where they explore, what they grind, when they pay and the moment they quit.",
      },
      {
        q: "What can I use it for?",
        a: "Three jobs. Intelligence explains why your KPIs move and shows the clips behind the answer. Testing puts AI players on your build before your real ones get there. Game creation reads a game's loop and hooks from video and checks each new build against it.",
      },
      {
        q: "Which kinds of players does it model?",
        a: "The ones your game is made of: explorers who open every menu, grinders who run the same loop every night, spenders who pay the moment the value is clear, and the players you lose at the first wall that feels unfair.",
      },
      {
        q: "How does testing with AI players work?",
        a: "Point it at a build and a set of player models plays it the way your audience would, from the newcomer to the whale. You get back the defects, the friction points and the moments they happened, while there is still time to fix them.",
      },
      {
        q: "Does it replace my QA team or my analysts?",
        a: "It works alongside them. It gives them more playthroughs than a team can run by hand, and the why behind a number instead of a guess. Your people decide what to fix; the model shows them where to look.",
      },
      {
        q: "Does it fit the tools we already use?",
        a: "Intelligence comes as a BI plug-in, so the why sits next to the dashboards that already show you the what.",
      },
      {
        q: "How do I get started?",
        a: "Choose Try now at the top of the page to see the model at work, or sign in if your studio already has access.",
      },
    ],
  },
  {
    label: "For investors",
    items: [
      {
        q: "Why does this matter?",
        a: "Around two billion people play games, and studios still make their biggest calls without seeing how those players will behave. A model that plays like them turns launch guesses into evidence, on every build of every game.",
      },
      {
        q: "What makes the model hard to copy?",
        a: "It learned from millions of hours of real gameplay, and more than a million players already have a digital copy. Behaviour at that scale cannot be scraped from the internet; it has to be watched.",
      },
    ],
  },
];
